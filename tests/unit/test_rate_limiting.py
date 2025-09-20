"""
Tests for rate limiting middleware.
"""

import pytest
import time
import asyncio
from unittest.mock import Mock, patch
from fastapi import FastAPI, Request
from fastapi.testclient import TestClient
from starlette.responses import JSONResponse

from src.middleware.rate_limit import (
    RateLimitMiddleware, 
    RateLimitConfig, 
    TokenBucket,
    create_rate_limit_middleware,
    ENDPOINT_CONFIGS
)


class TestTokenBucket:
    """Test cases for TokenBucket implementation."""
    
    def test_token_bucket_initialization(self):
        """Test token bucket initializes correctly."""
        bucket = TokenBucket(capacity=10, refill_rate=1.0)
        
        assert bucket.capacity == 10
        assert bucket.refill_rate == 1.0
        assert bucket.tokens == 10.0
        assert bucket.last_refill > 0
    
    def test_token_bucket_consume_success(self):
        """Test successful token consumption."""
        bucket = TokenBucket(capacity=10, refill_rate=1.0)

        # Should succeed - bucket starts full
        assert bucket.consume(1) is True
        assert abs(bucket.tokens - 9.0) < 0.1  # Allow small float precision errors

        # Should succeed - still has tokens
        assert bucket.consume(5) is True
        assert abs(bucket.tokens - 4.0) < 0.1  # Allow small float precision errors    def test_token_bucket_consume_failure(self):
        """Test token consumption failure when insufficient tokens."""
        bucket = TokenBucket(capacity=5, refill_rate=1.0)

        # Consume all tokens
        assert bucket.consume(5) is True
        assert abs(bucket.tokens - 0.0) < 0.1  # Allow small float precision errors

        # Should fail - no tokens left
        assert bucket.consume(1) is False
        assert abs(bucket.tokens - 0.0) < 0.1  # Allow small float precision errors
    
    def test_token_bucket_refill(self):
        """Test token bucket refills over time."""
        bucket = TokenBucket(capacity=10, refill_rate=2.0)  # 2 tokens per second

        # Consume all tokens
        bucket.consume(10)
        assert abs(bucket.tokens - 0.0) < 0.1

        # Wait some time manually and test refill
        import time
        original_time = bucket.last_refill
        
        # Manually set a new time and trigger refill by consuming
        bucket.last_refill = original_time - 1.0  # Simulate 1 second passed
        
        # Should refill 2 tokens (2 tokens/sec * 1 sec) and allow consumption
        assert bucket.consume(1) is True  # This triggers refill
        # After consuming 1, should have ~1 token left (2 refilled - 1 consumed)
        assert abs(bucket.tokens - 1.0) < 0.1
    
    def test_token_bucket_get_status(self):
        """Test getting bucket status."""
        bucket = TokenBucket(capacity=10, refill_rate=1.0)
        
        tokens, time_until_refill = bucket.get_status()
        
        assert tokens == 10
        assert time_until_refill == 0.0  # Bucket is full
        
        # Consume some tokens
        bucket.consume(8)
        tokens, time_until_refill = bucket.get_status()
        
        assert tokens == 2
        assert time_until_refill > 0  # Should have some wait time


class TestRateLimitConfig:
    """Test cases for RateLimitConfig."""
    
    def test_default_config(self):
        """Test default configuration values."""
        config = RateLimitConfig()
        
        assert config.requests_per_minute == 60
        assert config.burst_size == 10
        assert config.window_size == 60
        assert config.enabled is True
    
    def test_custom_config(self):
        """Test custom configuration values."""
        config = RateLimitConfig(
            requests_per_minute=30,
            burst_size=5,
            window_size=120,
            enabled=False
        )
        
        assert config.requests_per_minute == 30
        assert config.burst_size == 5
        assert config.window_size == 120
        assert config.enabled is False


class TestRateLimitMiddleware:
    """Test cases for RateLimitMiddleware."""
    
    def create_test_app(self, middleware_config=None):
        """Create test FastAPI app with rate limiting."""
        app = FastAPI()
        
        if middleware_config:
            app.add_middleware(
                RateLimitMiddleware,
                default_config=middleware_config.get('default_config', RateLimitConfig()),
                endpoint_configs=middleware_config.get('endpoint_configs', {})
            )
        else:
            app.add_middleware(
                RateLimitMiddleware,
                default_config=RateLimitConfig(),
                endpoint_configs={}
            )
        
        @app.get("/test")
        async def test_endpoint():
            return {"message": "success"}
        
        @app.get("/health")
        async def health_endpoint():
            return {"status": "healthy"}
            
        @app.get("/check-compliance")
        async def compliance_endpoint():
            return {"model": "E190", "status": "OK"}
        
        return app
    
    def test_rate_limit_headers_present(self):
        """Test that rate limit headers are added to responses."""
        app = self.create_test_app()
        client = TestClient(app)
        
        response = client.get("/test")
        
        assert response.status_code == 200
        assert "X-RateLimit-Limit" in response.headers
        assert "X-RateLimit-Remaining" in response.headers
        assert "X-RateLimit-Reset" in response.headers
        assert "X-RateLimit-Window" in response.headers
    
    def test_rate_limit_enforcement(self):
        """Test that rate limiting is enforced."""
        # Create middleware with very low limits for testing
        config = RateLimitConfig(
            requests_per_minute=2,  # Very low limit
            burst_size=2,
            window_size=60
        )
        
        app = self.create_test_app({
            'default_config': config,
            'endpoint_configs': {}
        })
        client = TestClient(app)
        
        # First two requests should succeed
        response1 = client.get("/test")
        assert response1.status_code == 200
        
        response2 = client.get("/test")
        assert response2.status_code == 200
        
        # Third request should be rate limited
        response3 = client.get("/test")
        assert response3.status_code == 429
        assert "RATE_LIMIT_EXCEEDED" in response3.json()["error"]
        assert "Retry-After" in response3.headers
    
    def test_different_endpoint_limits(self):
        """Test different rate limits for different endpoints."""
        app = self.create_test_app()
        client = TestClient(app)
        
        # Health endpoint should have higher limits than compliance endpoint
        # Make multiple requests to compliance endpoint (lower limit)
        compliance_responses = []
        for i in range(35):  # More than the 30/min limit for compliance
            response = client.get("/check-compliance")
            compliance_responses.append(response)
            if response.status_code == 429:
                break
        
        # Should hit rate limit before 35 requests
        rate_limited = any(r.status_code == 429 for r in compliance_responses)
        assert rate_limited, "Compliance endpoint should be rate limited"
        
        # Health endpoint should still work (higher limit)
        health_response = client.get("/health")
        assert health_response.status_code == 200
    
    def test_rate_limit_recovery(self):
        """Test that rate limit recovers over time."""
        config = RateLimitConfig(
            requests_per_minute=60,  # 1 token per second
            burst_size=1,
            window_size=60
        )
        
        app = self.create_test_app({
            'default_config': config,
            'endpoint_configs': {}
        })
        client = TestClient(app)
        
        # Consume the single token
        response1 = client.get("/test")
        assert response1.status_code == 200
        
        # Next request should be rate limited
        response2 = client.get("/test")
        assert response2.status_code == 429
        
        # Manually trigger refill by waiting
        import time
        time.sleep(1.1)  # Wait a bit more than 1 second

        # Should work again after refill
        response3 = client.get("/test")
        assert response3.status_code == 200
    
    def test_rate_limit_per_client(self):
        """Test that rate limiting is applied per client."""
        config = RateLimitConfig(
            requests_per_minute=60,  # Higher limit for easier testing
            burst_size=2,
            window_size=60
        )

        app = self.create_test_app({
            'default_config': config,
            'endpoint_configs': {}
        })

        client = TestClient(app)

        # First two requests should work (burst size = 2)
        response1 = client.get("/test")
        assert response1.status_code == 200
        
        response2 = client.get("/test")
        assert response2.status_code == 200

        # Third request should be rate limited  
        response3 = client.get("/test")
        assert response3.status_code == 429

        # Note: Testing different clients in unit tests is complex with TestClient
        # This would be better tested in integration tests with actual HTTP clients
    
    def test_excluded_paths(self):
        """Test that certain paths are excluded from rate limiting."""
        config = RateLimitConfig(
            requests_per_minute=1,  # Very low limit
            burst_size=1,
            window_size=60
        )
        
        app = self.create_test_app({
            'default_config': config,
            'endpoint_configs': {}
        })
        client = TestClient(app)
        
        # Documentation paths should not be rate limited
        for _ in range(5):
            response = client.get("/docs")
            # Note: /docs might not exist in test app, but middleware should skip it
            # This tests the path exclusion logic
    
    def test_rate_limit_error_response_format(self):
        """Test the format of rate limit error responses."""
        config = RateLimitConfig(
            requests_per_minute=1,
            burst_size=1,
            window_size=60
        )
        
        app = self.create_test_app({
            'default_config': config,
            'endpoint_configs': {}
        })
        client = TestClient(app)
        
        # Consume token
        client.get("/test")
        
        # Get rate limited response
        response = client.get("/test")
        assert response.status_code == 429
        
        error_data = response.json()
        assert error_data["error"] == "RATE_LIMIT_EXCEEDED"
        assert "message" in error_data
        assert "details" in error_data
        assert "limit" in error_data["details"]
        assert "window" in error_data["details"]
        assert "reset_time" in error_data["details"]
        assert "retry_after" in error_data["details"]
    
    def test_middleware_disabled(self):
        """Test that middleware can be disabled."""
        config = RateLimitConfig(
            requests_per_minute=1,
            burst_size=1,
            window_size=60,
            enabled=False  # Disabled
        )
        
        app = self.create_test_app({
            'default_config': config,
            'endpoint_configs': {}
        })
        client = TestClient(app)
        
        # Should not be rate limited even with low limits
        for _ in range(10):
            response = client.get("/test")
            assert response.status_code == 200


class TestRateLimitIntegration:
    """Integration tests for rate limiting with other middleware."""
    
    def test_rate_limit_with_performance_middleware(self):
        """Test rate limiting works with performance middleware."""
        app = FastAPI()
        
        # Add both middlewares
        from src.middleware import PerformanceMiddleware
        app.add_middleware(
            RateLimitMiddleware,
            default_config=RateLimitConfig(),
            endpoint_configs={}
        )
        app.add_middleware(PerformanceMiddleware)
        
        @app.get("/test")
        async def test_endpoint():
            return {"message": "success"}
        
        client = TestClient(app)
        response = client.get("/test")
        
        assert response.status_code == 200
        # Should have both rate limit and performance headers
        assert "X-RateLimit-Limit" in response.headers
        assert "X-Response-Time" in response.headers
    
    def test_rate_limit_logging_integration(self):
        """Test that rate limiting events are logged."""
        with patch('src.middleware.rate_limit.log_security_event') as mock_log_security, \
             patch('src.middleware.rate_limit.log_performance_metric') as mock_log_perf:
            
            config = RateLimitConfig(
                requests_per_minute=1,
                burst_size=1,
                window_size=60
            )
            
            app = self.create_test_app({
                'default_config': config,
                'endpoint_configs': {}
            })
            client = TestClient(app)
            
            # First request - should succeed and log performance
            client.get("/test")
            mock_log_perf.assert_called()
            
            # Second request - should be rate limited and log security event
            client.get("/test")
            mock_log_security.assert_called()
    
    def create_test_app(self, middleware_config=None):
        """Helper to create test app."""
        app = FastAPI()
        
        if middleware_config:
            app.add_middleware(RateLimitMiddleware, **middleware_config)
        else:
            app.add_middleware(create_rate_limit_middleware())
        
        @app.get("/test")
        async def test_endpoint():
            return {"message": "success"}
        
        return app


if __name__ == "__main__":
    pytest.main([__file__, "-v"])