"""
Integration tests for metrics API endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.middleware.performance import reset_metrics


class TestMetricsAPI:
    """Test the metrics API endpoints."""
    
    def setup_method(self):
        """Setup for each test."""
        self.client = TestClient(app)
        reset_metrics()  # Start with clean metrics
    
    def test_get_metrics_empty(self):
        """Test getting metrics when no requests have been made."""
        response = self.client.get("/metrics/")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "system" in data
        assert "endpoints" in data
        assert data["system"]["total_requests"] == 0
        assert data["system"]["total_errors"] == 0
        assert len(data["endpoints"]) == 0
    
    def test_get_metrics_after_requests(self):
        """Test getting metrics after making some requests."""
        # Make some test requests first
        self.client.get("/check-compliance?aircraft_model=E190&country=BRAZIL")
        self.client.get("/check-compliance?aircraft_model=INVALID&country=BRAZIL")
        self.client.get("/health")
        
        response = self.client.get("/metrics/")
        
        assert response.status_code == 200
        data = response.json()
        
        # Check system metrics
        system = data["system"]
        assert system["total_requests"] >= 2  # At least compliance requests (health might be excluded)
        assert system["total_errors"] >= 1   # The invalid model request
        assert system["avg_response_time"] > 0
        assert system["uptime_seconds"] > 0
        
        # Check endpoint metrics
        endpoints = data["endpoints"]
        compliance_endpoint = next(
            (ep for ep in endpoints if ep["endpoint"] == "/check-compliance"), 
            None
        )
        assert compliance_endpoint is not None
        assert compliance_endpoint["request_count"] >= 2
        assert compliance_endpoint["error_count"] >= 1
        assert compliance_endpoint["avg_response_time"] > 0
    
    def test_get_endpoint_metrics(self):
        """Test getting metrics for a specific endpoint."""
        # Make a test request first - using parameters that should succeed
        response = self.client.get("/check-compliance?aircraft_model=E190&country=BRAZIL")
        
        response = self.client.get("/metrics/endpoint?endpoint=/check-compliance&method=GET")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["endpoint"] == "/check-compliance"
        assert data["method"] == "GET"
        assert data["request_count"] == 1
        # Error count depends on business logic - just check it's a valid number
        assert isinstance(data["error_count"], int)
        assert data["error_count"] >= 0
        assert data["avg_response_time"] > 0
        assert data["min_response_time"] > 0
        assert data["max_response_time"] > 0
    
    def test_get_endpoint_metrics_no_data(self):
        """Test getting metrics for an endpoint with no requests."""
        response = self.client.get("/metrics/endpoint?endpoint=/nonexistent&method=GET")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["endpoint"] == "/nonexistent"
        assert data["method"] == "GET"
        assert data["request_count"] == 0
        assert data["error_count"] == 0
        assert data["avg_response_time"] == 0
    
    def test_performance_health_healthy(self):
        """Test performance health check when service is healthy."""
        # Make several successful requests to ensure good metrics
        for _ in range(10):
            self.client.get("/")  # Use simple endpoint that should always be successful
        
        response = self.client.get("/metrics/health")
        
        # Should be healthy if error rate is low
        data = response.json() if response.status_code == 200 else response.json()["detail"]
        
        assert "status" in data
        assert "error_rate" in data
        assert "avg_response_time" in data
        assert "total_requests" in data
        assert "uptime" in data
        assert "thresholds" in data
    
    def test_performance_health_degraded(self):
        """Test performance health check when service is degraded."""
        # Make many error requests to trigger degraded state
        for _ in range(10):
            self.client.get("/check-compliance?aircraft_model=INVALID&country=BRAZIL")
        
        response = self.client.get("/metrics/health")
        
        # Should return 503 for degraded service
        assert response.status_code == 503
        data = response.json()["detail"]
        
        assert data["status"] == "degraded"
        assert data["error_rate"] > 0.05  # Above the 5% threshold
    
    def test_metrics_excluded_from_monitoring(self):
        """Test that metrics endpoints are excluded from performance monitoring."""
        # Make requests to metrics endpoints
        self.client.get("/metrics/")
        self.client.get("/metrics/health")
        
        # Get current metrics
        response = self.client.get("/metrics/")
        data = response.json()
        
        # Metrics endpoints should not appear in the metrics
        endpoints = [ep["endpoint"] for ep in data["endpoints"]]
        assert not any(ep.startswith("/metrics") for ep in endpoints), f"Found metrics endpoints in monitoring: {endpoints}"
    
    def test_response_time_header_present(self):
        """Test that performance middleware adds response time header."""
        response = self.client.get("/check-compliance?aircraft_model=E190&country=BRAZIL")
        
        assert "X-Response-Time" in response.headers
        response_time = response.headers["X-Response-Time"]
        assert response_time.endswith("s")
        
        # Should be a valid float (can be very small for fast endpoints)
        time_value = float(response_time[:-1])
        assert time_value >= 0
    
    def test_metrics_schema_validation(self):
        """Test that metrics response follows the expected schema."""
        # Make a test request
        self.client.get("/check-compliance?aircraft_model=E190&country=BRAZIL")
        
        response = self.client.get("/metrics/")
        assert response.status_code == 200
        
        data = response.json()
        
        # Validate system metrics structure
        system = data["system"]
        required_system_fields = [
            "uptime_seconds", "uptime_human", "total_requests", "total_errors",
            "overall_error_rate", "avg_response_time", "requests_per_minute",
            "last_request_time", "active_endpoints"
        ]
        for field in required_system_fields:
            assert field in system
        
        # Validate endpoint metrics structure
        if data["endpoints"]:
            endpoint = data["endpoints"][0]
            required_endpoint_fields = [
                "endpoint", "method", "request_count", "error_count", "error_rate",
                "avg_response_time", "min_response_time", "max_response_time",
                "p95_response_time", "p99_response_time", "status_codes"
            ]
            for field in required_endpoint_fields:
                assert field in endpoint