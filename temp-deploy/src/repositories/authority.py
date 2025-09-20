"""
Repository for Authority entity operations.
"""

from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from src.models.db_models_sqlite import Authority
from src.repositories.base import BaseRepository


class AuthorityRepository(BaseRepository[Authority]):
    """Repository for Authority operations."""
    
    def __init__(self, session: AsyncSession):
        super().__init__(session, Authority)
    
    async def get_by_code(self, code: str) -> Optional[Authority]:
        """Get authority by code."""
        result = await self.session.execute(
            select(Authority).where(Authority.code == code)
        )
        return result.scalar_one_or_none()
    
    async def get_by_country(self, country: str) -> List[Authority]:
        """Get authorities by country."""
        result = await self.session.execute(
            select(Authority).where(Authority.country == country)
        )
        return result.scalars().all()
    
    async def get_with_regulations(self, authority_id) -> Optional[Authority]:
        """Get authority with all its regulations."""
        result = await self.session.execute(
            select(Authority)
            .options(selectinload(Authority.regulations))
            .where(Authority.id == authority_id)
        )
        return result.scalar_one_or_none()
    
    async def search_by_name(self, search_term: str) -> List[Authority]:
        """Search authorities by name."""
        result = await self.session.execute(
            select(Authority).where(
                Authority.name.ilike(f"%{search_term}%")
            )
        )
        return result.scalars().all()