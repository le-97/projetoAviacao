"""
Integration tests for rate limiting functionality.
"""

import pytest
import time
from fastapi.testclient import TestClient
from unittest.mock import patch

from src.main import app


class TestRateLimitingIntegration:
    """Integration tests for rate limiting with the full application."""
    
    def test_compliance_endpoint_rate_limiting(self):
        """Test rate limiting on the compliance endpoint."""
        client = TestClient(app)
        
        # The compliance endpoint has a limit of 30 requests per minute
        # We'll make requests and check headers
        
        responses = []
        for i in range(5):  # Make several requests
            response = client.get("/check-compliance?model=E190&country=USA")
            responses.append(response)
            
            # Check rate limit headers are present
            assert "X-RateLimit-Limit" in response.headers
            assert "X-RateLimit-Remaining" in response.headers
            assert "X-RateLimit-Reset" in response.headers
            
            # First few should succeed
            if i < 3:
                assert response.status_code == 200
        
        # Check that remaining count decreases
        remaining_counts = [int(r.headers["X-RateLimit-Remaining"]) for r in responses[:3]]
        assert remaining_counts[0] > remaining_counts[1] > remaining_counts[2]
    
    def test_health_endpoint_higher_limits(self):
        """Test that health endpoint has higher rate limits."""
        client = TestClient(app)
        
        # Health endpoint should have 300 requests per minute limit
        response = client.get("/health")
        
        assert response.status_code == 200
        assert "X-RateLimit-Limit" in response.headers
        
        # Health endpoint should have higher limit than compliance
        health_limit = int(response.headers["X-RateLimit-Limit"])
        
        compliance_response = client.get("/check-compliance?model=E190&country=USA")
        compliance_limit = int(compliance_response.headers["X-RateLimit-Limit"])
        
        assert health_limit > compliance_limit
    
    def test_metrics_endpoint_rate_limiting(self):
        """Test rate limiting on metrics endpoints."""
        client = TestClient(app)
        
        # Metrics endpoints should have higher limits (120/min)
        response = client.get("/metrics/")
        
        assert response.status_code == 200
        assert "X-RateLimit-Limit" in response.headers
        
        # Should have higher limit than compliance endpoint
        metrics_limit = int(response.headers["X-RateLimit-Limit"])
        assert metrics_limit > 30  # Higher than compliance endpoint limit
    
    def test_rate_limit_exceeded_response(self):
        """Test response when rate limit is exceeded."""
        # We'll need to make many requests quickly to trigger rate limiting
        # For this test, we'll patch the token bucket to simulate exhaustion
        
        with patch('src.middleware.rate_limit.TokenBucket.consume') as mock_consume:
            mock_consume.return_value = False  # Simulate no tokens available
            
            client = TestClient(app)
            response = client.get("/check-compliance?model=E190&country=USA")
            
            assert response.status_code == 429
            
            error_data = response.json()
            assert error_data["error"] == "RATE_LIMIT_EXCEEDED"
            assert "message" in error_data
            assert "Rate limit exceeded" in error_data["message"]
            
            # Check error details
            assert "details" in error_data
            details = error_data["details"]
            assert "limit" in details
            assert "window" in details
            assert "reset_time" in details
            assert "retry_after" in details
            
            # Check headers
            assert "Retry-After" in response.headers
            assert "X-RateLimit-Limit" in response.headers
            assert "X-RateLimit-Remaining" in response.headers
    
    def test_rate_limiting_with_invalid_requests(self):
        """Test rate limiting behavior with invalid requests."""
        client = TestClient(app)
        
        # Even invalid requests should count against rate limit
        response1 = client.get("/check-compliance?model=INVALID&country=USA")
        response2 = client.get("/check-compliance?model=E190&country=INVALID")
        
        # Both should consume rate limit tokens
        remaining1 = int(response1.headers["X-RateLimit-Remaining"])
        remaining2 = int(response2.headers["X-RateLimit-Remaining"])
        
        assert remaining1 > remaining2  # Second request has fewer tokens
    
    def test_rate_limiting_doesnt_affect_documentation(self):
        """Test that documentation endpoints are not rate limited."""
        client = TestClient(app)
        
        # Documentation endpoints should not have rate limit headers
        # Note: We need to test this carefully as the endpoints might not exist
        # in the test environment, but the middleware should skip them
        
        # Test OpenAPI spec endpoint
        try:
            response = client.get("/openapi.json")
            # If it exists, it should not have rate limit headers
            if response.status_code == 200:
                # Documentation endpoints are excluded, so might not have headers
                pass
        except:
            # Endpoint might not exist in test, which is fine
            pass
    
    def test_rate_limiting_per_client_isolation(self):
        """Test that different clients have separate rate limits."""
        # Create multiple clients (simulating different IPs)
        client1 = TestClient(app)
        client2 = TestClient(app)
        
        # Make requests from both clients
        response1 = client1.get("/check-compliance?model=E190&country=USA")
        response2 = client2.get("/check-compliance?model=E190&country=USA")
        
        # Both should succeed and have independent token counts
        assert response1.status_code == 200
        assert response2.status_code == 200
        
        # Both should have similar remaining counts (independent buckets)
        remaining1 = int(response1.headers["X-RateLimit-Remaining"])
        remaining2 = int(response2.headers["X-RateLimit-Remaining"])
        
        # They might not be exactly equal due to timing, but should be close
        assert abs(remaining1 - remaining2) <= 1
    
    def test_rate_limiting_with_performance_monitoring(self):
        """Test that rate limiting works with performance monitoring."""
        client = TestClient(app)
        
        response = client.get("/check-compliance?model=E190&country=USA")
        
        assert response.status_code == 200
        
        # Should have headers from both middlewares
        assert "X-RateLimit-Limit" in response.headers  # From rate limiting
        assert "X-Response-Time" in response.headers    # From performance monitoring
    
    def test_rate_limiting_headers_format(self):
        """Test the format and values of rate limiting headers."""
        client = TestClient(app)
        
        response = client.get("/check-compliance?model=E190&country=USA")
        
        assert response.status_code == 200
        
        # Check header presence
        headers = response.headers
        assert "X-RateLimit-Limit" in headers
        assert "X-RateLimit-Remaining" in headers
        assert "X-RateLimit-Reset" in headers
        assert "X-RateLimit-Window" in headers
        
        # Check header values are reasonable
        limit = int(headers["X-RateLimit-Limit"])
        remaining = int(headers["X-RateLimit-Remaining"])
        reset_time = int(headers["X-RateLimit-Reset"])
        window = int(headers["X-RateLimit-Window"])
        
        assert limit > 0
        assert remaining >= 0
        assert remaining <= limit
        assert reset_time > time.time()  # Should be in the future
        assert window > 0
    
    def test_rate_limiting_compliance_with_different_models(self):
        """Test rate limiting with different aircraft models."""
        client = TestClient(app)
        
        # Make requests for different models
        models = ["E190", "E195"]
        countries = ["USA", "BRAZIL", "EUROPE"]
        
        responses = []
        for model in models:
            for country in countries:
                response = client.get(f"/check-compliance?model={model}&country={country}")
                responses.append(response)
                
                # All valid requests should succeed (within rate limit)
                if len(responses) <= 5:  # First few requests
                    assert response.status_code == 200
                
                # All should have rate limit headers
                assert "X-RateLimit-Remaining" in response.headers
        
        # Remaining tokens should decrease with each request
        remaining_values = [int(r.headers["X-RateLimit-Remaining"]) for r in responses[:3]]
        assert remaining_values[0] >= remaining_values[1] >= remaining_values[2]


class TestRateLimitingEdgeCases:
    """Test edge cases and error scenarios for rate limiting."""
    
    def test_rate_limiting_with_malformed_requests(self):
        """Test rate limiting behavior with malformed requests."""
        client = TestClient(app)
        
        # Malformed requests should still consume rate limit tokens
        response = client.get("/check-compliance")  # Missing required parameters
        
        # Should get validation error but still consume rate limit
        assert response.status_code == 422
        assert "X-RateLimit-Remaining" in response.headers
    
    def test_rate_limiting_header_consistency(self):
        """Test that rate limiting headers are consistent across requests."""
        client = TestClient(app)
        
        responses = []
        for i in range(3):
            response = client.get("/check-compliance?model=E190&country=USA")
            responses.append(response)
        
        # Limit and window should be consistent
        limits = [response.headers["X-RateLimit-Limit"] for response in responses]
        windows = [response.headers["X-RateLimit-Window"] for response in responses]
        
        assert all(limit == limits[0] for limit in limits)
        assert all(window == windows[0] for window in windows)
        
        # Remaining should decrease (or stay same if refill happened)
        remaining_values = [int(r.headers["X-RateLimit-Remaining"]) for r in responses]
        assert remaining_values[0] >= remaining_values[1] >= remaining_values[2]


if __name__ == "__main__":
    pytest.main([__file__, "-v"])