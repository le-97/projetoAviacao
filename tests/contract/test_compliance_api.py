import pytest
from fastapi.testclient import TestClient
from src.main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_check_compliance_contract(client):
    # Given
    model = "E190"
    country = "USA"

    # When
    response = client.get(f"/check-compliance?model={model}&country={country}")

    # Then
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
