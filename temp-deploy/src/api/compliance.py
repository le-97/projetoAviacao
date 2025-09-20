"""
API endpoints for compliance checking service with database integration.
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any, Annotated
import asyncio

from src.services.enhanced_compliance_service import EnhancedComplianceService, ValidationError
from src.models.compliance import ComplianceReport, ErrorResponse
from src.database import get_async_session
from src.logger import log_business_event, log_security_event


# Create router instance
router = APIRouter(prefix="/compliance", tags=["compliance"])


async def get_compliance_service(session: AsyncSession = Depends(get_async_session)) -> EnhancedComplianceService:
    """Dependency to get compliance service instance."""
    return EnhancedComplianceService(session)

@router.get("/check/{model}/{country}", response_model=ComplianceReport)
async def check_compliance(
    model: str, 
    country: str,
    compliance_service: EnhancedComplianceService = Depends(get_compliance_service)
):
    """
    Check compliance for an aircraft model in a specific country.
    
    Args:
        model: Aircraft model (e.g., "E175", "E175-E2", "737")
        country: Country to check compliance in (e.g., "USA", "BRAZIL", "EUROPE")
        
    Returns:
        ComplianceReport: Detailed compliance report with database-backed validation
        
    Raises:
        HTTPException: If validation fails or service error occurs
    """
    try:
        log_business_event(
            "compliance_check_request",
            {"model": model, "country": country}
        )
        
        result = await compliance_service.check_compliance(model, country)
        
        log_business_event(
            "compliance_check_response",
            {"model": model, "country": country, "status": result.overall_status}
        )
        
        return result
        
    except ValidationError as e:
        log_security_event(
            "compliance_validation_error",
            "WARNING",
            {"model": model, "country": country, "error": e.message}
        )
        raise HTTPException(status_code=400, detail=e.message)
    
    except Exception as e:
        log_security_event(
            "compliance_check_error",
            "ERROR",
            {"model": model, "country": country, "error": str(e)}
        )
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/check-compliance", 
           response_model=ComplianceReport,
           summary="Check Aircraft Compliance (Legacy)",
           description="Legacy endpoint with enhanced database support")
async def check_compliance_legacy(
    model: Annotated[str, Query(
        description="Aircraft model to check compliance for",
        examples=["E175", "E175-E2", "E190", "E195"],
        pattern="^(E175|E175-E1|E175-E2|E190|E190-E1|E190-E2|E195|E195-E1|E195-E2|737|A320)$"
    )],
    country: Annotated[str, Query(
        description="Country/region to check compliance against", 
        examples=["USA", "BRAZIL", "EUROPE"],
        pattern="^(USA|BRAZIL|EUROPE|usa|brazil|europe)$"
    )],
    compliance_service: EnhancedComplianceService = Depends(get_compliance_service)
):
    """Legacy endpoint for backward compatibility with enhanced database support."""
    try:
        log_business_event(
            "api_compliance_request_received",
            {"endpoint": "/check-compliance", "model": model, "country": country}
        )
        
        result = await compliance_service.check_compliance(model, country)
        
        log_business_event(
            "api_compliance_request_completed",
            {
                "endpoint": "/check-compliance", 
                "model": model, 
                "country": country,
                "status": result.overall_status,
                "response_code": 200
            }
        )
        
        return result
        
    except ValidationError as e:
        log_security_event(
            "api_validation_error",
            "warning",
            {
                "endpoint": "/check-compliance",
                "error_type": e.error_type,
                "message": e.message,
                "model": model,
                "country": country
            }
        )
        
        if e.error_type in ["MISSING_MODEL", "MISSING_COUNTRY"]:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": e.error_type,
                    "message": e.message,
                    "details": "Please provide valid model and country parameters"
                }
            )
        elif e.error_type in ["UNSUPPORTED_MODEL", "UNSUPPORTED_COUNTRY"]:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": e.error_type,
                    "message": e.message,
                    "details": "Check the API documentation for supported values"
                }
            )
        else:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "VALIDATION_ERROR",
                    "message": e.message,
                    "details": None
                }
            )


@router.get("/models")
async def get_supported_models(
    compliance_service: EnhancedComplianceService = Depends(get_compliance_service)
):
    """Get list of supported aircraft models from database."""
    try:
        # Get models from database
        all_aircraft = await compliance_service.aircraft_repo.get_all()
        db_models = [aircraft.model for aircraft in all_aircraft]
        
        # Get authorities from database  
        all_authorities = await compliance_service.authority_repo.get_all()
        db_countries = [auth.country for auth in all_authorities if auth.country]
        
        return {
            "models": compliance_service.supported_models,
            "countries": compliance_service.supported_countries,
            "database_models": db_models,
            "database_countries": db_countries,
            "total_aircraft_in_db": len(all_aircraft),
            "total_authorities_in_db": len(all_authorities)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving models: {str(e)}")


@router.get("/regulations/{model}/{country}")
async def get_regulations(
    model: str, 
    country: str,
    compliance_service: EnhancedComplianceService = Depends(get_compliance_service)
):
    """Get applicable regulations for an aircraft model and country from database."""
    try:
        await compliance_service.validate_input(model, country)
        regulations = await compliance_service.get_applicable_regulations(model, country)
        
        return {
            "model": model,
            "country": country,
            "total_regulations": len(regulations),
            "regulations": regulations
        }
        
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=e.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving regulations: {str(e)}")


@router.get("/authorities")
async def get_authorities(
    compliance_service: EnhancedComplianceService = Depends(get_compliance_service)
):
    """Get all aviation authorities from database."""
    try:
        authorities = await compliance_service.authority_repo.get_all()
        
        return {
            "total_authorities": len(authorities),
            "authorities": [
                {
                    "id": auth.id,
                    "code": auth.code,
                    "name": auth.name,
                    "country": auth.country,
                    "website": auth.website
                }
                for auth in authorities
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving authorities: {str(e)}")


@router.get("/aircraft")
async def get_aircraft_models(
    compliance_service: EnhancedComplianceService = Depends(get_compliance_service)
):
    """Get all aircraft models from database."""
    try:
        aircraft = await compliance_service.aircraft_repo.get_all()
        
        return {
            "total_aircraft": len(aircraft),
            "aircraft": [
                {
                    "id": ac.id,
                    "manufacturer": ac.manufacturer,
                    "model": ac.model,
                    "variant": ac.variant,
                    "type_certificate": ac.type_certificate,
                    "max_seats": ac.max_seats,
                    "max_weight_kg": ac.max_weight_kg
                }
                for ac in aircraft
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving aircraft: {str(e)}")


@router.get("/health")
async def health_check(
    compliance_service: EnhancedComplianceService = Depends(get_compliance_service)
):
    """Health check endpoint with database connectivity test."""
    try:
        # Test database connectivity
        authorities_count = len(await compliance_service.authority_repo.get_all())
        aircraft_count = len(await compliance_service.aircraft_repo.get_all())
        regulations_count = len(await compliance_service.regulation_repo.get_all())
        
        return {
            "status": "healthy",
            "service": "enhanced_compliance",
            "database": "connected",
            "data_summary": {
                "authorities": authorities_count,
                "aircraft": aircraft_count,
                "regulations": regulations_count
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "enhanced_compliance",
            "database": "disconnected",
            "error": str(e)
        }


@router.get("/")
async def compliance_root():
    """Root endpoint with API information."""
    return {
        "service": "Enhanced Aviation Compliance API",
        "version": "2.0.0",
        "description": "Database-backed compliance checking for aviation regulations",
        "features": [
            "Database-driven aircraft model validation",
            "Authority-specific regulation retrieval", 
            "Enhanced E175 and E-Jets E2 support",
            "Model-specific compliance validation",
            "Comprehensive reporting and recommendations"
        ],
        "endpoints": {
            "check": "/compliance/check/{model}/{country}",
            "check_legacy": "/compliance/check-compliance",
            "models": "/compliance/models",
            "regulations": "/compliance/regulations/{model}/{country}",
            "authorities": "/compliance/authorities",
            "aircraft": "/compliance/aircraft",
            "health": "/compliance/health"
        }
    }
