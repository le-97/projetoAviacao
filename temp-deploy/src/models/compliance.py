from pydantic import BaseModel, Field
from typing import List, Literal, Optional
from datetime import datetime

class Aircraft(BaseModel):
    """Represents an aircraft model."""
    model_name: str = Field(
        description="Aircraft model identifier",
        examples=["E190", "E195"]
    )

class AircraftInfo(BaseModel):
    """Extended aircraft information."""
    manufacturer: str = Field(description="Aircraft manufacturer")
    model: str = Field(description="Aircraft model")
    variant: Optional[str] = Field(default=None, description="Aircraft variant")
    type_certificate: Optional[str] = Field(default=None, description="Type certificate number")
    max_seats: Optional[int] = Field(default=None, description="Maximum seating capacity")
    max_weight_kg: Optional[float] = Field(default=None, description="Maximum weight in kg")

class Regulation(BaseModel):
    """Represents a regulatory rule from an aviation authority."""
    authority: str = Field(
        description="Aviation regulatory authority",
        examples=["ANAC", "FAA", "EASA"]
    )
    description: str = Field(
        description="Regulation description and requirements"
    )
    applicability: List[str] = Field(
        description="List of aircraft models this regulation applies to"
    )

class ComplianceCheck(BaseModel):
    """Individual compliance check result."""
    regulation_reference: str = Field(description="Regulation reference code")
    regulation_title: str = Field(description="Regulation title")
    status: Literal["COMPLIANT", "NON_COMPLIANT", "PARTIAL_COMPLIANCE", "NOT_APPLICABLE"] = Field(
        description="Compliance status for this check"
    )
    severity: Literal["CRITICAL", "MAJOR", "MINOR", "INFO"] = Field(
        description="Severity level of the check"
    )
    findings: List[str] = Field(default=[], description="Detailed findings")
    recommendations: List[str] = Field(default=[], description="Recommendations for compliance")

class ComplianceReport(BaseModel):
    """Represents the output of a compliance check."""
    aircraft_model: str = Field(
        description="The aircraft model that was checked",
        examples=["E190", "E195"]
    )
    country: str = Field(
        description="The country/region for which compliance was checked",
        examples=["BRAZIL", "USA", "EUROPE"]
    )
    overall_status: Literal["COMPLIANT", "NON_COMPLIANT", "PARTIAL_COMPLIANCE"] = Field(
        description="Overall compliance status"
    )
    total_checks: int = Field(description="Total number of checks performed")
    compliant_checks: int = Field(description="Number of compliant checks")
    non_compliant_checks: int = Field(description="Number of non-compliant checks")
    critical_issues: int = Field(description="Number of critical issues found")
    checks: List[ComplianceCheck] = Field(description="Individual compliance checks")
    recommendations: List[str] = Field(description="Overall recommendations")
    aircraft_info: Optional[AircraftInfo] = Field(default=None, description="Aircraft information")
    
    # Legacy fields for backward compatibility
    status: Optional[Literal["OK", "PENDING", "NON-COMPLIANT", "NON_COMPLIANT"]] = Field(
        default=None,
        description="Legacy status field - use overall_status instead",
        examples=["OK"]
    )
    pending_requirements: Optional[List[str]] = Field(
        default=None,
        description="Legacy field - use recommendations instead",
        examples=[["AD-2025-12: Wing inspection required"]]
    )
    compliance_percentage: Optional[float] = Field(
        default=None,
        description="Overall compliance percentage (0-100)",
        examples=[85.5]
    )
    authority: Optional[str] = Field(
        default=None,
        description="Regulatory authority name",
        examples=["Federal Aviation Administration"]
    )
    check_date: Optional[str] = Field(
        default=None,
        description="Date when compliance check was performed (ISO format)",
        examples=["2025-09-19T19:30:00"]
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "aircraft_model": "E190",
                    "country": "USA",
                    "status": "PENDING",
                    "pending_requirements": ["AD-2025-12: Wing inspection required"],
                    "compliance_percentage": 85.5,
                    "total_checks": 25,
                    "authority": "Federal Aviation Administration",
                    "check_date": "2025-09-19T19:30:00"
                },
                {
                    "aircraft_model": "E195",
                    "country": "BRAZIL",
                    "status": "OK",
                    "pending_requirements": [],
                    "compliance_percentage": 100.0,
                    "total_checks": 18,
                    "authority": "Agência Nacional de Aviação Civil",
                    "check_date": "2025-09-19T19:30:00"
                }
            ]
        }
    }

class ErrorResponse(BaseModel):
    """Represents an error response."""
    error: str = Field(
        description="Error type identifier",
        examples=["UNSUPPORTED_MODEL", "MISSING_COUNTRY"]
    )
    message: str = Field(
        description="Human-readable error message",
        examples=["Aircraft model 'INVALID' is not supported"]
    )
    details: str = Field(
        default=None,
        description="Additional error details or suggestions",
        examples=["Check the API documentation for supported values"]
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "error": "UNSUPPORTED_MODEL",
                    "message": "Aircraft model 'INVALID' is not supported. Supported models: E190, E195",
                    "details": "Check the API documentation for supported values"
                }
            ]
        }
    }
