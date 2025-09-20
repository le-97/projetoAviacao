"""
Repository for ComplianceCheck entity operations.
"""

from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import and_, func, desc

from src.models.db_models_sqlite import ComplianceCheck
from src.repositories.base import BaseRepository


class ComplianceCheckRepository(BaseRepository[ComplianceCheck]):
    """Repository for ComplianceCheck operations."""
    
    def __init__(self, session: AsyncSession):
        super().__init__(session, ComplianceCheck)
    
    async def get_by_aircraft_and_regulation(
        self, 
        aircraft_model_id: UUID, 
        regulation_id: UUID
    ) -> List[ComplianceCheck]:
        """Get compliance checks for specific aircraft and regulation."""
        result = await self.session.execute(
            select(ComplianceCheck)
            .where(
                and_(
                    ComplianceCheck.aircraft_model_id == aircraft_model_id,
                    ComplianceCheck.regulation_id == regulation_id
                )
            )
            .order_by(desc(ComplianceCheck.check_date))
        )
        return result.scalars().all()
    
    async def get_latest_by_aircraft_and_regulation(
        self, 
        aircraft_model_id: UUID, 
        regulation_id: UUID
    ) -> Optional[ComplianceCheck]:
        """Get latest compliance check for specific aircraft and regulation."""
        result = await self.session.execute(
            select(ComplianceCheck)
            .where(
                and_(
                    ComplianceCheck.aircraft_model_id == aircraft_model_id,
                    ComplianceCheck.regulation_id == regulation_id
                )
            )
            .order_by(desc(ComplianceCheck.check_date))
            .limit(1)
        )
        return result.scalar_one_or_none()
    
    async def get_by_aircraft(self, aircraft_model_id: UUID) -> List[ComplianceCheck]:
        """Get all compliance checks for an aircraft model."""
        result = await self.session.execute(
            select(ComplianceCheck)
            .options(
                selectinload(ComplianceCheck.regulation).selectinload('authority'),
                selectinload(ComplianceCheck.aircraft_model)
            )
            .where(ComplianceCheck.aircraft_model_id == aircraft_model_id)
            .order_by(desc(ComplianceCheck.check_date))
        )
        return result.scalars().all()
    
    async def get_by_status(self, status: str) -> List[ComplianceCheck]:
        """Get compliance checks by status."""
        result = await self.session.execute(
            select(ComplianceCheck)
            .where(ComplianceCheck.status == status)
            .order_by(desc(ComplianceCheck.check_date))
        )
        return result.scalars().all()
    
    async def get_compliance_summary(
        self, 
        aircraft_model_id: UUID
    ) -> Dict[str, Any]:
        """Get compliance summary for an aircraft model."""
        # Get total counts by status
        result = await self.session.execute(
            select(
                ComplianceCheck.status,
                func.count(ComplianceCheck.id).label('count')
            )
            .where(ComplianceCheck.aircraft_model_id == aircraft_model_id)
            .group_by(ComplianceCheck.status)
        )
        
        status_counts = {row.status: row.count for row in result}
        total_checks = sum(status_counts.values())
        
        # Get average compliance percentage
        compliance_result = await self.session.execute(
            select(func.avg(ComplianceCheck.compliance_percentage))
            .where(
                and_(
                    ComplianceCheck.aircraft_model_id == aircraft_model_id,
                    ComplianceCheck.compliance_percentage.isnot(None)
                )
            )
        )
        
        avg_compliance = compliance_result.scalar() or 0.0
        
        return {
            'total_checks': total_checks,
            'status_counts': status_counts,
            'average_compliance': float(avg_compliance),
            'compliance_rate': status_counts.get('compliant', 0) / total_checks * 100 if total_checks > 0 else 0
        }
    
    async def get_checks_by_date_range(
        self,
        start_date: datetime,
        end_date: datetime,
        aircraft_model_id: Optional[UUID] = None
    ) -> List[ComplianceCheck]:
        """Get compliance checks within date range."""
        query = select(ComplianceCheck).where(
            and_(
                ComplianceCheck.check_date >= start_date,
                ComplianceCheck.check_date <= end_date
            )
        )
        
        if aircraft_model_id:
            query = query.where(ComplianceCheck.aircraft_model_id == aircraft_model_id)
        
        result = await self.session.execute(
            query.order_by(desc(ComplianceCheck.check_date))
        )
        return result.scalars().all()
    
    async def get_pending_checks(self, aircraft_model_id: UUID) -> List[ComplianceCheck]:
        """Get pending compliance checks for an aircraft model."""
        result = await self.session.execute(
            select(ComplianceCheck)
            .options(selectinload(ComplianceCheck.regulation))
            .where(
                and_(
                    ComplianceCheck.aircraft_model_id == aircraft_model_id,
                    ComplianceCheck.status == 'pending'
                )
            )
            .order_by(ComplianceCheck.check_date)
        )
        return result.scalars().all()