"""
Analytics API endpoints for aircraft fleet management.
Provides aggregated statistics, KPIs, and trend data.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, case, and_
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import json

from ..database import get_db
from ..models.db_models_sqlite import Aircraft, ComplianceRequirement
from ..services.compliance_service import ComplianceService

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/fleet-metrics")
async def get_fleet_metrics(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Get comprehensive fleet metrics and KPIs.
    """
    try:
        # Total aircraft count
        total_aircraft = db.query(Aircraft).count()
        
        # Total flight hours
        total_hours = db.query(func.sum(Aircraft.current_hours)).scalar() or 0
        
        # Average hours per aircraft
        avg_hours = total_hours / total_aircraft if total_aircraft > 0 else 0
        
        # Compliance status calculation
        compliance_service = ComplianceService(db)
        compliance_stats = {"compliant": 0, "warning": 0, "non_compliant": 0}
        
        aircraft_list = db.query(Aircraft).all()
        for aircraft in aircraft_list:
            report = compliance_service.get_compliance_report(aircraft.id)
            status = report.overall_status.lower().replace("_", "")
            
            if status in compliance_stats:
                compliance_stats[status] += 1
        
        # Compliance rate
        compliance_rate = (compliance_stats["compliant"] / total_aircraft * 100) if total_aircraft > 0 else 0
        
        # Upcoming inspections (next 90 days)
        ninety_days_ago = datetime.now() - timedelta(days=275)  # 365-90 = 275 days ago
        upcoming_inspections = db.query(Aircraft).filter(
            Aircraft.last_inspection <= ninety_days_ago
        ).count()
        
        # Aircraft by type distribution
        aircraft_types = db.query(
            Aircraft.aircraft_type,
            func.count(Aircraft.id).label('count')
        ).group_by(Aircraft.aircraft_type).all()
        
        type_distribution = [
            {"type": type_name, "count": count}
            for type_name, count in aircraft_types
        ]
        
        # Recent activity (last 30 days)
        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent_inspections = db.query(Aircraft).filter(
            Aircraft.last_inspection >= thirty_days_ago
        ).count()
        
        return {
            "total_aircraft": total_aircraft,
            "total_hours": int(total_hours),
            "avg_hours": round(avg_hours, 1),
            "compliance_rate": round(compliance_rate, 1),
            "compliance_distribution": compliance_stats,
            "upcoming_inspections": upcoming_inspections,
            "aircraft_by_type": type_distribution,
            "recent_inspections": recent_inspections,
            "last_updated": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating fleet metrics: {str(e)}")

@router.get("/compliance-trends")
async def get_compliance_trends(
    days: int = Query(30, description="Number of days to include in trend analysis"),
    db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    """
    Get historical compliance trends over specified time period.
    """
    try:
        compliance_service = ComplianceService(db)
        aircraft_list = db.query(Aircraft).all()
        
        # Generate trend data for the specified period
        trends = []
        for i in range(days):
            date = datetime.now() - timedelta(days=days - i - 1)
            
            # Simulate compliance status for each day
            # In a real implementation, you'd track historical compliance data
            daily_stats = {"compliant": 0, "warning": 0, "non_compliant": 0}
            
            for aircraft in aircraft_list:
                # Calculate compliance status as if checked on this date
                days_since_inspection = (date - aircraft.last_inspection).days
                
                if days_since_inspection > 365:
                    daily_stats["non_compliant"] += 1
                elif days_since_inspection > 330:
                    daily_stats["warning"] += 1
                else:
                    daily_stats["compliant"] += 1
            
            trends.append({
                "date": date.isoformat(),
                "compliant": daily_stats["compliant"],
                "warning": daily_stats["warning"],
                "non_compliant": daily_stats["non_compliant"],
                "total": len(aircraft_list)
            })
        
        return trends
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating compliance trends: {str(e)}")

@router.get("/alerts")
async def get_active_alerts(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    """
    Get active alerts for inspections and compliance issues.
    """
    try:
        compliance_service = ComplianceService(db)
        aircraft_list = db.query(Aircraft).all()
        alerts = []
        
        for aircraft in aircraft_list:
            days_since_inspection = (datetime.now() - aircraft.last_inspection).days
            next_inspection_due = aircraft.last_inspection + timedelta(days=365)
            
            # Critical: Overdue inspections
            if days_since_inspection > 365:
                alerts.append({
                    "id": f"overdue-{aircraft.id}",
                    "aircraft_id": aircraft.id,
                    "aircraft_name": aircraft.name,
                    "type": "inspection",
                    "message": "Inspeção anual vencida",
                    "due_date": next_inspection_due.isoformat(),
                    "priority": "critical",
                    "status": "overdue",
                    "days_overdue": days_since_inspection - 365
                })
            
            # High: Due soon (within 35 days)
            elif days_since_inspection > 330:
                days_until_due = 365 - days_since_inspection
                alerts.append({
                    "id": f"due-soon-{aircraft.id}",
                    "aircraft_id": aircraft.id,
                    "aircraft_name": aircraft.name,
                    "type": "inspection",
                    "message": f"Inspeção anual vencendo em {days_until_due} dias",
                    "due_date": next_inspection_due.isoformat(),
                    "priority": "high",
                    "status": "due-soon",
                    "days_until_due": days_until_due
                })
            
            # Medium: Approaching due date (within 60 days)
            elif days_since_inspection > 305:
                days_until_due = 365 - days_since_inspection
                alerts.append({
                    "id": f"approaching-{aircraft.id}",
                    "aircraft_id": aircraft.id,
                    "aircraft_name": aircraft.name,
                    "type": "inspection",
                    "message": f"Inspeção anual aproximando-se ({days_until_due} dias)",
                    "due_date": next_inspection_due.isoformat(),
                    "priority": "medium",
                    "status": "approaching",
                    "days_until_due": days_until_due
                })
        
        # Sort alerts by priority and due date
        priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        alerts.sort(key=lambda x: (priority_order.get(x["priority"], 4), x["due_date"]))
        
        return alerts
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching alerts: {str(e)}")

@router.get("/performance-metrics")
async def get_performance_metrics(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Get performance and operational metrics.
    """
    try:
        aircraft_list = db.query(Aircraft).all()
        
        if not aircraft_list:
            return {
                "utilization_rate": 0,
                "avg_monthly_hours": 0,
                "fleet_availability": 0,
                "maintenance_efficiency": 0,
                "cost_per_hour": 0
            }
        
        # Calculate utilization metrics
        total_hours = sum(aircraft.current_hours for aircraft in aircraft_list)
        avg_hours_per_aircraft = total_hours / len(aircraft_list)
        
        # Simulate operational metrics (in real system, these would come from operational data)
        utilization_rate = min(avg_hours_per_aircraft / 2000 * 100, 100)  # Assuming 2000h/year target
        avg_monthly_hours = avg_hours_per_aircraft / 12
        fleet_availability = 95.5  # Simulated
        maintenance_efficiency = 88.3  # Simulated
        cost_per_hour = 450.75  # Simulated in BRL
        
        return {
            "utilization_rate": round(utilization_rate, 1),
            "avg_monthly_hours": round(avg_monthly_hours, 1),
            "fleet_availability": fleet_availability,
            "maintenance_efficiency": maintenance_efficiency,
            "cost_per_hour": cost_per_hour,
            "total_operational_hours": int(total_hours),
            "aircraft_count": len(aircraft_list)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating performance metrics: {str(e)}")

@router.get("/requirements-summary")
async def get_requirements_summary(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Get summary of compliance requirements and their coverage.
    """
    try:
        # Get all requirements
        requirements = db.query(ComplianceRequirement).all()
        
        # Group by priority
        priority_counts = {}
        authority_counts = {}
        
        for req in requirements:
            # Count by priority
            priority = req.priority.value if hasattr(req.priority, 'value') else req.priority
            priority_counts[priority] = priority_counts.get(priority, 0) + 1
            
            # Count by authority
            authority_counts[req.authority] = authority_counts.get(req.authority, 0) + 1
        
        # Calculate coverage metrics
        total_requirements = len(requirements)
        aircraft_count = db.query(Aircraft).count()
        
        # Simulated compliance coverage
        high_priority_count = priority_counts.get("HIGH", 0) + priority_counts.get("CRITICAL", 0)
        coverage_rate = 92.5  # Simulated overall coverage rate
        
        return {
            "total_requirements": total_requirements,
            "priority_breakdown": priority_counts,
            "authority_breakdown": authority_counts,
            "coverage_rate": coverage_rate,
            "high_priority_requirements": high_priority_count,
            "aircraft_affected": aircraft_count,
            "last_review_date": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating requirements summary: {str(e)}")