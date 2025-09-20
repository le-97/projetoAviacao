"""
Redis cache service for the compliance microservice.

Provides async Redis operations with connection pooling, error handling,
and compliance-specific caching strategies.
"""

import json
import hashlib
import asyncio
from typing import Optional, Any, Dict, List
from datetime import datetime, timedelta
import redis.asyncio as redis
from contextlib import asynccontextmanager

from src.config import settings
from src.logger import get_logger


logger = get_logger(__name__)


class CacheService:
    """Async Redis cache service with connection pooling and error handling."""
    
    def __init__(self):
        self._redis: Optional[redis.Redis] = None
        self._connection_pool: Optional[redis.ConnectionPool] = None
        self._is_connected = False
        
    @property
    def is_enabled(self) -> bool:
        """Check if cache is enabled in settings."""
        return settings.cache_enabled
        
    @property 
    def is_connected(self) -> bool:
        """Check if Redis is connected."""
        return self._is_connected
        
    async def connect(self) -> bool:
        """
        Establish connection to Redis server.
        
        Returns:
            True if connection successful, False otherwise
        """
        try:
            # Create connection URL
            redis_url = f"redis://{settings.redis_host}:{settings.redis_port}/{settings.redis_db}"
            if settings.redis_password:
                redis_url = f"redis://:{settings.redis_password}@{settings.redis_host}:{settings.redis_port}/{settings.redis_db}"
            
            # Create connection pool
            self._connection_pool = redis.ConnectionPool.from_url(
                redis_url,
                socket_timeout=settings.redis_socket_timeout,
                socket_connect_timeout=settings.redis_socket_connect_timeout,
                max_connections=20,  # Pool size
                retry_on_timeout=True,
                health_check_interval=30
            )
            
            self._redis = redis.Redis(connection_pool=self._connection_pool)
            
            # Test connection
            await self._redis.ping()
            self._is_connected = True
            
            logger.info(
                "Redis connection established",
                extra={
                    "redis_host": settings.redis_host,
                    "redis_port": settings.redis_port,
                    "redis_db": settings.redis_db
                }
            )
            return True
            
        except Exception as e:
            logger.error(
                "Failed to connect to Redis",
                extra={
                    "error": str(e),
                    "redis_host": settings.redis_host,
                    "redis_port": settings.redis_port
                }
            )
            self._is_connected = False
            return False
    
    async def disconnect(self):
        """Close Redis connection and cleanup resources."""
        if self._redis:
            await self._redis.close()
        if self._connection_pool:
            await self._connection_pool.disconnect()
        self._is_connected = False
        logger.info("Redis connection closed")
    
    def _generate_cache_key(self, model: str, country: str) -> str:
        """
        Generate cache key for compliance check.
        
        Args:
            model: Aircraft model
            country: Country code
            
        Returns:
            Cache key string
        """
        # Normalize inputs
        model_normalized = model.upper().strip()
        country_normalized = country.upper().strip()
        
        # Create deterministic key
        key_data = f"{model_normalized}:{country_normalized}"
        
        # Add prefix
        return f"{settings.cache_key_prefix}check:{key_data}"
    
    def _serialize_data(self, data: Any) -> str:
        """
        Serialize data for Redis storage.
        
        Args:
            data: Data to serialize
            
        Returns:
            JSON string
        """
        # Handle Pydantic models
        if hasattr(data, 'model_dump'):
            return json.dumps(data.model_dump())
        elif hasattr(data, 'dict'):
            return json.dumps(data.dict())
        else:
            return json.dumps(data, default=str)
    
    def _deserialize_data(self, data: str) -> Dict:
        """
        Deserialize data from Redis.
        
        Args:
            data: JSON string from Redis
            
        Returns:
            Deserialized data
        """
        return json.loads(data)
    
    async def get_compliance_result(self, model: str, country: str) -> Optional[Dict]:
        """
        Get cached compliance result.
        
        Args:
            model: Aircraft model
            country: Country code
            
        Returns:
            Cached compliance result or None if not found
        """
        if not settings.cache_enabled or not self._is_connected:
            return None
            
        try:
            cache_key = self._generate_cache_key(model, country)
            cached_data = await self._redis.get(cache_key)
            
            if cached_data:
                result = self._deserialize_data(cached_data)
                
                logger.info(
                    "Cache hit for compliance check",
                    extra={
                        "cache_key": cache_key,
                        "model": model,
                        "country": country
                    }
                )
                return result
            else:
                logger.debug(
                    "Cache miss for compliance check",
                    extra={
                        "cache_key": cache_key,
                        "model": model,
                        "country": country
                    }
                )
                return None
                
        except Exception as e:
            logger.error(
                "Error retrieving from cache",
                extra={
                    "error": str(e),
                    "model": model,
                    "country": country
                }
            )
            return None
    
    async def set_compliance_result(
        self, 
        model: str, 
        country: str, 
        result: Any,
        ttl_seconds: Optional[int] = None
    ) -> bool:
        """
        Cache compliance result.
        
        Args:
            model: Aircraft model
            country: Country code
            result: Compliance result to cache
            ttl_seconds: Time to live in seconds (uses default if None)
            
        Returns:
            True if successfully cached, False otherwise
        """
        if not settings.cache_enabled or not self._is_connected:
            return False
            
        try:
            cache_key = self._generate_cache_key(model, country)
            serialized_data = self._serialize_data(result)
            
            ttl = ttl_seconds or settings.cache_ttl_seconds
            
            await self._redis.setex(
                cache_key,
                ttl,
                serialized_data
            )
            
            logger.info(
                "Cached compliance result",
                extra={
                    "cache_key": cache_key,
                    "model": model,
                    "country": country,
                    "ttl_seconds": ttl
                }
            )
            return True
            
        except Exception as e:
            logger.error(
                "Error caching compliance result",
                extra={
                    "error": str(e),
                    "model": model,
                    "country": country
                }
            )
            return False
    
    async def invalidate_compliance_result(self, model: str, country: str) -> bool:
        """
        Invalidate cached compliance result.
        
        Args:
            model: Aircraft model
            country: Country code
            
        Returns:
            True if successfully invalidated, False otherwise
        """
        if not self._is_connected:
            return False
            
        try:
            cache_key = self._generate_cache_key(model, country)
            deleted = await self._redis.delete(cache_key)
            
            logger.info(
                "Invalidated cache entry",
                extra={
                    "cache_key": cache_key,
                    "model": model,
                    "country": country,
                    "was_present": bool(deleted)
                }
            )
            return bool(deleted)
            
        except Exception as e:
            logger.error(
                "Error invalidating cache",
                extra={
                    "error": str(e),
                    "model": model,
                    "country": country
                }
            )
            return False
    
    async def clear_all_compliance_cache(self) -> int:
        """
        Clear all compliance-related cache entries.
        
        Returns:
            Number of keys deleted
        """
        if not self._is_connected:
            return 0
            
        try:
            pattern = f"{settings.cache_key_prefix}check:*"
            keys = await self._redis.keys(pattern)
            
            if keys:
                deleted = await self._redis.delete(*keys)
                logger.info(
                    "Cleared compliance cache",
                    extra={
                        "keys_deleted": deleted,
                        "pattern": pattern
                    }
                )
                return deleted
            return 0
            
        except Exception as e:
            logger.error(
                "Error clearing compliance cache",
                extra={"error": str(e)}
            )
            return 0
    
    async def get_cache_stats(self) -> Dict[str, Any]:
        """
        Get cache statistics and health information.
        
        Returns:
            Dictionary with cache statistics
        """
        if not self._is_connected:
            return {
                "connected": False,
                "error": "Not connected to Redis"
            }
            
        try:
            info = await self._redis.info()
            
            # Get specific compliance cache stats
            pattern = f"{settings.cache_key_prefix}check:*"
            compliance_keys = await self._redis.keys(pattern)
            
            return {
                "connected": True,
                "redis_version": info.get("redis_version"),
                "used_memory": info.get("used_memory_human"),
                "connected_clients": info.get("connected_clients"),
                "total_commands_processed": info.get("total_commands_processed"),
                "compliance_cache_entries": len(compliance_keys),
                "cache_enabled": settings.cache_enabled,
                "cache_ttl_seconds": settings.cache_ttl_seconds,
                "max_cache_size": settings.max_cache_size
            }
            
        except Exception as e:
            return {
                "connected": False,
                "error": str(e)
            }
    
    @property
    def is_connected(self) -> bool:
        """Check if Redis is connected."""
        return self._is_connected


# Global cache service instance
cache_service = CacheService()


@asynccontextmanager
async def get_cache_service():
    """Context manager for cache service with automatic connection management."""
    if not cache_service.is_connected:
        await cache_service.connect()
    
    try:
        yield cache_service
    finally:
        # Keep connection alive for reuse
        pass