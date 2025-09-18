import pytest
from src.services.compliance_service import ComplianceService
from src.models.compliance import ComplianceReport

def test_check_compliance():
    # Given
    service = ComplianceService()
    model = "E190"
    country = "USA"

    # When
    report = service.check_compliance(model, country)

    # Then
    assert isinstance(report, ComplianceReport)
    assert report.aircraft_model == model
    assert report.country == country
    assert report.status == "PENDING"
    assert "AD-2025-12: Wing inspection required" in report.pending_requirements
