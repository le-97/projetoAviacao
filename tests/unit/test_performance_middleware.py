"""
Unit tests for performance monitoring middleware.
"""

import pytest
import asyncio
import time
from unittest.mock import Mock, patch
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.testclient import TestClient
from src.middleware.performance import (
    PerformanceMiddleware, 
    PerformanceMetrics,
    get_metrics,
    reset_metrics
)


class TestPerformanceMetrics:
    """Test the PerformanceMetrics class."""
    
    def setup_method(self):
        """Reset metrics before each test."""
        self.metrics = PerformanceMetrics(max_history=10)
    
    def test_record_request_success(self):
        """Test recording a successful request."""
        self.metrics.record_request("/test", "GET", 0.1, 200)
        
        assert self.metrics.request_count["GET /test"] == 1
        assert self.metrics.error_count["GET /test"] == 0
        assert len(self.metrics.response_times["GET /test"]) == 1
        assert self.metrics.response_times["GET /test"][0] == 0.1
        assert self.metrics.status_codes["GET /test"][200] == 1
    
    def test_record_request_error(self):
        """Test recording an error request."""
        self.metrics.record_request("/test", "GET", 0.2, 422)
        
        assert self.metrics.request_count["GET /test"] == 1
        assert self.metrics.error_count["GET /test"] == 1
        assert self.metrics.status_codes["GET /test"][422] == 1
    
    def test_get_endpoint_metrics_no_data(self):
        """Test getting metrics for endpoint with no data."""
        metrics_data = self.metrics.get_endpoint_metrics("/test", "GET")
        
        assert metrics_data["request_count"] == 0
        assert metrics_data["error_count"] == 0
        assert metrics_data["avg_response_time"] == 0
    
    def test_get_endpoint_metrics_with_data(self):
        """Test getting metrics for endpoint with data."""
        # Record some requests
        self.metrics.record_request("/test", "GET", 0.1, 200)
        self.metrics.record_request("/test", "GET", 0.2, 200)
        self.metrics.record_request("/test", "GET", 0.3, 422)
        
        metrics_data = self.metrics.get_endpoint_metrics("/test", "GET")
        
        assert metrics_data["request_count"] == 3
        assert metrics_data["error_count"] == 1
        assert abs(metrics_data["error_rate"] - 1/3) < 0.001
        assert abs(metrics_data["avg_response_time"] - 0.2) < 0.001
        assert metrics_data["min_response_time"] == 0.1
        assert metrics_data["max_response_time"] == 0.3
        assert metrics_data["status_codes"][200] == 2
        assert metrics_data["status_codes"][422] == 1
    
    def test_get_system_metrics(self):
        """Test getting system-wide metrics."""
        self.metrics.record_request("/test1", "GET", 0.1, 200)
        self.metrics.record_request("/test2", "POST", 0.2, 422)
        
        metrics_data = self.metrics.get_system_metrics()
        
        assert metrics_data["total_requests"] == 2
        assert metrics_data["total_errors"] == 1
        assert metrics_data["overall_error_rate"] == 0.5
        assert abs(metrics_data["avg_response_time"] - 0.15) < 0.001
        assert metrics_data["active_endpoints"] == 2
        assert "uptime_seconds" in metrics_data
        assert "uptime_human" in metrics_data
    
    def test_max_history_limit(self):
        """Test that response times respect max_history limit."""
        metrics = PerformanceMetrics(max_history=3)
        
        # Record 5 requests (more than max_history)
        for i in range(5):
            metrics.record_request("/test", "GET", i * 0.1, 200)
        
        # Should only keep the last 3
        response_times = list(metrics.response_times["GET /test"])
        assert len(response_times) == 3
        # Check that we have the last 3 values (approximately)
        expected = [0.2, 0.3, 0.4]
        for actual, exp in zip(response_times, expected):
            assert abs(actual - exp) < 0.001


class TestPerformanceMiddleware:
    """Test the PerformanceMiddleware class."""
    
    def setup_method(self):
        """Setup test app and client."""
        reset_metrics()  # Reset global metrics
        
        self.app = FastAPI()
        self.app.add_middleware(PerformanceMiddleware)
        
        @self.app.get("/test")
        async def test_endpoint():
            return {"message": "test"}
        
        @self.app.get("/slow")
        async def slow_endpoint():
            await asyncio.sleep(0.1)  # Simulate slow endpoint
            return {"message": "slow"}
        
        @self.app.get("/error")
        async def error_endpoint():
            raise HTTPException(status_code=422, detail="Test error")
        
        self.client = TestClient(self.app)
    
    def test_middleware_tracks_successful_request(self):
        """Test that middleware tracks successful requests."""
        response = self.client.get("/test")
        
        assert response.status_code == 200
        assert "X-Response-Time" in response.headers
        
        # Check metrics were recorded
        metrics_data = get_metrics()
        assert metrics_data["system"]["total_requests"] == 1
        assert metrics_data["system"]["total_errors"] == 0
        
        endpoint_metrics = next(
            (ep for ep in metrics_data["endpoints"] if ep["endpoint"] == "/test"), 
            None
        )
        assert endpoint_metrics is not None
        assert endpoint_metrics["request_count"] == 1
        assert endpoint_metrics["error_count"] == 0
    
    def test_middleware_tracks_error_request(self):
        """Test that middleware tracks error requests."""
        response = self.client.get("/error")
        
        assert response.status_code == 422
        assert "X-Response-Time" in response.headers
        
        # Check metrics were recorded
        metrics_data = get_metrics()
        assert metrics_data["system"]["total_requests"] == 1
        assert metrics_data["system"]["total_errors"] == 1
        
        endpoint_metrics = next(
            (ep for ep in metrics_data["endpoints"] if ep["endpoint"] == "/error"), 
            None
        )
        assert endpoint_metrics is not None
        assert endpoint_metrics["request_count"] == 1
        assert endpoint_metrics["error_count"] == 1
    
    def test_middleware_excludes_paths(self):
        """Test that middleware excludes specified paths."""
        # Create middleware with custom exclusions
        app = FastAPI()
        app.add_middleware(PerformanceMiddleware, exclude_paths={"/excluded"})
        
        @app.get("/excluded")
        async def excluded_endpoint():
            return {"message": "excluded"}
        
        @app.get("/included")
        async def included_endpoint():
            return {"message": "included"}
        
        client = TestClient(app)
        
        # Reset metrics for clean test
        reset_metrics()
        
        # Make requests to both endpoints
        client.get("/excluded")
        client.get("/included")
        
        # Check that only included endpoint was tracked
        metrics_data = get_metrics()
        assert metrics_data["system"]["total_requests"] == 1
        
        endpoint_metrics = [ep["endpoint"] for ep in metrics_data["endpoints"]]
        assert "/excluded" not in endpoint_metrics
        assert "/included" in endpoint_metrics
    
    def test_response_time_header(self):
        """Test that response time header is added."""
        response = self.client.get("/test")
        
        assert "X-Response-Time" in response.headers
        response_time_header = response.headers["X-Response-Time"]
        assert response_time_header.endswith("s")
        
        # Should be a valid float (can be very small for fast endpoints)
        response_time = float(response_time_header[:-1])
        assert response_time >= 0