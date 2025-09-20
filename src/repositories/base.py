"""
Base repository class providing common database operations.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Type, TypeVar, Generic, TYPE_CHECKING
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import delete, update, func
from sqlalchemy.exc import IntegrityError

if TYPE_CHECKING:
    from src.db.session import Base

ModelType = TypeVar("ModelType")


class BaseRepository(Generic[ModelType], ABC):
    """Base repository providing common CRUD operations."""
    
    def __init__(self, session: AsyncSession, model: Type[ModelType]):
        self.session = session
        self.model = model
    
    async def create(self, **kwargs) -> ModelType:
        """Create a new record."""
        try:
            instance = self.model(**kwargs)
            self.session.add(instance)
            await self.session.commit()
            await self.session.refresh(instance)
            return instance
        except IntegrityError as e:
            await self.session.rollback()
            raise ValueError(f"Failed to create {self.model.__name__}: {str(e)}")
    
    async def get_by_id(self, id: UUID) -> Optional[ModelType]:
        """Get record by ID."""
        result = await self.session.execute(
            select(self.model).where(self.model.id == id)
        )
        return result.scalar_one_or_none()
    
    async def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Get all records with pagination."""
        result = await self.session.execute(
            select(self.model).offset(skip).limit(limit)
        )
        return result.scalars().all()
    
    async def update(self, id: UUID, **kwargs) -> Optional[ModelType]:
        """Update record by ID."""
        try:
            # Remove None values and system fields
            update_data = {k: v for k, v in kwargs.items() if v is not None and k not in ['id', 'created_at']}
            
            if not update_data:
                return await self.get_by_id(id)
            
            stmt = update(self.model).where(self.model.id == id).values(**update_data)
            result = await self.session.execute(stmt)
            
            if result.rowcount == 0:
                return None
                
            await self.session.commit()
            return await self.get_by_id(id)
        except IntegrityError as e:
            await self.session.rollback()
            raise ValueError(f"Failed to update {self.model.__name__}: {str(e)}")
    
    async def delete(self, id: UUID) -> bool:
        """Delete record by ID."""
        try:
            stmt = delete(self.model).where(self.model.id == id)
            result = await self.session.execute(stmt)
            await self.session.commit()
            return result.rowcount > 0
        except IntegrityError as e:
            await self.session.rollback()
            raise ValueError(f"Failed to delete {self.model.__name__}: {str(e)}")
    
    async def exists(self, id: UUID) -> bool:
        """Check if record exists."""
        result = await self.session.execute(
            select(self.model.id).where(self.model.id == id)
        )
        return result.scalar_one_or_none() is not None
    
    async def count(self) -> int:
        """Count total records."""
        result = await self.session.execute(
            select(func.count(self.model.id))
        )
        return result.scalar()