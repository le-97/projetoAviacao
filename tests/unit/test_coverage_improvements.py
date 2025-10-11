"""
Additional tests for improving coverage of middleware, logging, and API components.

This module provides comprehensive testing for areas with low coverage.
"""

import pytest
import pytest_asyncio
from unittest.mock import patch, MagicMock, AsyncMock
from fastapi import FastAPI
from fastapi.testclient import TestClient
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
import time
import json

from src.middleware.performance import PerformanceMiddleware
from src.middleware.rate_limit import RateLimitMiddleware
from src.logger.structured import (
    log_business_event, 
    log_security_event, 
    log_performance_metric,
    setup_logging,
    get_logger,
    StructuredFormatter
)
from src.api.cache import router as cache_router
from src.services.cache_service import cache_service


class TestStructuredLogging:
    """Test structured logging functionality."""

    def test_structured_formatter_initialization(self):
        """Test structured formatter initialization."""
        formatter = StructuredFormatter()
        assert formatter.service_name == "compliance-microservice"
        assert formatter.version == "2.0.0"

    def test_structured_formatter_custom_values(self):
        """Test structured formatter with custom values."""
        formatter = StructuredFormatter("test-service", "2.0.0")
        assert formatter.service_name == "test-service"
        assert formatter.version == "2.0.0"

    def test_setup_logging(self):
        """Test logging setup."""
        logger = setup_logging(level="INFO")
        assert logger is not None
        assert logger.level == logging.INFO

    def test_get_logger(self):
        """Test getting a specific logger."""
        logger = get_logger("test")
        assert logger.name == "test"

    def test_log_business_event_function(self):
        """Test business event logging function."""
        with patch('src.logger.structured.get_logger') as mock_get_logger:
            mock_logger = MagicMock()
            mock_get_logger.return_value = mock_logger
            
            log_business_event("test_event", {"key": "value"})
            
            mock_get_logger.assert_called_once_with("business")
            mock_logger.info.assert_called_once()

    def test_log_security_event_function(self):
        """Test security event logging function."""
        with patch('src.logger.structured.get_logger') as mock_get_logger:
            mock_logger = MagicMock()
            mock_get_logger.return_value = mock_logger
            
            log_security_event("security_violation", "WARNING", {"threat": "high"})
            
            mock_get_logger.assert_called_once_with("security")
            mock_logger.warning.assert_called_once()

    def test_log_performance_metric_function(self):
        """Test performance metric logging function."""
        with patch('src.logger.structured.get_logger') as mock_get_logger:
            mock_logger = MagicMock()
            mock_get_logger.return_value = mock_logger
            
            log_performance_metric("response_time", 100.5, "ms", {"endpoint": "/test"})
            
            mock_get_logger.assert_called_once_with("performance")
            mock_logger.info.assert_called_once()


class TestPerformanceMiddlewareExtended:
    """Extended tests for performance middleware."""

    def setup_method(self):
        """Set up test fixtures."""
        self.app = FastAPI()
        self.middleware = PerformanceMiddleware(
            self.app,
            exclude_paths=["/health", "/metrics"]
        )

    @pytest.mark.asyncio
    async def test_middleware_processes_request(self):
        """Test that middleware processes normal requests."""
        # Create mock request and call_next
        mock_request = MagicMock()
        mock_request.url.path = "/test"
        mock_request.method = "GET"
        
        mock_response = MagicMock()
        mock_response.status_code = 200
        
        async def mock_call_next(request):
            return mock_response
        
        with patch('time.time', side_effect=[1000.0, 1000.1]):  # 100ms duration
            response = await self.middleware.dispatch(mock_request, mock_call_next)
        
        assert response == mock_response

    @pytest.mark.asyncio
    async def test_middleware_excludes_health_endpoint(self):
        """Test that middleware excludes health endpoint."""
        mock_request = MagicMock()
        mock_request.url.path = "/health"
        mock_request.method = "GET"
        
        mock_response = MagicMock()
        
        async def mock_call_next(request):
            return mock_response
        
        response = await self.middleware.dispatch(mock_request, mock_call_next)
        
        assert response == mock_response

    @pytest.mark.asyncio
    async def test_middleware_handles_exceptions(self):
        """Test that middleware handles exceptions properly."""
        mock_request = MagicMock()
        mock_request.url.path = "/test"
        mock_request.method = "GET"
        
        async def mock_call_next(request):
            raise Exception("Test error")
        
        with pytest.raises(Exception, match="Test error"):
            await self.middleware.dispatch(mock_request, mock_call_next)


class TestRateLimitMiddlewareExtended:
    """Extended tests for rate limit middleware."""

    def setup_method(self):
        """Set up test fixtures."""
        self.app = FastAPI()

    def test_rate_limit_middleware_initialization(self):
        """Test rate limit middleware initialization."""
        middleware = RateLimitMiddleware(
            self.app,
            global_limit=100,
            global_window=60
        )
        
        assert middleware.global_limit == 100
        assert middleware.global_window == 60
        assert hasattr(middleware, 'endpoint_limits')

    @pytest.mark.asyncio
    async def test_rate_limit_allows_first_request(self):
        """Test that rate limiting allows the first request."""
        middleware = RateLimitMiddleware(self.app, global_limit=10, global_window=60)
        
        mock_request = MagicMock()
        mock_request.url.path = "/test"
        mock_request.method = "GET"
        mock_request.client.host = "127.0.0.1"
        mock_request.headers.get.return_value = "test-agent"
        
        mock_response = Response("OK", status_code=200)
        
        async def mock_call_next(request):
            return mock_response
        
        response = await middleware.dispatch(mock_request, mock_call_next)
        
        assert response.status_code == 200

    def test_get_client_key_ip(self):
        """Test client key generation from IP."""
        middleware = RateLimitMiddleware(self.app)
        
        mock_request = MagicMock()
        mock_request.client.host = "192.168.1.1"
        mock_request.headers.get.return_value = None
        
        key = middleware._get_client_key(mock_request)
        assert key == "ip:192.168.1.1"

    def test_get_client_key_api_key(self):
        """Test client key generation from API key."""
        middleware = RateLimitMiddleware(self.app)
        
        mock_request = MagicMock()
        mock_request.client.host = "192.168.1.1"
        mock_request.headers.get.return_value = "api-key-123"
        
        key = middleware._get_client_key(mock_request)
        assert key == "api:api-key-123"

    def test_should_rate_limit_included_path(self):
        """Test rate limiting for included paths."""
        middleware = RateLimitMiddleware(self.app)
        
        mock_request = MagicMock()
        mock_request.url.path = "/check-compliance"
        
        should_limit = middleware._should_rate_limit(mock_request)
        assert should_limit is True

    def test_should_rate_limit_excluded_path(self):
        """Test rate limiting exclusion for health endpoints."""
        middleware = RateLimitMiddleware(self.app)
        
        mock_request = MagicMock()
        mock_request.url.path = "/health"
        
        should_limit = middleware._should_rate_limit(mock_request)
        assert should_limit is False


class TestCacheAPIRoutes:
    """Test cache API routes."""

    def setup_method(self):
        """Set up test fixtures."""
        self.app = FastAPI()
        self.app.include_router(cache_router, prefix="/api/v1")
        self.client = TestClient(self.app)

    def test_cache_status_endpoint(self):
        """Test cache status endpoint."""
        with patch.object(cache_service, 'is_connected', True):
            response = self.client.get("/api/v1/cache/status")
            
            assert response.status_code == 200
            data = response.json()
            assert data["connected"] is True
            assert "redis_info" in data

    def test_cache_status_disconnected(self):
        """Test cache status when disconnected."""
        with patch.object(cache_service, 'is_connected', False):
            response = self.client.get("/api/v1/cache/status")
            
            assert response.status_code == 200
            data = response.json()
            assert data["connected"] is False
            assert data["redis_info"] is None

    @pytest.mark.asyncio
    async def test_invalidate_compliance_cache(self):
        """Test cache invalidation endpoint."""
        with patch.object(cache_service, 'invalidate_compliance_cache', new_callable=AsyncMock) as mock_invalidate:
            response = self.client.delete("/api/v1/cache/compliance/E190/USA")
            
            assert response.status_code == 200
            data = response.json()
            assert data["message"] == "Cache invalidated successfully"
            
    @pytest.mark.asyncio
    async def test_clear_all_cache(self):
        """Test clear all cache endpoint."""
        with patch.object(cache_service, 'clear_all_cache', new_callable=AsyncMock) as mock_clear:
            response = self.client.delete("/api/v1/cache/all")
            
            assert response.status_code == 200
            data = response.json()
            assert data["message"] == "All cache cleared successfully"


class TestConfigSettings:
    """Test configuration settings."""

    def test_config_import(self):
        """Test that config can be imported."""
        from src.config import settings
        
        assert hasattr(settings, 'cache_enabled')
        assert hasattr(settings, 'redis_url')
        assert hasattr(settings, 'log_level')

    def test_config_values(self):
        """Test configuration values."""
        from src.config import settings
        
        # These should have default values
        assert isinstance(settings.cache_enabled, bool)
        assert isinstance(settings.redis_url, str)
        assert isinstance(settings.log_level, str)


class TestMainApplication:
    """Test main application setup."""

    def test_app_creation(self):
        """Test that app can be created."""
        from src.main import app
        
        assert app is not None
        assert hasattr(app, 'routes')

    def test_health_endpoint_exists(self):
        """Test that health endpoint exists."""
        from src.main import app
        client = TestClient(app)
        
        response = client.get("/health")
        assert response.status_code == 200

    def test_compliance_endpoint_exists(self):
        """Test that compliance endpoint exists."""
        from src.main import app
        client = TestClient(app)
        
        # This might fail due to rate limiting, but endpoint should exist
        response = client.get("/check-compliance?model=E190&country=USA")
        assert response.status_code in [200, 422, 429]  # Valid responses


class TestLoggerSettings:
    """Test logger settings."""

    def test_logger_settings_import(self):
        """Test logger settings import."""
        from src.logger.settings import LogConfig
        
        assert LogConfig is not None

    def test_log_config_structure(self):
        """Test log config structure."""
        from src.logger.settings import LogConfig
        
        config = LogConfig()
        assert hasattr(config, 'formatters')
        assert hasattr(config, 'handlers')
        assert hasattr(config, 'loggers')


class TestIntegrationScenarios:
    """Test integration scenarios."""

    def test_full_request_lifecycle_with_mocks(self):
        """Test full request lifecycle with mocked dependencies."""
        from src.main import app
        
        with patch.object(cache_service, 'is_connected', False):  # Disable cache for predictable behavior
            client = TestClient(app)
            
            # Reset rate limiting by using different client
            import time
            time.sleep(1)  # Brief pause
            
            # This should work (might hit rate limit from previous tests)
            response = client.get("/check-compliance?model=E190&country=BRAZIL")
            
            # Should get either success or rate limit
            assert response.status_code in [200, 429]
            
            if response.status_code == 200:
                data = response.json()
                assert data["aircraft_model"] == "E190"
                assert data["country"] == "BRAZIL"