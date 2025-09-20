"""
Repository for Regulation entity operations.
"""

from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from src.models.db_models_sqlite import Regulation
from src.repositories.base import BaseRepository


class RegulationRepository(BaseRepository[Regulation]):
    """Repository for Regulation operations."""
    
    def __init__(self, session: AsyncSession):
        super().__init__(session, Regulation)
    
    async def get_by_reference(self, reference: str) -> Optional[Regulation]:
        """Get regulation by reference."""
        result = await self.session.execute(
            select(Regulation).where(Regulation.reference == reference)
        )
        return result.scalar_one_or_none()
    
    async def get_by_authority(self, authority_id: UUID) -> List[Regulation]:
        """Get regulations by authority."""
        result = await self.session.execute(
            select(Regulation).where(Regulation.authority_id == authority_id)
        )
        return result.scalars().all()
    
    async def get_by_category(self, category: str) -> List[Regulation]:
        """Get regulations by category."""
        result = await self.session.execute(
            select(Regulation).where(Regulation.category == category)
        )
        return result.scalars().all()
    
    async def get_active_regulations(self) -> List[Regulation]:
        """Get all active regulations."""
        result = await self.session.execute(
            select(Regulation).where(Regulation.status == "active")
        )
        return result.scalars().all()
    
    async def get_with_authority(self, regulation_id: UUID) -> Optional[Regulation]:
        """Get regulation with authority information."""
        result = await self.session.execute(
            select(Regulation)
            .options(selectinload(Regulation.authority))
            .where(Regulation.id == regulation_id)
        )
        return result.scalar_one_or_none()
    
    async def get_by_aircraft_model(self, aircraft_model_id: UUID) -> List[Regulation]:
        """Get regulations applicable to an aircraft model."""
        result = await self.session.execute(
            select(Regulation)
            .join(Regulation.aircraft_models)
            .where(Regulation.aircraft_models.any(id=aircraft_model_id))
        )
        return result.scalars().all()
    
    async def search_regulations(
        self, 
        search_term: str, 
        category: Optional[str] = None,
        authority_id: Optional[UUID] = None
    ) -> List[Regulation]:
        """Search regulations by title, description or reference."""
        query = select(Regulation).where(
            Regulation.title.ilike(f"%{search_term}%") |
            Regulation.description.ilike(f"%{search_term}%") |
            Regulation.reference.ilike(f"%{search_term}%")
        )
        
        if category:
            query = query.where(Regulation.category == category)
        
        if authority_id:
            query = query.where(Regulation.authority_id == authority_id)
        
        result = await self.session.execute(query)
        return result.scalars().all()