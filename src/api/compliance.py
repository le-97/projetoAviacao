"""
API endpoints for compliance checking service with database integration.
"""

from fastapi import APIRouter, HTTPException, Depends, Query, Path
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any, Annotated
from enum import Enum
import asyncio

from src.services.enhanced_compliance_service import EnhancedComplianceService
from src.models.compliance import ComplianceReport, ErrorResponse
from src.database import get_async_session
from src.logger import log_business_event, log_security_event
from src.exceptions import ValidationError, DatabaseError, create_not_found_error


# Enums for path parameter validation
class AircraftModel(str, Enum):
    E175 = "E175"
    E175_E1 = "E175-E1"
    E175_E2 = "E175-E2"
    E190 = "E190"
    E190_E1 = "E190-E1"
    E190_E2 = "E190-E2"
    E195 = "E195"  
    E195_E1 = "E195-E1"
    E195_E2 = "E195-E2"
    B737 = "737"
    A320 = "A320"


class Country(str, Enum):
    USA = "USA"
    BRAZIL = "BRAZIL"
    EUROPE = "EUROPE"
    UK = "UK"
    CANADA = "CANADA"


# Create router instance
router = APIRouter(prefix="/compliance", tags=["compliance"])


async def get_compliance_service(session: AsyncSession = Depends(get_async_session)) -> EnhancedComplianceService:
    """Dependency to get compliance service instance."""
    return EnhancedComplianceService(session)

@router.get("/check/{model}/{country}", 
            response_model=ComplianceReport,
            operation_id="check_compliance")
async def check_compliance(
    model: Annotated[AircraftModel, Path(description="Aircraft model", example="E175")], 
    country: Annotated[Country, Path(description="Country/region for compliance check", example="USA")],
    compliance_service: EnhancedComplianceService = Depends(get_compliance_service)
):
    """
    Check compliance for an aircraft model in a specific country.
    
    Args:
        model: Aircraft model (e.g., "E175", "E175-E2", "737")
        country: Country to check compliance in (e.g., "USA", "BRAZIL", "EUROPE")
        
    Returns:
        ComplianceReport: Detailed compliance report with database-backed validation
        
    Raises:
        HTTPException: If validation fails or service error occurs
    """
    log_business_event(
        "compliance_check_request",
        {"model": model, "country": country}
    )
    
    result = await compliance_service.check_compliance(model, country)
    
    log_business_event(
        "compliance_check_response",
        {"model": model, "country": country, "status": result.overall_status}
    )
    
    return result


@router.get("/check-compliance", 
           response_model=ComplianceReport,
           summary="Check Aircraft Compliance (Legacy)",
           description="Legacy endpoint with enhanced database support")
async def check_compliance_legacy(
    model: Annotated[str, Query(
        description="Aircraft model to check compliance for",
        examples=["E175", "E175-E2", "E190", "E195", "Phenom-300E", "C-390"],
        pattern="^(E170|E175|E175-E1|E175-E2|E190|E190-E1|E190-E2|E195|E195-E1|E195-E2|Phenom-100EX|Phenom-300E|Praetor-500|Praetor-600|C-390|KC-390|A-29|EMB-203|737|A320)$"
    )],
    country: Annotated[str, Query(
        description="Country/region to check compliance against", 
        examples=["USA", "BRAZIL", "EUROPE"],
        pattern="^(USA|BRAZIL|EUROPE|usa|brazil|europe)$"
    )],
    compliance_service: EnhancedComplianceService = Depends(get_compliance_service)
):
    """Legacy endpoint for backward compatibility with enhanced database support."""
    try:
        log_business_event(
            "api_compliance_request_received",
            {"endpoint": "/check-compliance", "model": model, "country": country}
        )
        
        result = await compliance_service.check_compliance(model, country)
        
        log_business_event(
            "api_compliance_request_completed",
            {
                "endpoint": "/check-compliance", 
                "model": model, 
                "country": country,
                "status": result.overall_status,
                "response_code": 200
            }
        )
        
        return result
        
    except ValidationError as e:
        log_security_event(
            "api_validation_error",
            "warning",
            {
                "endpoint": "/check-compliance",
                "error_type": e.error_type,
                "message": e.message,
                "model": model,
                "country": country
            }
        )
        
        if e.error_type in ["MISSING_MODEL", "MISSING_COUNTRY"]:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": e.error_type,
                    "message": e.message,
                    "details": "Please provide valid model and country parameters"
                }
            )
        elif e.error_type in ["UNSUPPORTED_MODEL", "UNSUPPORTED_COUNTRY"]:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": e.error_type,
                    "message": e.message,
                    "details": "Check the API documentation for supported values"
                }
            )
        else:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "VALIDATION_ERROR",
                    "message": e.message,
                    "details": None
                }
            )


@router.get("/models", operation_id="get_supported_models")
async def get_supported_models(
    compliance_service: EnhancedComplianceService = Depends(get_compliance_service)
):
    """Get list of supported aircraft models from database."""
    try:
        # Get models from database
        all_aircraft = await compliance_service.aircraft_repo.get_all()
        db_models = [aircraft.model for aircraft in all_aircraft]
        
        # Get authorities from database  
        all_authorities = await compliance_service.authority_repo.get_all()
        db_countries = [auth.country for auth in all_authorities if auth.country]
        
        return {
            "models": compliance_service.supported_models,
            "countries": compliance_service.supported_countries,
            "database_models": db_models,
            "database_countries": db_countries,
            "total_aircraft_in_db": len(all_aircraft),
            "total_authorities_in_db": len(all_authorities)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving models: {str(e)}")


@router.get("/requirements/{model}/{country}", 
            response_model=dict,
            operation_id="get_requirements")
async def get_requirements(
    model: Annotated[AircraftModel, Path(description="Aircraft model", example="E175")], 
    country: Annotated[Country, Path(description="Country/region", example="USA")],
    compliance_service: EnhancedComplianceService = Depends(get_compliance_service)
):
    """Get applicable regulations for an aircraft model and country from database."""
    try:
        await compliance_service.validate_input(model, country)
        regulations = await compliance_service.get_applicable_regulations(model, country)
        
        return {
            "model": model,
            "country": country,
            "total_regulations": len(regulations),
            "regulations": regulations
        }
        
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving regulations: {str(e)}")


@router.get("/authorities", operation_id="get_authorities")
async def get_authorities(
    compliance_service: EnhancedComplianceService = Depends(get_compliance_service)
):
    """Get all aviation authorities from database."""
    try:
        authorities = await compliance_service.authority_repo.get_all()
        
        return {
            "total_authorities": len(authorities),
            "authorities": [
                {
                    "id": auth.id,
                    "code": auth.code,
                    "name": auth.name,
                    "country": auth.country,
                    "website": auth.website
                }
                for auth in authorities
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving authorities: {str(e)}")


@router.get("/aircraft", operation_id="get_aircraft_models")
async def get_aircraft_models(
    compliance_service: EnhancedComplianceService = Depends(get_compliance_service)
):
    """Get all aircraft models from database."""
    try:
        aircraft = await compliance_service.aircraft_repo.get_all()
        
        return {
            "total_aircraft": len(aircraft),
            "aircraft": [
                {
                    "id": ac.id,
                    "manufacturer": ac.manufacturer,
                    "model": ac.model,
                    "variant": ac.variant,
                    "type_certificate": ac.type_certificate,
                    "max_seats": ac.max_seats,
                    "max_weight_kg": ac.max_weight_kg
                }
                for ac in aircraft
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving aircraft: {str(e)}")


@router.get("/health", operation_id="health_check")
async def health_check(
    compliance_service: EnhancedComplianceService = Depends(get_compliance_service)
):
    """Health check endpoint with database connectivity test."""
    try:
        # Test database connectivity
        authorities_count = len(await compliance_service.authority_repo.get_all())
        aircraft_count = len(await compliance_service.aircraft_repo.get_all())
        regulations_count = len(await compliance_service.regulation_repo.get_all())
        
        return {
            "status": "healthy",
            "service": "enhanced_compliance",
            "database": "connected",
            "data_summary": {
                "authorities": authorities_count,
                "aircraft": aircraft_count,
                "regulations": regulations_count
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "enhanced_compliance",
            "database": "disconnected",
            "error": str(e)
        }


@router.get("/ai-analysis/{model}/{country}",
            operation_id="ai_enhanced_compliance_analysis")
async def ai_enhanced_compliance_analysis(
    model: Annotated[AircraftModel, Path(description="Aircraft model", example="E175")],
    country: Annotated[Country, Path(description="Target country", example="USA")],
    compliance_service: EnhancedComplianceService = Depends(get_compliance_service)
):
    """
    AI-enhanced compliance analysis using Hugging Face models.
    
    Provides intelligent analysis beyond basic rule-based compliance checking,
    including contextual insights, risk assessment, and recommendations.
    
    Args:
        model: Aircraft model (e.g., "e190", "phenom300", "kc390")
        country: Target country (e.g., "US", "EU", "UK", "CA")
        
    Returns:
        Enhanced compliance report with AI insights and recommendations
    """
    try:
        log_business_event(
            "ai_compliance_analysis_request",
            {"model": model, "country": country}
        )
        
        # Import AI service (lazy loading to handle missing dependencies)
        try:
            from src.services.aviation_ai_service import aviation_ai_analyzer
            
            # Run AI-enhanced analysis
            result = await aviation_ai_analyzer.analyze_compliance_with_ai(model, country)
            
            log_business_event(
                "ai_compliance_analysis_completed",
                {
                    "model": model, 
                    "country": country,
                    "status": result.get('overallStatus', 'unknown'),
                    "ai_enhanced": result.get('aiEnhanced', False),
                    "fallback_used": result.get('aiAnalysis', {}).get('fallback_used', False)
                }
            )
            
            return result
            
        except ImportError as e:
            log_security_event(
                "ai_dependencies_missing",
                "WARNING",
                {"error": str(e), "model": model, "country": country}
            )
            
            # Fallback to regular compliance check
            regular_result = await compliance_service.check_compliance(model, country)
            
            # Convert to AI-style response format
            fallback_result = {
                "aircraft": model,
                "originCountry": "Brasil (ANAC)",
                "targetCountry": country,
                "overallStatus": regular_result.overall_status,
                "riskLevel": "medium",
                "estimatedTimeline": "6-12 months",
                "successProbability": 0.75,
                "generatedAt": regular_result.generated_at,
                "aiEnhanced": False,
                "error": "AI dependencies not available, using fallback analysis",
                "fallback": True,
                "regularComplianceResult": regular_result.dict()
            }
            
            return fallback_result
        
    except ValidationError as e:
        log_security_event(
            "ai_compliance_validation_error",
            "WARNING",
            {"model": model, "country": country, "error": e.message}
        )
        raise HTTPException(status_code=400, detail=e.message)
    
    except Exception as e:
        log_security_event(
            "ai_compliance_analysis_error",
            "ERROR",
            {"model": model, "country": country, "error": str(e)}
        )
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")


@router.get("/gap-analysis/{model}/{origin_country}/{target_country}",
            operation_id="regulatory_gap_analysis")
async def regulatory_gap_analysis(
    model: Annotated[AircraftModel, Path(description="Aircraft model", example="E175")],
    origin_country: Annotated[Country, Path(description="Origin country", example="BRAZIL")],
    target_country: Annotated[Country, Path(description="Target country", example="USA")],
    compliance_service: EnhancedComplianceService = Depends(get_compliance_service)
):
    """
    Comprehensive gap analysis between origin and target country regulations.
    
    Identifies specific regulatory differences, missing certifications, 
    additional requirements, and provides detailed action plan for compliance.
    
    Args:
        model: Aircraft model (e.g., "e190", "phenom300", "kc390")
        origin_country: Origin country (e.g., "BR", "US", "EU")
        target_country: Target country (e.g., "US", "EU", "UK", "CA")
        
    Returns:
        Detailed gap analysis with action items and timelines
    """
    try:
        log_business_event(
            "gap_analysis_request",
            {"model": model, "origin": origin_country, "target": target_country}
        )
        
        # Get compliance status for both countries
        origin_compliance = await compliance_service.check_compliance(model, origin_country)
        target_compliance = await compliance_service.check_compliance(model, target_country)
        
        # Analyze gaps between regulations
        gaps = _analyze_regulatory_gaps(origin_compliance, target_compliance, model, origin_country, target_country)
        
        log_business_event(
            "gap_analysis_completed",
            {"model": model, "gaps_found": len(gaps.get("gaps", [])), "risk_level": gaps.get("overallRisk")}
        )
        
        return gaps
        
    except ValidationError as e:
        log_security_event(
            "gap_analysis_validation_error",
            "WARNING",
            {"model": model, "origin": origin_country, "target": target_country, "error": e.message}
        )
        raise HTTPException(status_code=400, detail=e.message)
    
    except Exception as e:
        log_security_event(
            "gap_analysis_error",
            "ERROR",
            {"model": model, "origin": origin_country, "target": target_country, "error": str(e)}
        )
        raise HTTPException(status_code=500, detail=f"Gap analysis failed: {str(e)}")


def _analyze_regulatory_gaps(origin_compliance, target_compliance, model: str, origin_country: str, target_country: str):
    """Analyze regulatory gaps between two compliance reports."""
    
    # Country authority mapping
    country_authorities = {
        "BR": {"name": "Brasil", "authority": "ANAC"},
        "US": {"name": "Estados Unidos", "authority": "FAA"},
        "EU": {"name": "União Europeia", "authority": "EASA"},
        "UK": {"name": "Reino Unido", "authority": "UK CAA"},
        "CA": {"name": "Canadá", "authority": "Transport Canada"},
        "AR": {"name": "Argentina", "authority": "ANAC Argentina"}
    }
    
    origin_info = country_authorities.get(origin_country.upper(), {"name": origin_country, "authority": "Unknown"})
    target_info = country_authorities.get(target_country.upper(), {"name": target_country, "authority": "Unknown"})
    
    # Analyze specific gaps based on target country requirements
    gaps = []
    recommendations = []
    estimated_timeline = "6-12 months"
    overall_risk = "medium"
    
    # US-specific gaps
    if target_country.upper() == "US":
        gaps.extend([
            {
                "category": "Type Certification",
                "requirement": "FAA Type Certificate or Validation",
                "current_status": "Missing" if origin_country.upper() != "US" else "Available",
                "gap_description": "Requires FAA type certificate validation or acceptance of foreign type certificate",
                "impact": "high",
                "estimated_effort": "6-12 months",
                "cost_estimate": "$250,000 - $1,000,000"
            },
            {
                "category": "Noise Certification",
                "requirement": "FAR Part 36 Noise Certificate",
                "current_status": "Verification Required",
                "gap_description": "Must demonstrate compliance with FAR Part 36 noise standards",
                "impact": "medium",
                "estimated_effort": "3-6 months",
                "cost_estimate": "$50,000 - $150,000"
            },
            {
                "category": "Environmental",
                "requirement": "EPA Emission Compliance",
                "current_status": "Assessment Required",
                "gap_description": "Environmental Protection Agency emission standards compliance",
                "impact": "medium",
                "estimated_effort": "2-4 months",
                "cost_estimate": "$25,000 - $75,000"
            }
        ])
        
        if model.lower() in ["kc390", "kc-390"]:
            gaps.append({
                "category": "Military/Export Control",
                "requirement": "ITAR Compliance",
                "current_status": "Required",
                "gap_description": "International Traffic in Arms Regulations compliance for military aircraft",
                "impact": "critical",
                "estimated_effort": "12-24 months",
                "cost_estimate": "$500,000 - $2,000,000"
            })
            overall_risk = "high"
        
        recommendations.extend([
            "Engage FAA-certified representative early in the process",
            "Prepare comprehensive technical documentation package",
            "Schedule pre-application meetings with FAA",
            "Consider type certificate validation pathway if original certification exists"
        ])
    
    # EU-specific gaps
    elif target_country.upper() == "EU":
        gaps.extend([
            {
                "category": "Type Certification",
                "requirement": "EASA Type Certificate",
                "current_status": "Missing" if origin_country.upper() not in ["EU", "UK"] else "Available",
                "gap_description": "EASA type certificate required for EU operations",
                "impact": "high",
                "estimated_effort": "8-14 months",
                "cost_estimate": "$300,000 - $1,200,000"
            },
            {
                "category": "Environmental",
                "requirement": "ICAO Annex 16 Compliance",
                "current_status": "Verification Required",
                "gap_description": "Strict noise and emission limits per ICAO Annex 16",
                "impact": "high",
                "estimated_effort": "4-8 months",
                "cost_estimate": "$100,000 - $300,000"
            },
            {
                "category": "Safety",
                "requirement": "EASA Safety Assessment",
                "current_status": "Required",
                "gap_description": "Comprehensive safety assessment per EASA requirements",
                "impact": "medium",
                "estimated_effort": "6-10 months",
                "cost_estimate": "$150,000 - $400,000"
            }
        ])
        
        recommendations.extend([
            "Engage EASA early through pre-certification meetings",
            "Ensure compliance with latest environmental standards",
            "Prepare for extensive documentation requirements",
            "Consider bilateral agreement benefits with origin country"
        ])
    
    # UK-specific gaps (post-Brexit)
    elif target_country.upper() == "UK":
        gaps.extend([
            {
                "category": "Type Certification",
                "requirement": "UK CAA Type Certificate",
                "current_status": "Required",
                "gap_description": "Post-Brexit requirement for separate UK type certificate",
                "impact": "high",
                "estimated_effort": "6-12 months",
                "cost_estimate": "$200,000 - $800,000"
            },
            {
                "category": "Brexit Transition",
                "requirement": "UK Aviation Transition Documentation",
                "current_status": "Required",
                "gap_description": "Additional documentation due to UK's exit from EASA framework",
                "impact": "medium",
                "estimated_effort": "3-6 months",
                "cost_estimate": "$50,000 - $150,000"
            }
        ])
        
        overall_risk = "medium"
        recommendations.extend([
            "Navigate post-Brexit regulatory framework carefully",
            "Consider expedited pathways for existing EASA certifications",
            "Prepare for additional UK-specific requirements"
        ])
    
    # Canada-specific gaps
    elif target_country.upper() == "CA":
        gaps.extend([
            {
                "category": "Type Certification",
                "requirement": "Transport Canada Type Certificate",
                "current_status": "Missing" if origin_country.upper() != "CA" else "Available",
                "gap_description": "Transport Canada type certificate or validation required",
                "impact": "high",
                "estimated_effort": "4-8 months",
                "cost_estimate": "$150,000 - $600,000"
            },
            {
                "category": "Bilateral Agreement",
                "requirement": "BASA Agreement Benefits",
                "current_status": "Available" if origin_country.upper() in ["US", "BR"] else "Not Available",
                "gap_description": "Bilateral Aviation Safety Agreement may expedite certification",
                "impact": "positive",
                "estimated_effort": "Reduced timeline",
                "cost_estimate": "Cost savings possible"
            }
        ])
        
        if origin_country.upper() in ["US", "BR"]:
            overall_risk = "low"
            estimated_timeline = "3-6 months"
            recommendations.append("Leverage BASA agreement for expedited certification")
    
    # Calculate overall metrics
    high_impact_gaps = len([g for g in gaps if g.get("impact") == "high"])
    critical_gaps = len([g for g in gaps if g.get("impact") == "critical"])
    
    if critical_gaps > 0:
        overall_risk = "critical"
        estimated_timeline = "12-24 months"
    elif high_impact_gaps > 2:
        overall_risk = "high"
        estimated_timeline = "8-15 months"
    
    return {
        "analysis": {
            "model": model,
            "originCountry": f"{origin_info['name']} ({origin_info['authority']})",
            "targetCountry": f"{target_info['name']} ({target_info['authority']})",
            "analysisDate": origin_compliance.generated_at
        },
        "summary": {
            "totalGaps": len(gaps),
            "criticalGaps": critical_gaps,
            "highImpactGaps": high_impact_gaps,
            "overallRisk": overall_risk,
            "estimatedTimeline": estimated_timeline,
            "estimatedCostRange": _calculate_cost_range(gaps)
        },
        "gaps": gaps,
        "recommendations": recommendations,
        "actionPlan": _generate_action_plan(gaps, target_country),
        "regulatoryContext": {
            "originFramework": _get_regulatory_framework(origin_country),
            "targetFramework": _get_regulatory_framework(target_country),
            "bilateralAgreements": _check_bilateral_agreements(origin_country, target_country)
        }
    }


def _calculate_cost_range(gaps):
    """Calculate estimated cost range for addressing all gaps."""
    min_cost = 0
    max_cost = 0
    
    for gap in gaps:
        cost_str = gap.get("cost_estimate", "$0 - $0")
        # Extract numbers from cost estimate string
        import re
        numbers = re.findall(r'\$?([\d,]+)', cost_str)
        if len(numbers) >= 2:
            min_val = int(numbers[0].replace(',', ''))
            max_val = int(numbers[1].replace(',', ''))
            min_cost += min_val
            max_cost += max_val
    
    return f"${min_cost:,} - ${max_cost:,}"


def _generate_action_plan(gaps, target_country):
    """Generate prioritized action plan based on gaps."""
    action_items = []
    
    # Prioritize critical and high-impact gaps
    critical_gaps = [g for g in gaps if g.get("impact") == "critical"]
    high_gaps = [g for g in gaps if g.get("impact") == "high"]
    
    phase = 1
    
    if critical_gaps:
        action_items.append({
            "phase": phase,
            "title": "Critical Requirements (Immediate Action)",
            "duration": "0-3 months",
            "items": [f"Address {gap['requirement']}: {gap['gap_description']}" for gap in critical_gaps]
        })
        phase += 1
    
    if high_gaps:
        action_items.append({
            "phase": phase,
            "title": "High Priority Certifications",
            "duration": "3-8 months",
            "items": [f"Complete {gap['requirement']}: {gap['gap_description']}" for gap in high_gaps]
        })
        phase += 1
    
    action_items.append({
        "phase": phase,
        "title": "Final Validation and Documentation",
        "duration": "1-2 months",
        "items": [
            "Submit final certification package",
            "Coordinate with target authority for final review",
            "Prepare for operational approval",
            "Finalize compliance documentation"
        ]
    })
    
    return action_items


def _get_regulatory_framework(country_code):
    """Get regulatory framework information for a country."""
    frameworks = {
        "BR": {
            "authority": "ANAC Brasil",
            "framework": "RBAC (Regulamento Brasileiro da Aviação Civil)",
            "standards": "ICAO compliant with local adaptations",
            "strengths": ["Strong commercial aviation framework", "BASA agreements with US/Canada"]
        },
        "US": {
            "authority": "FAA",
            "framework": "Federal Aviation Regulations (FAR)",
            "standards": "Most stringent global standards",
            "strengths": ["Comprehensive safety oversight", "Advanced certification processes"]
        },
        "EU": {
            "authority": "EASA",
            "framework": "European Aviation Safety Regulations",
            "standards": "Harmonized European standards",
            "strengths": ["Environmental leadership", "Unified European market access"]
        },
        "UK": {
            "authority": "UK CAA",
            "framework": "UK Aviation Regulations (post-Brexit)",
            "standards": "Based on EASA with UK modifications",
            "strengths": ["Flexible post-Brexit framework", "Experienced regulator"]
        },
        "CA": {
            "authority": "Transport Canada",
            "framework": "Canadian Aviation Regulations (CARs)",
            "standards": "ICAO compliant with bilateral agreements",
            "strengths": ["BASA agreements", "Streamlined processes"]
        }
    }
    
    return frameworks.get(country_code.upper(), {
        "authority": "Unknown",
        "framework": "Country-specific regulations",
        "standards": "Typically ICAO based",
        "strengths": ["Varies by country"]
    })


def _check_bilateral_agreements(origin_country, target_country):
    """Check for bilateral aviation safety agreements."""
    basa_pairs = [
        ("BR", "US"), ("US", "BR"),
        ("BR", "CA"), ("CA", "BR"),
        ("US", "CA"), ("CA", "US"),
        ("EU", "US"), ("US", "EU"),
        ("EU", "CA"), ("CA", "EU")
    ]
    
    pair = (origin_country.upper(), target_country.upper())
    has_basa = pair in basa_pairs
    
    return {
        "hasBilateralAgreement": has_basa,
        "agreementType": "BASA (Bilateral Aviation Safety Agreement)" if has_basa else "None",
        "benefits": [
            "Expedited certification process",
            "Mutual recognition of certifications",
            "Reduced documentation requirements",
            "Cost and time savings"
        ] if has_basa else [],
        "limitations": [] if has_basa else [
            "Full certification process required",
            "Extended timeline and costs",
            "Potential for regulatory differences"
        ]
    }


@router.get("/", operation_id="compliance_root")
async def compliance_root():
    """Root endpoint with API information."""
    return {
        "service": "Enhanced Aviation Compliance API",
        "version": "2.1.0",
        "description": "Database-backed compliance checking with AI-enhanced analysis",
        "features": [
            "Database-driven aircraft model validation",
            "Authority-specific regulation retrieval", 
            "Enhanced E175 and E-Jets E2 support",
            "Model-specific compliance validation",
            "Comprehensive reporting and recommendations",
            "🤖 AI-enhanced analysis with Hugging Face models",
            "🧠 Intelligent risk assessment and insights",
            "🎯 Contextual recommendations and timeline estimation"
        ],
        "endpoints": {
            "check": "/compliance/check/{model}/{country}",
            "check_legacy": "/compliance/check-compliance",
            "ai_analysis": "/compliance/ai-analysis/{model}/{country}",
            "models": "/compliance/models",
            "regulations": "/compliance/regulations/{model}/{country}",
            "authorities": "/compliance/authorities",
            "aircraft": "/compliance/aircraft",
            "health": "/compliance/health"
        },
        "ai_capabilities": {
            "models": [
                "Legal document classification",
                "Regulatory similarity analysis", 
                "Contextual insight generation",
                "Risk factor identification"
            ],
            "fallback": "Graceful degradation to rule-based analysis if AI unavailable"
        }
    }
