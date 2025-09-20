"""
Additional tests for cache service coverage and edge cases.

This module provides comprehensive testing for cache functionality,
error handling, and integration scenarios.
"""

import pytest
import pytest_asyncio
from unittest.mock import patch, MagicMock, AsyncMock
import json
import redis.exceptions
from src.services.cache_service import CacheService, cache_service
from src.models.compliance import ComplianceReport


class TestCacheServiceConnection:
    """Test cache service connection functionality."""

    def setup_method(self):
        """Set up test fixtures."""
        self.cache = CacheService()

    @pytest.mark.asyncio
    async def test_connect_success(self):
        """Test successful Redis connection."""
        with patch('redis.asyncio.Redis') as mock_redis:
            mock_client = AsyncMock()
            mock_redis.return_value = mock_client
            mock_client.ping.return_value = True
            
            await self.cache.connect()
            
            assert self.cache.is_connected is True
            mock_client.ping.assert_called_once()

    @pytest.mark.asyncio
    async def test_connect_failure(self):
        """Test Redis connection failure."""
        with patch('redis.asyncio.Redis') as mock_redis:
            mock_client = AsyncMock()
            mock_redis.return_value = mock_client
            mock_client.ping.side_effect = redis.exceptions.ConnectionError("Connection failed")
            
            await self.cache.connect()
            
            assert self.cache.is_connected is False

    @pytest.mark.asyncio
    async def test_disconnect(self):
        """Test Redis disconnection."""
        mock_client = AsyncMock()
        self.cache.client = mock_client
        self.cache.is_connected = True
        
        await self.cache.disconnect()
        
        mock_client.close.assert_called_once()
        assert self.cache.client is None
        assert self.cache.is_connected is False

    @pytest.mark.asyncio
    async def test_disconnect_when_not_connected(self):
        """Test disconnection when not connected."""
        self.cache.client = None
        self.cache.is_connected = False
        
        # Should not raise exception
        await self.cache.disconnect()
        
        assert self.cache.client is None
        assert self.cache.is_connected is False


class TestCacheServiceOperations:
    """Test cache service operations."""

    def setup_method(self):
        """Set up test fixtures."""
        self.cache = CacheService()
        self.cache.client = AsyncMock()
        self.cache.is_connected = True

    @pytest.mark.asyncio
    async def test_get_compliance_result_hit(self):
        """Test getting compliance result from cache (hit)."""
        cached_data = {
            "aircraft_model": "E190",
            "country": "USA",
            "status": "PENDING",
            "pending_requirements": ["AD-2025-12: Wing inspection required"]
        }
        
        self.cache.client.get.return_value = json.dumps(cached_data)
        
        result = await self.cache.get_compliance_result("E190", "USA")
        
        assert result == cached_data
        self.cache.client.get.assert_called_once_with("compliance:E190:USA")

    @pytest.mark.asyncio
    async def test_get_compliance_result_miss(self):
        """Test getting compliance result from cache (miss)."""
        self.cache.client.get.return_value = None
        
        result = await self.cache.get_compliance_result("E190", "USA")
        
        assert result is None
        self.cache.client.get.assert_called_once_with("compliance:E190:USA")

    @pytest.mark.asyncio
    async def test_get_compliance_result_invalid_json(self):
        """Test getting compliance result with invalid JSON."""
        self.cache.client.get.return_value = "invalid json"
        
        result = await self.cache.get_compliance_result("E190", "USA")
        
        assert result is None

    @pytest.mark.asyncio
    async def test_get_compliance_result_redis_error(self):
        """Test getting compliance result with Redis error."""
        self.cache.client.get.side_effect = redis.exceptions.RedisError("Redis error")
        
        result = await self.cache.get_compliance_result("E190", "USA")
        
        assert result is None

    @pytest.mark.asyncio
    async def test_set_compliance_result_success(self):
        """Test setting compliance result in cache."""
        report = ComplianceReport(
            aircraft_model="E190",
            country="USA",
            status="PENDING",
            pending_requirements=["AD-2025-12: Wing inspection required"]
        )
        
        await self.cache.set_compliance_result("E190", "USA", report)
        
        # Verify the data was set correctly
        call_args = self.cache.client.setex.call_args
        assert call_args[0][0] == "compliance:E190:USA"  # key
        assert call_args[0][1] == 300  # TTL
        
        # Parse the JSON data that was set
        cached_data = json.loads(call_args[0][2])
        assert cached_data["aircraft_model"] == "E190"
        assert cached_data["country"] == "USA"
        assert cached_data["status"] == "PENDING"

    @pytest.mark.asyncio
    async def test_set_compliance_result_redis_error(self):
        """Test setting compliance result with Redis error."""
        report = ComplianceReport(
            aircraft_model="E190",
            country="USA",
            status="OK",
            pending_requirements=[]
        )
        
        self.cache.client.setex.side_effect = redis.exceptions.RedisError("Redis error")
        
        # Should not raise exception
        await self.cache.set_compliance_result("E190", "USA", report)

    @pytest.mark.asyncio
    async def test_invalidate_compliance_cache_success(self):
        """Test invalidating compliance cache."""
        await self.cache.invalidate_compliance_cache("E190", "USA")
        
        self.cache.client.delete.assert_called_once_with("compliance:E190:USA")

    @pytest.mark.asyncio
    async def test_invalidate_compliance_cache_redis_error(self):
        """Test invalidating compliance cache with Redis error."""
        self.cache.client.delete.side_effect = redis.exceptions.RedisError("Redis error")
        
        # Should not raise exception
        await self.cache.invalidate_compliance_cache("E190", "USA")

    @pytest.mark.asyncio
    async def test_clear_all_cache_success(self):
        """Test clearing all cache."""
        await self.cache.clear_all_cache()
        
        self.cache.client.flushdb.assert_called_once()

    @pytest.mark.asyncio
    async def test_clear_all_cache_redis_error(self):
        """Test clearing all cache with Redis error."""
        self.cache.client.flushdb.side_effect = redis.exceptions.RedisError("Redis error")
        
        # Should not raise exception
        await self.cache.clear_all_cache()


class TestCacheServiceKeyGeneration:
    """Test cache key generation."""

    def setup_method(self):
        """Set up test fixtures."""
        self.cache = CacheService()

    def test_get_compliance_key_normal(self):
        """Test normal key generation."""
        key = self.cache._get_compliance_key("E190", "USA")
        assert key == "compliance:E190:USA"

    def test_get_compliance_key_case_handling(self):
        """Test key generation with different cases."""
        key1 = self.cache._get_compliance_key("e190", "usa")
        key2 = self.cache._get_compliance_key("E190", "USA")
        
        assert key1 == "compliance:e190:usa"
        assert key2 == "compliance:E190:USA"
        assert key1 != key2  # Keys should be case-sensitive

    def test_get_compliance_key_special_characters(self):
        """Test key generation with special characters."""
        key = self.cache._get_compliance_key("E-190", "US_A")
        assert key == "compliance:E-190:US_A"

    def test_get_compliance_key_empty_values(self):
        """Test key generation with empty values."""
        key = self.cache._get_compliance_key("", "")
        assert key == "compliance::"


class TestCacheServiceNotConnected:
    """Test cache service behavior when not connected."""

    def setup_method(self):
        """Set up test fixtures."""
        self.cache = CacheService()
        self.cache.client = None
        self.cache.is_connected = False

    @pytest.mark.asyncio
    async def test_get_compliance_result_not_connected(self):
        """Test getting compliance result when not connected."""
        result = await self.cache.get_compliance_result("E190", "USA")
        assert result is None

    @pytest.mark.asyncio
    async def test_set_compliance_result_not_connected(self):
        """Test setting compliance result when not connected."""
        report = ComplianceReport(
            aircraft_model="E190",
            country="USA",
            status="OK",
            pending_requirements=[]
        )
        
        # Should not raise exception
        await self.cache.set_compliance_result("E190", "USA", report)

    @pytest.mark.asyncio
    async def test_invalidate_compliance_cache_not_connected(self):
        """Test invalidating cache when not connected."""
        # Should not raise exception
        await self.cache.invalidate_compliance_cache("E190", "USA")

    @pytest.mark.asyncio
    async def test_clear_all_cache_not_connected(self):
        """Test clearing cache when not connected."""
        # Should not raise exception
        await self.cache.clear_all_cache()


class TestCacheServiceIntegration:
    """Test cache service integration scenarios."""

    @pytest.mark.asyncio
    async def test_cache_service_singleton_behavior(self):
        """Test that cache_service is a singleton."""
        # The cache_service should be the same instance everywhere
        from src.services.cache_service import cache_service as cs1
        from src.services.cache_service import cache_service as cs2
        
        assert cs1 is cs2
        assert isinstance(cs1, CacheService)

    @pytest.mark.asyncio
    async def test_cache_full_workflow(self):
        """Test complete cache workflow."""
        cache = CacheService()
        
        with patch('redis.asyncio.Redis') as mock_redis:
            mock_client = AsyncMock()
            mock_redis.return_value = mock_client
            mock_client.ping.return_value = True
            mock_client.get.return_value = None  # Cache miss
            
            # Connect
            await cache.connect()
            assert cache.is_connected
            
            # Try to get (miss)
            result = await cache.get_compliance_result("E190", "USA")
            assert result is None
            
            # Set value
            report = ComplianceReport(
                aircraft_model="E190",
                country="USA",
                status="OK",
                pending_requirements=[]
            )
            await cache.set_compliance_result("E190", "USA", report)
            
            # Verify set was called
            mock_client.setex.assert_called_once()
            
            # Simulate cache hit
            cached_data = {
                "aircraft_model": "E190",
                "country": "USA",
                "status": "OK",
                "pending_requirements": []
            }
            mock_client.get.return_value = json.dumps(cached_data)
            
            # Try to get (hit)
            result = await cache.get_compliance_result("E190", "USA")
            assert result == cached_data
            
            # Invalidate
            await cache.invalidate_compliance_cache("E190", "USA")
            mock_client.delete.assert_called_once()
            
            # Disconnect
            await cache.disconnect()
            assert not cache.is_connected