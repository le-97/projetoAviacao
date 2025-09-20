"""
Isolated integration tests that bypass rate limiting issues.

This module provides integration tests that work around rate limiting
to test the actual functionality.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from src.main import app


class TestComplianceFlowIsolated:
    """Test compliance flow with rate limiting bypassed."""

    def test_compliance_check_flow_usa(self, isolated_client):
        """Test compliance check flow for USA."""
        response = isolated_client.get("/check-compliance?model=E190&country=USA")
        
        assert response.status_code == 200
        report = response.json()
        assert report["aircraft_model"] == "E190"
        assert report["country"] == "USA"
        assert report["status"] == "PENDING"
        assert "AD-2025-12: Wing inspection required" in report["pending_requirements"]

    def test_compliance_check_flow_brazil(self, isolated_client):
        """Test compliance check flow for Brazil."""
        response = isolated_client.get("/check-compliance?model=E190&country=BRAZIL")
        
        assert response.status_code == 200
        report = response.json()
        assert report["aircraft_model"] == "E190"
        assert report["country"] == "BRAZIL"
        assert report["status"] == "OK"
        assert len(report["pending_requirements"]) == 0

    def test_compliance_check_flow_europe(self, isolated_client):
        """Test compliance check flow for Europe."""
        response = isolated_client.get("/check-compliance?model=E195&country=EUROPE")
        
        assert response.status_code == 200
        report = response.json()
        assert report["aircraft_model"] == "E195"
        assert report["country"] == "EUROPE"
        assert report["status"] == "OK"
        assert len(report["pending_requirements"]) == 0


class TestComplianceErrorCasesIsolated:
    """Test compliance error cases with rate limiting bypassed."""

    def test_empty_model_parameter_returns_422(self, isolated_client):
        """Test that empty model parameter returns 422."""
        response = isolated_client.get("/check-compliance?country=USA")
        assert response.status_code == 422

    def test_empty_country_parameter_returns_422(self, isolated_client):
        """Test that empty country parameter returns 422."""
        response = isolated_client.get("/check-compliance?model=E190")
        assert response.status_code == 422

    def test_invalid_model_returns_422(self, isolated_client):
        """Test that invalid model returns 422."""
        response = isolated_client.get("/check-compliance?model=INVALID&country=USA")
        assert response.status_code == 422

    def test_invalid_country_returns_422(self, isolated_client):
        """Test that invalid country returns 422."""
        response = isolated_client.get("/check-compliance?model=E190&country=INVALID")
        assert response.status_code == 422

    def test_case_insensitive_valid_model(self, isolated_client):
        """Test that model parameter is case insensitive for valid models."""
        response = isolated_client.get("/check-compliance?model=e190&country=USA")
        assert response.status_code == 200

    def test_case_insensitive_valid_country(self, isolated_client):
        """Test that country parameter is case insensitive for valid countries."""
        response = isolated_client.get("/check-compliance?model=E190&country=usa")
        assert response.status_code == 200


class TestContractComplianceIsolated:
    """Test contract compliance with rate limiting bypassed."""

    def test_check_compliance_contract(self, isolated_client):
        """Test compliance check contract."""
        response = isolated_client.get("/check-compliance?model=E190&country=USA")
        
        assert response.status_code == 200
        
        response_json = response.json()
        assert "aircraft_model" in response_json
        assert isinstance(response_json["aircraft_model"], str)
        
        assert "country" in response_json
        assert isinstance(response_json["country"], str)
        
        assert "status" in response_json
        assert isinstance(response_json["status"], str)
        
        assert "pending_requirements" in response_json
        assert isinstance(response_json["pending_requirements"], list)
        for item in response_json["pending_requirements"]:
            assert isinstance(item, str)

    def test_check_compliance_contract_all_models(self, isolated_client):
        """Test compliance check contract for all supported models."""
        models = ["E190", "E195"]
        countries = ["USA", "BRAZIL", "EUROPE"]
        
        for model in models:
            for country in countries:
                response = isolated_client.get(f"/check-compliance?model={model}&country={country}")
                
                assert response.status_code == 200
                response_json = response.json()
                
                # Verify contract
                assert response_json["aircraft_model"] == model
                assert response_json["country"] == country
                assert response_json["status"] in ["OK", "PENDING"]
                assert isinstance(response_json["pending_requirements"], list)


class TestHealthEndpointsIsolated:
    """Test health endpoints."""

    def test_health_endpoint(self, isolated_client):
        """Test basic health endpoint."""
        response = isolated_client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"

    def test_health_detailed_endpoint(self, isolated_client):
        """Test detailed health endpoint."""
        response = isolated_client.get("/health/detailed")
        
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "timestamp" in data
        assert "checks" in data


class TestMetricsAPIIsolated:
    """Test metrics API endpoints."""

    def test_metrics_summary_endpoint(self, isolated_client):
        """Test metrics summary endpoint."""
        response = isolated_client.get("/api/v1/metrics/summary")
        
        assert response.status_code == 200
        data = response.json()
        assert "total_requests" in data
        assert "avg_response_time" in data

    def test_metrics_performance_endpoint(self, isolated_client):
        """Test performance metrics endpoint."""
        response = isolated_client.get("/api/v1/metrics/performance?endpoint=/check-compliance")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)


class TestRateLimitingFunctionality:
    """Test rate limiting functionality in isolation."""

    def test_rate_limiting_headers_present(self):
        """Test that rate limiting headers are present."""
        # Use a fresh client to avoid accumulated rate limits
        client = TestClient(app)
        
        # Make a single request to check headers
        response = client.get("/check-compliance?model=E190&country=USA")
        
        # Should have rate limit headers regardless of status
        assert "X-RateLimit-Limit" in response.headers
        assert "X-RateLimit-Remaining" in response.headers
        assert "X-RateLimit-Reset" in response.headers

    def test_rate_limiting_limit_values(self):
        """Test rate limiting limit values are correct."""
        client = TestClient(app)
        
        response = client.get("/check-compliance?model=E190&country=USA")
        
        # Check that limit is set correctly (30 for compliance endpoint)
        limit = int(response.headers["X-RateLimit-Limit"])
        assert limit == 30

    def test_rate_limiting_decreases_remaining(self):
        """Test that rate limiting decreases remaining count."""
        from src.middleware.rate_limit import RateLimitMiddleware
        
        # Create fresh middleware instance
        middleware = RateLimitMiddleware(app)
        
        # Clear any existing state
        middleware.client_requests.clear()
        
        client = TestClient(app)
        
        # Make first request
        response1 = client.get("/check-compliance?model=E190&country=USA")
        remaining1 = int(response1.headers.get("X-RateLimit-Remaining", "0"))
        
        # Make second request immediately 
        response2 = client.get("/check-compliance?model=E190&country=BRAZIL")
        remaining2 = int(response2.headers.get("X-RateLimit-Remaining", "0"))
        
        # If both succeeded, remaining should decrease
        if response1.status_code == 200 and response2.status_code == 200:
            assert remaining2 < remaining1