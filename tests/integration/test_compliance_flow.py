import pytest
from fastapi.testclient import TestClient
from src.main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_compliance_check_flow(client):
    # Given I have selected the "Embraer E190" model and the countries "Brazil" and "USA"
    model = "E190"
    country = "USA"

    # When I request the compliance check
    response = client.get(f"/check-compliance?model={model}&country={country}")

    # Then the system should return a JSON report showing the compliance status for both countries,
    # including any pending Airworthiness Directives for the USA.
    assert response.status_code == 200
    report = response.json()
    assert report["aircraft_model"] == "E190"
    assert report["country"] == "USA"
    assert report["status"] == "PENDING"
    assert "AD-2025-12: Wing inspection required" in report["pending_requirements"]
