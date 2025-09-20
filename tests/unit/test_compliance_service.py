import pytest
from src.services.compliance_service import ComplianceService, ValidationError
from src.models.compliance import ComplianceReport

def test_check_compliance_usa():
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

def test_check_compliance_brazil():
    # Given
    service = ComplianceService()
    model = "E190"
    country = "BRAZIL"

    # When
    report = service.check_compliance(model, country)

    # Then
    assert isinstance(report, ComplianceReport)
    assert report.aircraft_model == model
    assert report.country == country
    assert report.status == "OK"
    assert len(report.pending_requirements) == 0

def test_validation_error_invalid_model():
    # Given
    service = ComplianceService()
    model = "INVALID"
    country = "USA"

    # When/Then
    with pytest.raises(ValidationError) as exc_info:
        service.check_compliance(model, country)
    
    assert exc_info.value.error_type == "UNSUPPORTED_MODEL"
    assert "INVALID" in exc_info.value.message

def test_validation_error_invalid_country():
    # Given
    service = ComplianceService()
    model = "E190"
    country = "INVALID"

    # When/Then
    with pytest.raises(ValidationError) as exc_info:
        service.check_compliance(model, country)
    
    assert exc_info.value.error_type == "UNSUPPORTED_COUNTRY"
    assert "INVALID" in exc_info.value.message

def test_validation_error_empty_model():
    # Given
    service = ComplianceService()
    model = ""
    country = "USA"

    # When/Then
    with pytest.raises(ValidationError) as exc_info:
        service.check_compliance(model, country)
    
    assert exc_info.value.error_type == "MISSING_MODEL"

def test_validation_error_empty_country():
    # Given
    service = ComplianceService()
    model = "E190"
    country = ""

    # When/Then
    with pytest.raises(ValidationError) as exc_info:
        service.check_compliance(model, country)
    
    assert exc_info.value.error_type == "MISSING_COUNTRY"

def test_case_insensitive_model():
    # Given
    service = ComplianceService()
    model = "e190"
    country = "USA"

    # When
    report = service.check_compliance(model, country)

    # Then
    assert isinstance(report, ComplianceReport)
    assert report.aircraft_model == model
