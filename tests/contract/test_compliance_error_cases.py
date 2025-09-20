"""Contract tests for compliance API error cases."""
import pytest
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

class TestComplianceErrorCases:
    """Test error cases for compliance API."""

    def test_invalid_aircraft_model_returns_422(self):
        """Test that invalid aircraft model returns 422 (FastAPI validation)."""
        response = client.get("/check-compliance?model=INVALID&country=USA")
        
        # FastAPI validates against the regex pattern first
        assert response.status_code == 422
        assert "detail" in response.json()

    def test_invalid_country_returns_422(self):
        """Test that invalid country returns 422 (FastAPI validation)."""
        response = client.get("/check-compliance?model=E190&country=INVALID")
        
        # FastAPI validates against the regex pattern first
        assert response.status_code == 422
        assert "detail" in response.json()

    def test_missing_model_parameter_returns_422(self):
        """Test that missing model parameter returns 422."""
        response = client.get("/check-compliance?country=USA")
        
        assert response.status_code == 422
        assert "detail" in response.json()

    def test_missing_country_parameter_returns_422(self):
        """Test that missing country parameter returns 422."""
        response = client.get("/check-compliance?model=E190")
        
        assert response.status_code == 422
        assert "detail" in response.json()

    def test_empty_model_parameter_returns_422(self):
        """Test that empty model parameter returns 422 (FastAPI validation)."""
        response = client.get("/check-compliance?model=&country=USA")
        
        # FastAPI validates the regex pattern first
        assert response.status_code == 422
        assert "detail" in response.json()

    def test_empty_country_parameter_returns_422(self):
        """Test that empty country parameter returns 422 (FastAPI validation)."""
        response = client.get("/check-compliance?model=E190&country=")
        
        # FastAPI validates the regex pattern first  
        assert response.status_code == 422
        assert "detail" in response.json()

    def test_case_insensitive_valid_model(self):
        """Test that model parameter is case insensitive for valid models."""
        response = client.get("/check-compliance?model=e190&country=USA")
        
        assert response.status_code == 200
        assert response.json()["aircraft_model"] == "e190"

    def test_case_insensitive_valid_country(self):
        """Test that country parameter is case insensitive for valid countries."""
        response = client.get("/check-compliance?model=E190&country=usa")
        
        assert response.status_code == 200
        assert response.json()["country"] == "usa"