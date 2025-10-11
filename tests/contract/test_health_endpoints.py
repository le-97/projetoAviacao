"""Tests for health check endpoints."""
import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

class TestHealthEndpoints:
    """Test health check endpoints."""

    def test_root_endpoint_returns_service_info(self):
        """Test that root endpoint returns service information."""
        response = client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert data["service"] == "Enhanced Aviation Compliance Microservice"
        assert data["status"] == "healthy"
        assert data["version"] == "2.0.0"
        assert data["docs"] == "/docs"
        assert data["redoc"] == "/redoc"

    def test_health_endpoint_returns_detailed_info(self):
        """Test that health endpoint returns detailed service information."""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "Aviation Compliance API"
        assert data["version"] == "2.0.0"
        assert "E190" in data["supported_models"]
        assert "E195" in data["supported_models"]
        assert "BRAZIL" in data["supported_countries"]
        assert "USA" in data["supported_countries"]
        assert "EUROPE" in data["supported_countries"]
        assert data["endpoints"]["compliance_legacy"] == "/compliance/check-compliance"
        assert data["endpoints"]["documentation"] == "/docs"

    def test_docs_endpoint_accessible(self):
        """Test that Swagger docs endpoint is accessible."""
        response = client.get("/docs")
        
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]

    def test_redoc_endpoint_accessible(self):
        """Test that ReDoc endpoint is accessible."""
        response = client.get("/redoc")
        
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]

    def test_openapi_json_accessible(self):
        """Test that OpenAPI JSON schema is accessible."""
        response = client.get("/openapi.json")
        
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/json"
        
        data = response.json()
        assert data["info"]["title"] == "Aviation Compliance API"
        assert data["info"]["version"] == "2.0.0"
        assert "/compliance/check-compliance" in data["paths"]
        assert "/" in data["paths"]
        assert "/health" in data["paths"]