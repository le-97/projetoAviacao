from fastapi import APIRouter
from src.models.compliance import ComplianceReport
from src.services.compliance_service import ComplianceService

router = APIRouter()
compliance_service = ComplianceService()

@router.get("/check-compliance", response_model=ComplianceReport)
def check_compliance(model: str, country: str):
    """Endpoint to check aircraft compliance."""
    return compliance_service.check_compliance(model, country)
