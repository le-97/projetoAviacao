"""
Database dependencies for FastAPI dependency injection.
"""

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession

from .session import AsyncSessionLocal


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency to provide database session.
    
    Yields:
        AsyncSession: Database session for async operations
        
    Example:
        @app.get("/items/")
        async def read_items(db: AsyncSession = Depends(get_db)):
            # Use db session here
            pass
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def get_db_context() -> AsyncSession:
    """
    Get database session for use in context managers.
    
    Returns:
        AsyncSession: Database session
        
    Example:
        async with get_db_context() as db:
            # Use db session here
            pass
    """
    return AsyncSessionLocal()