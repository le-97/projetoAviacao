"""
Repository for AircraftModel entity operations.
"""

from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from src.models.db_models_sqlite import AircraftModel
from src.repositories.base import BaseRepository


class AircraftModelRepository(BaseRepository[AircraftModel]):
    """Repository for AircraftModel operations."""
    
    def __init__(self, session: AsyncSession):
        super().__init__(session, AircraftModel)
    
    async def get_by_manufacturer_and_model(
        self, 
        manufacturer: str, 
        model: str
    ) -> List[AircraftModel]:
        """Get aircraft models by manufacturer and model name."""
        result = await self.session.execute(
            select(AircraftModel).where(
                AircraftModel.manufacturer == manufacturer,
                AircraftModel.model == model
            )
        )
        return result.scalars().all()
    
    async def get_by_model(self, model: str) -> List[AircraftModel]:
        """Get aircraft models by model name."""
        result = await self.session.execute(
            select(AircraftModel).where(AircraftModel.model == model)
        )
        return result.scalars().all()
    
    async def get_by_manufacturer(self, manufacturer: str) -> List[AircraftModel]:
        """Get all aircraft models by manufacturer."""
        result = await self.session.execute(
            select(AircraftModel).where(AircraftModel.manufacturer == manufacturer)
        )
        return result.scalars().all()
    
    async def get_by_category(self, category: str) -> List[AircraftModel]:
        """Get aircraft models by category."""
        result = await self.session.execute(
            select(AircraftModel).where(AircraftModel.category == category)
        )
        return result.scalars().all()
    
    async def get_by_type_certificate(self, type_certificate: str) -> Optional[AircraftModel]:
        """Get aircraft model by type certificate."""
        result = await self.session.execute(
            select(AircraftModel).where(AircraftModel.type_certificate == type_certificate)
        )
        return result.scalar_one_or_none()
    
    async def get_with_compliance_checks(self, aircraft_id: UUID) -> Optional[AircraftModel]:
        """Get aircraft model with all compliance checks."""
        result = await self.session.execute(
            select(AircraftModel)
            .options(
                selectinload(AircraftModel.compliance_checks)
                .selectinload('regulation')
                .selectinload('authority')
            )
            .where(AircraftModel.id == aircraft_id)
        )
        return result.scalar_one_or_none()
    
    async def get_with_regulations(self, aircraft_id: UUID) -> Optional[AircraftModel]:
        """Get aircraft model with applicable regulations."""
        result = await self.session.execute(
            select(AircraftModel)
            .options(
                selectinload(AircraftModel.regulations)
                .selectinload('authority')
            )
            .where(AircraftModel.id == aircraft_id)
        )
        return result.scalar_one_or_none()
    
    async def search_aircraft_models(
        self, 
        search_term: str, 
        category: Optional[str] = None
    ) -> List[AircraftModel]:
        """Search aircraft models by manufacturer, model or variant."""
        query = select(AircraftModel).where(
            AircraftModel.manufacturer.ilike(f"%{search_term}%") |
            AircraftModel.model.ilike(f"%{search_term}%") |
            AircraftModel.variant.ilike(f"%{search_term}%")
        )
        
        if category:
            query = query.where(AircraftModel.category == category)
        
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_manufacturers(self) -> List[str]:
        """Get list of unique manufacturers."""
        result = await self.session.execute(
            select(AircraftModel.manufacturer).distinct()
        )
        return [row[0] for row in result]
    
    async def get_categories(self) -> List[str]:
        """Get list of unique categories."""
        result = await self.session.execute(
            select(AircraftModel.category).distinct()
        )
        return [row[0] for row in result]