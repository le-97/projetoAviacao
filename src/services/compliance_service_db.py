"""
Compliance service using PostgreSQL database for data persistence.
"""

from typing import Dict, List, Optional
from uuid import UUID
from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.compliance import ComplianceReport as ComplianceReportModel
from src.models.db_models import Authority, AircraftModel, Regulation, ComplianceCheck
from src.repositories import (
    AuthorityRepository,
    AircraftModelRepository, 
    RegulationRepository,
    ComplianceCheckRepository
)
from src.logger import log_business_event, log_security_event
from src.services.cache_service import cache_service
from src.config import settings


class ValidationError(Exception):
    """Custom exception for validation errors."""
    def __init__(self, message: str, error_type: str = "VALIDATION_ERROR"):
        self.message = message
        self.error_type = error_type
        super().__init__(self.message)


class PostgreSQLComplianceService:
    """Enhanced compliance service using PostgreSQL database."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.authority_repo = AuthorityRepository(session)
        self.aircraft_repo = AircraftModelRepository(session)
        self.regulation_repo = RegulationRepository(session)
        self.check_repo = ComplianceCheckRepository(session)

    async def validate_aircraft_model(self, manufacturer: str, model: str) -> AircraftModel:
        """Validate and get aircraft model from database."""
        aircraft_models = await self.aircraft_repo.get_by_manufacturer_and_model(manufacturer, model)
        
        if not aircraft_models:
            log_security_event(
                "invalid_input_detected",
                "warning",
                {"error": "aircraft_not_found", "manufacturer": manufacturer, "model": model}
            )
            raise ValidationError(
                f"Aircraft model '{manufacturer} {model}' not found in database",
                "AIRCRAFT_NOT_FOUND"
            )
        
        # Return the first match (assuming unique manufacturer+model combination)
        return aircraft_models[0]

    async def validate_authority(self, country: str) -> Authority:
        """Validate and get authority by country."""
        # Map country to authority code
        country_authority_map = {
            "USA": "FAA",
            "BRAZIL": "ANAC", 
            "EUROPE": "EASA",
        }
        
        authority_code = country_authority_map.get(country.upper())
        if not authority_code:
            log_security_event(
                "invalid_input_detected", 
                "warning",
                {"error": "unsupported_country", "country": country}
            )
            raise ValidationError(
                f"Country '{country}' not supported. Supported: {', '.join(country_authority_map.keys())}",
                "UNSUPPORTED_COUNTRY"
            )
        
        authority = await self.authority_repo.get_by_code(authority_code)
        if not authority:
            raise ValidationError(
                f"Authority '{authority_code}' not found in database",
                "AUTHORITY_NOT_FOUND"
            )
        
        return authority

    async def get_applicable_regulations(
        self, 
        aircraft_model: AircraftModel, 
        authority: Authority
    ) -> List[Regulation]:
        """Get regulations applicable to aircraft model from specific authority."""
        # Get regulations by authority
        regulations = await self.regulation_repo.get_by_authority(authority.id)
        
        # Filter by aircraft model if there are specific associations
        aircraft_with_regs = await self.aircraft_repo.get_with_regulations(aircraft_model.id)
        if aircraft_with_regs and aircraft_with_regs.regulations:
            # If there are specific regulations assigned to this aircraft model
            applicable_regs = [
                reg for reg in regulations 
                if reg.id in [r.id for r in aircraft_with_regs.regulations]
            ]
            return applicable_regs
        
        # Otherwise return all active regulations from the authority
        active_regs = [reg for reg in regulations if reg.status == "active"]
        return active_regs

    async def perform_compliance_checks(
        self,
        aircraft_model: AircraftModel,
        regulations: List[Regulation]
    ) -> List[ComplianceCheck]:
        """Perform compliance checks for aircraft model against regulations."""
        compliance_checks = []
        
        for regulation in regulations:
            # Check if there's already a recent compliance check
            existing_check = await self.check_repo.get_latest_by_aircraft_and_regulation(
                aircraft_model.id, regulation.id
            )
            
            # If no existing check or check is old, create new one
            if not existing_check or self._is_check_outdated(existing_check):
                # Perform the compliance check logic
                check_result = await self._evaluate_regulation_compliance(
                    aircraft_model, regulation
                )
                
                # Create new compliance check record
                new_check = await self.check_repo.create(
                    aircraft_model_id=aircraft_model.id,
                    regulation_id=regulation.id,
                    check_date=datetime.utcnow(),
                    status=check_result['status'],
                    compliance_percentage=check_result.get('percentage'),
                    details=check_result.get('details', {}),
                    notes=check_result.get('notes'),
                    checked_by="system"
                )
                compliance_checks.append(new_check)
            else:
                # Use existing check
                compliance_checks.append(existing_check)
        
        return compliance_checks

    async def _evaluate_regulation_compliance(
        self, 
        aircraft_model: AircraftModel, 
        regulation: Regulation
    ) -> Dict:
        """Evaluate compliance of aircraft model against a specific regulation."""
        # This is where the actual compliance logic would go
        # For now, implementing basic logic similar to the original service
        
        status = "compliant"
        percentage = 100.0
        details = {
            "regulation_reference": regulation.reference,
            "check_criteria": regulation.description,
            "aircraft_category": aircraft_model.category,
            "manufacturer": aircraft_model.manufacturer
        }
        
        # Check for AD (Airworthiness Directive) requirements
        if "AD-" in regulation.description:
            status = "pending"
            percentage = 75.0
            details["pending_action"] = "Airworthiness Directive compliance required"
        
        # Add category-specific checks
        if aircraft_model.category == "Transport" and regulation.category == "Commercial Operations":
            if aircraft_model.max_seats and aircraft_model.max_seats > 100:
                # Large aircraft might have additional requirements
                if "emergency" in regulation.description.lower():
                    status = "non_compliant"
                    percentage = 60.0
                    details["non_compliance_reason"] = "Enhanced emergency equipment required for large aircraft"
        
        return {
            "status": status,
            "percentage": percentage,
            "details": details,
            "notes": f"Automated compliance check for {regulation.reference}"
        }

    def _is_check_outdated(self, check: ComplianceCheck, max_age_days: int = 30) -> bool:
        """Check if compliance check is outdated."""
        age = datetime.utcnow() - check.check_date
        return age.days > max_age_days

    async def check_compliance(
        self, 
        manufacturer: str,
        model: str, 
        country: str
    ) -> ComplianceReportModel:
        """
        Enhanced compliance check using PostgreSQL database.
        
        Args:
            manufacturer: Aircraft manufacturer
            model: Aircraft model
            country: Country for regulatory compliance
            
        Returns:
            ComplianceReport with detailed compliance information
        """
        log_business_event(
            "compliance_check_started",
            {"manufacturer": manufacturer, "model": model, "country": country}
        )
        
        try:
            # Check cache first
            cache_key = f"{manufacturer}_{model}_{country}"
            if settings.cache_enabled and cache_service.is_connected:
                cached_result = await cache_service.get(cache_key)
                if cached_result:
                    log_business_event("compliance_check_cache_hit", {"cache_key": cache_key})
                    return ComplianceReportModel(**cached_result)
            
            # Validate inputs and get database entities
            aircraft_model = await self.validate_aircraft_model(manufacturer, model)
            authority = await self.validate_authority(country)
            
            # Get applicable regulations
            regulations = await self.get_applicable_regulations(aircraft_model, authority)
            
            # Perform compliance checks
            compliance_checks = await self.perform_compliance_checks(aircraft_model, regulations)
            
            # Generate compliance summary
            summary = await self.check_repo.get_compliance_summary(aircraft_model.id)
            
            # Compile pending requirements
            pending_requirements = [
                f"{check.regulation.reference}: {check.notes or check.regulation.title}"
                for check in compliance_checks
                if check.status in ["pending", "non_compliant"]
            ]
            
            # Determine overall status
            overall_status = "OK"
            if any(check.status == "non_compliant" for check in compliance_checks):
                overall_status = "NON_COMPLIANT"
            elif any(check.status == "pending" for check in compliance_checks):
                overall_status = "PENDING"
            
            # Create compliance report
            result = ComplianceReportModel(
                aircraft_model=f"{manufacturer} {model}",
                country=country,
                status=overall_status,
                pending_requirements=pending_requirements,
                compliance_percentage=summary.get('average_compliance', 0.0),
                total_checks=summary.get('total_checks', 0),
                authority=authority.name,
                check_date=datetime.utcnow().isoformat()
            )
            
            # Cache the result
            if settings.cache_enabled and cache_service.is_connected:
                await cache_service.set(cache_key, result.dict(), ttl=settings.cache_ttl_seconds)
            
            log_business_event(
                "compliance_check_completed",
                {
                    "manufacturer": manufacturer,
                    "model": model, 
                    "country": country,
                    "authority": authority.name,
                    "status": overall_status,
                    "total_checks": len(compliance_checks),
                    "pending_count": len(pending_requirements)
                }
            )
            
            return result
            
        except ValidationError:
            raise
        except Exception as e:
            log_business_event(
                "compliance_check_error",
                {
                    "manufacturer": manufacturer,
                    "model": model,
                    "country": country,
                    "error": str(e)
                }
            )
            raise HTTPException(
                status_code=500,
                detail=f"Internal error during compliance check: {str(e)}"
            )

    async def get_aircraft_compliance_history(
        self, 
        manufacturer: str, 
        model: str
    ) -> List[Dict]:
        """Get compliance check history for an aircraft model."""
        aircraft_model = await self.validate_aircraft_model(manufacturer, model)
        checks = await self.check_repo.get_by_aircraft(aircraft_model.id)
        
        return [
            {
                "check_id": str(check.id),
                "regulation": check.regulation.reference,
                "regulation_title": check.regulation.title,
                "authority": check.regulation.authority.name,
                "check_date": check.check_date.isoformat(),
                "status": check.status,
                "compliance_percentage": check.compliance_percentage,
                "notes": check.notes
            }
            for check in checks
        ]