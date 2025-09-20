"""
Test fixtures and utilities for improved test isolation.

This module provides fixtures and utilities to ensure tests run independently
and don't interfere with each other, especially for rate limiting tests.
"""

import pytest
import pytest_asyncio
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from src.main import app
from src.services.cache_service import cache_service


@pytest.fixture
def isolated_client():
    """Provide an isolated test client with rate limiting disabled."""
    with patch('src.middleware.rate_limit.RateLimitMiddleware._should_rate_limit', return_value=False):
        yield TestClient(app)


@pytest.fixture
def mock_cache_service():
    """Provide a mocked cache service."""
    with patch.object(cache_service, 'is_connected', False), \
         patch.object(cache_service, 'get_compliance_result', return_value=None), \
         patch.object(cache_service, 'set_compliance_result', return_value=None):
        yield cache_service


@pytest.fixture(autouse=True)
def reset_rate_limits():
    """Reset rate limits before each test."""
    # Simply disable rate limiting for all tests to ensure isolation
    with patch('src.middleware.rate_limit.RateLimitConfig.enabled', False):
        yield


@pytest.fixture
def compliance_service():
    """Provide a fresh compliance service instance."""
    from src.services.compliance_service import ComplianceService
    return ComplianceService()


@pytest.fixture
def mock_redis():
    """Provide a mocked Redis client."""
    mock_redis = MagicMock()
    mock_redis.ping.return_value = True
    mock_redis.get.return_value = None
    mock_redis.setex.return_value = True
    mock_redis.delete.return_value = True
    mock_redis.flushdb.return_value = True
    return mock_redis


@pytest.fixture
def sample_compliance_report():
    """Provide a sample compliance report."""
    from src.models.compliance import ComplianceReport
    return ComplianceReport(
        aircraft_model="E190",
        country="USA",
        status="PENDING",
        pending_requirements=["AD-2025-12: Wing inspection required"]
    )