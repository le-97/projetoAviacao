from pydantic import BaseModel
from typing import List

class Aircraft(BaseModel):
    """Represents an aircraft model."""
    model_name: str

class Regulation(BaseModel):
    """Represents a regulatory rule from an aviation authority."""
    authority: str
    description: str
    applicability: List[str]

class ComplianceReport(BaseModel):
    """Represents the output of a compliance check."""
    aircraft_model: str
    country: str
    status: str
    pending_requirements: List[str]
