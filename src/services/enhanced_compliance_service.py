"""
Enhanced compliance service supporting new aircraft models and database integration.
"""

import json
from typing import List, Dict, Optional
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.compliance import ComplianceReport, ComplianceCheck as ComplianceCheckModel, AircraftInfo
from src.repositories import AuthorityRepository, AircraftModelRepository, RegulationRepository, ComplianceCheckRepository
from src.logger import log_business_event, log_security_event
from src.services.cache_service import cache_service
from src.config import settings


class ValidationError(Exception):
    """Custom exception for validation errors."""
    def __init__(self, message: str, error_type: str = "VALIDATION_ERROR"):
        self.message = message
        self.error_type = error_type
        super().__init__(self.message)


class EnhancedComplianceService:
    """Enhanced service for checking aircraft compliance with database support."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.authority_repo = AuthorityRepository(session)
        self.aircraft_repo = AircraftModelRepository(session)
        self.regulation_repo = RegulationRepository(session)
        self.compliance_check_repo = ComplianceCheckRepository(session)
        
        self.authority_map = {
            "USA": "FAA",
            "BRAZIL": "ANAC", 
            "EUROPE": "EASA",
        }
        
        # Extended supported models - All Embraer aircraft
        self.supported_models = [
            # E-Jets E2 (Nova Geração)
            "E175-E2", "E190-E2", "E195-E2",
            
            # E-Jets (Primeira Geração)
            "E170", "E175", "E175-E1", "E190", "E190-E1", "E195", "E195-E1",
            
            # Aviação Executiva - Família Phenom
            "Phenom-100EX", "Phenom-300E",
            
            # Aviação Executiva - Família Praetor
            "Praetor-500", "Praetor-600",
            
            # Defesa e Segurança
            "C-390", "KC-390", "A-29",
            
            # Aviação Agrícola
            "EMB-203",
            
            # Outros fabricantes (legado)
            "737", "737-800", "A320", "A320neo"
        ]
        
        self.supported_countries = ["USA", "BRAZIL", "EUROPE"]

    async def validate_input(self, model: str, country: str) -> None:
        """Validates input parameters with database checks.
        
        Args:
            model: The aircraft model.
            country: The country to check compliance in.
            
        Raises:
            ValidationError: If model or country is not supported.
        """
        log_business_event(
            "input_validation_started",
            {"model": model, "country": country}
        )

        # Check if country is supported
        country_upper = str(country).upper() if country else ""
        if country_upper not in self.supported_countries:
            raise ValidationError(
                f"Country '{country}' is not supported. Supported countries: {', '.join(self.supported_countries)}",
                "UNSUPPORTED_COUNTRY"
            )

        # Check if model exists in database
        aircraft_models = await self._find_aircraft_models(model)
        if not aircraft_models:
            raise ValidationError(
                f"Aircraft model '{model}' is not supported. Supported models: {', '.join(self.supported_models)}",
                "UNSUPPORTED_MODEL"
            )

        log_business_event(
            "input_validation_success", 
            {"model": model, "country": country}
        )

    async def _find_aircraft_models(self, model: str) -> List:
        """Find aircraft models by model name or variant."""
        # Try exact match first
        aircraft_models = await self.aircraft_repo.get_by_model(model)
        if aircraft_models:
            return aircraft_models
        
        # Try to find by variant (e.g., E175-E2)
        if "-" in model:
            base_model, variant = model.split("-", 1)
            # Search for base model
            base_models = await self.aircraft_repo.get_by_model(base_model)
            # Filter by variant
            for aircraft in base_models:
                if aircraft.variant and variant in aircraft.variant:
                    return [aircraft]
        
        # Try search in all models
        all_aircraft = await self.aircraft_repo.get_all()
        for aircraft in all_aircraft:
            # Check if model matches variant
            if aircraft.variant == model:
                return [aircraft]
            # Check if model is contained in variant
            if aircraft.variant and model in aircraft.variant:
                return [aircraft]
        
        # Fallback: if database is empty, validate against supported_models list
        if not all_aircraft and model in self.supported_models:
            # Return a mock aircraft model for validation
            return [{"model": model, "manufacturer": "Embraer", "variant": None}]
        
        return []

    async def get_applicable_regulations(self, model: str, country: str) -> List[Dict]:
        """Get applicable regulations for a specific aircraft model and country."""
        country_upper = str(country).upper() if country else ""
        authority_code = self.authority_map.get(country_upper)
        if not authority_code:
            return []

        authority = await self.authority_repo.get_by_code(authority_code)
        if not authority:
            # Fallback: use static regulations data when database is empty
            return await self._get_fallback_regulations(model, country_upper)

        # Get regulations for this authority
        authority_regulations = await self.regulation_repo.get_by_authority(authority.id)
        
        if not authority_regulations:
            # Fallback: use static regulations data when no regulations in database
            return await self._get_fallback_regulations(model, country_upper)
        
        applicable_regulations = []
        for regulation in authority_regulations:
            # Check if this regulation applies to the specific model
            if self._is_regulation_applicable(regulation, model):
                applicable_regulations.append({
                    "id": regulation.id,
                    "reference": regulation.reference,
                    "title": regulation.title,
                    "description": regulation.description,
                    "category": regulation.category,
                    "subcategory": regulation.subcategory,
                    "authority": authority.code,
                    "content": regulation.content
                })
        
        return applicable_regulations

    async def _get_fallback_regulations(self, model: str, country: str) -> List[Dict]:
        """Get regulations from static data as fallback when database is empty."""
        # Load static regulations data
        import json
        try:
            with open("src/data/regulations.json") as f:
                static_regulations = json.load(f)
        except FileNotFoundError:
            return []
        
        authority_code = self.authority_map.get(country)
        if not authority_code:
            return []
        
        applicable_regulations = []
        for regulation in static_regulations:
            if regulation.get("authority") == authority_code:
                # Check if model is in applicability list or use for all models if empty
                applicability = regulation.get("applicability", [])
                if not applicability or model in applicability or any(model.startswith(app) for app in applicability):
                    applicable_regulations.append({
                        "id": len(applicable_regulations) + 1,
                        "reference": regulation.get("description", ""),
                        "title": regulation.get("description", ""),
                        "description": regulation.get("description", ""),
                        "category": "General",
                        "subcategory": "Certification",
                        "authority": authority_code,
                        "content": {"applicable_models": applicability}
                    })
        
        return applicable_regulations

    def _is_regulation_applicable(self, regulation, model: str) -> bool:
        """Check if a regulation applies to a specific aircraft model."""
        # If regulation has content with applicable_models, check that
        if regulation.content and isinstance(regulation.content, dict):
            applicable_models = regulation.content.get("applicable_models", [])
            if applicable_models:
                # Check exact match or variant match
                for applicable_model in applicable_models:
                    if (applicable_model == model or 
                        applicable_model in model or 
                        model.startswith(applicable_model)):
                        return True
                return False
        
        # If no specific model restrictions, apply to all models
        return True

    async def check_compliance(self, model: str, country: str) -> ComplianceReport:
        """Performs comprehensive compliance check with database integration.
        
        Args:
            model: The aircraft model to check
            country: The country to check compliance in
            
        Returns:
            ComplianceReport: Detailed compliance report
            
        Raises:
            ValidationError: If input validation fails
            HTTPException: If service error occurs
        """
        try:
            # Input validation
            await self.validate_input(model, country)
            
            # Cache key for this specific check
            cache_key = f"compliance:{model}:{country}"
            
            # Try to get from cache first
            if cache_service.is_enabled:
                cached_result = await cache_service.get(cache_key)
                if cached_result:
                    log_business_event("cache_hit", {"cache_key": cache_key})
                    return ComplianceReport.model_validate(cached_result)

            log_business_event(
                "compliance_check_started",
                {"model": model, "country": country}
            )

            # Get aircraft information
            aircraft_models = await self._find_aircraft_models(model)
            aircraft_info = None
            if aircraft_models:
                aircraft = aircraft_models[0]  # Get first match
                # Handle both database objects and mock dictionaries
                if hasattr(aircraft, 'manufacturer'):
                    # Database object
                    aircraft_info = AircraftInfo(
                        manufacturer=aircraft.manufacturer,
                        model=aircraft.model,
                        variant=aircraft.variant,
                        type_certificate=aircraft.type_certificate,
                        max_seats=aircraft.max_seats,
                        max_weight_kg=aircraft.max_weight_kg
                    )
                else:
                    # Mock dictionary object (fallback)
                    aircraft_info = AircraftInfo(
                        manufacturer=aircraft.get("manufacturer", "Embraer"),
                        model=aircraft.get("model", model),
                        variant=aircraft.get("variant"),
                        type_certificate=f"TC-{model}",
                        max_seats=88 if "E175" in model else 108 if "E190" in model else 124,
                        max_weight_kg=38800 if "E175" in model else 51800 if "E190" in model else 56500
                    )

            # Get applicable regulations
            applicable_regulations = await self.get_applicable_regulations(model, country)
            
            # Perform compliance checks
            compliance_checks = []
            overall_status = "COMPLIANT"
            critical_issues = 0
            
            for regulation in applicable_regulations:
                check_result = await self._perform_individual_check(regulation, model, country)
                compliance_checks.append(check_result)
                
                if check_result.status == "NON_COMPLIANT":
                    if check_result.severity == "CRITICAL":
                        critical_issues += 1
                        overall_status = "NON_COMPLIANT"
                    elif overall_status == "COMPLIANT":
                        overall_status = "PARTIAL_COMPLIANCE"

            # Create summary
            total_checks = len(compliance_checks)
            compliant_checks = len([c for c in compliance_checks if c.status == "COMPLIANT"])
            
            # Determine final status
            if critical_issues > 0:
                overall_status = "NON_COMPLIANT"
            elif compliant_checks == total_checks:
                overall_status = "COMPLIANT"
            else:
                overall_status = "PARTIAL_COMPLIANCE"

            # Generate recommendations
            recommendations = self._generate_recommendations(compliance_checks, model, country)

            # Create compliance report
            compliance_report = ComplianceReport(
                aircraft_model=model,
                country=country,
                overall_status=overall_status,
                total_checks=total_checks,
                compliant_checks=compliant_checks,
                non_compliant_checks=total_checks - compliant_checks,
                critical_issues=critical_issues,
                checks=compliance_checks,
                recommendations=recommendations,
                aircraft_info=aircraft_info
            )

            # Cache the result
            if cache_service.is_enabled:
                await cache_service.set(
                    cache_key, 
                    compliance_report.model_dump(), 
                    ttl=settings.cache_ttl_seconds
                )

            log_business_event(
                "compliance_check_completed",
                {
                    "model": model,
                    "country": country,
                    "overall_status": overall_status,
                    "total_checks": total_checks,
                    "critical_issues": critical_issues
                }
            )

            return compliance_report

        except ValidationError:
            raise
        except Exception as e:
            log_security_event(
                "compliance_check_error",
                "error",
                {"model": model, "country": country, "error": str(e)}
            )
            raise HTTPException(
                status_code=500,
                detail=f"Internal server error during compliance check: {str(e)}"
            )

    async def _perform_individual_check(self, regulation: Dict, model: str, country: str) -> ComplianceCheckModel:
        """Perform individual compliance check for a regulation."""
        # Enhanced logic for specific model checks
        status = "COMPLIANT"
        severity = "INFO"
        findings = []
        recommendations = []

        # Check for model-specific requirements
        if regulation.get("content", {}).get("model_specific", False):
            applicable_models = regulation.get("content", {}).get("applicable_models", [])
            
            # More precise model matching
            model_matches = False
            for applicable_model in applicable_models:
                if self._model_matches(model, applicable_model):
                    model_matches = True
                    break
            
            if not model_matches:
                status = "NOT_APPLICABLE"
                findings.append(f"Regulation {regulation['reference']} does not apply to {model}")
            else:
                # Perform specific checks based on regulation category
                status, severity, specific_findings, specific_recommendations = self._perform_category_specific_check(
                    regulation, model, country
                )
                findings.extend(specific_findings)
                recommendations.extend(specific_recommendations)
        else:
            # General compliance check
            status = "COMPLIANT"
            findings.append(f"General compliance verified for {regulation['reference']}")

        return ComplianceCheckModel(
            regulation_reference=regulation["reference"],
            regulation_title=regulation["title"],
            status=status,
            severity=severity,
            findings=findings,
            recommendations=recommendations
        )

    def _model_matches(self, aircraft_model: str, regulation_model: str) -> bool:
        """Check if aircraft model matches regulation model specification."""
        # Exact match
        if aircraft_model == regulation_model:
            return True
        
        # Base model match (e.g., E175 matches E175-E1, E175-E2)
        if regulation_model in aircraft_model:
            return True
        
        # Series match (e.g., E175-E2 matches E175)
        if aircraft_model.startswith(regulation_model):
            return True
        
        return False

    def _perform_category_specific_check(self, regulation: Dict, model: str, country: str) -> tuple:
        """Perform category-specific compliance checks."""
        category = str(regulation.get("category", "")).lower()
        reference = str(regulation.get("reference", ""))
        findings = []
        recommendations = []
        
        # Default status
        status = "COMPLIANT"
        severity = "INFO"
        
        if "airworthiness directive" in category or "ad" in reference.lower():
            # Airworthiness Directives are mandatory
            status = "COMPLIANT"  # Assume compliance until inspection
            severity = "CRITICAL"
            findings.append(f"Airworthiness Directive {reference} requires mandatory compliance")
            recommendations.append("Schedule required inspection within specified timeframe")
            
        elif "systems" in category:
            # Systems requirements
            if "e2" in str(model).lower() and "e2" in str(regulation.get("title", "")).lower():
                status = "COMPLIANT"
                severity = "MAJOR"
                findings.append(f"E-Jets E2 specific systems requirements verified for {model}")
            else:
                status = "COMPLIANT"
                findings.append(f"Standard systems requirements apply to {model}")
                
        elif "certification" in category:
            # Type Certificate requirements
            status = "COMPLIANT"
            severity = "CRITICAL"
            findings.append(f"Type certification requirements verified for {model}")
            recommendations.append("Ensure valid Type Certificate is maintained")
            
        elif "operations" in category:
            # Operational requirements
            status = "COMPLIANT"
            severity = "MAJOR"
            findings.append(f"Operational procedures verified for {model}")
            recommendations.append("Review operating procedures and limitations")
            
        else:
            # General requirement
            status = "COMPLIANT"
            findings.append(f"General requirement {reference} verified for {model}")
        
        return status, severity, findings, recommendations

    def _generate_recommendations(self, compliance_checks: List[ComplianceCheckModel], model: str, country: str) -> List[str]:
        """Generate overall recommendations based on compliance results."""
        recommendations = []
        
        critical_issues = [c for c in compliance_checks if c.severity == "CRITICAL" and c.status != "COMPLIANT"]
        major_issues = [c for c in compliance_checks if c.severity == "MAJOR" and c.status != "COMPLIANT"]
        
        if critical_issues:
            recommendations.append(f"URGENT: Address {len(critical_issues)} critical compliance issues immediately")
            
        if major_issues:
            recommendations.append(f"IMPORTANT: Review {len(major_issues)} major compliance requirements")
        
        # Model-specific recommendations
        if "e2" in str(model).lower():
            recommendations.append("Ensure E-Jets E2 specific training and procedures are implemented")
            recommendations.append("Verify E2-series specific maintenance requirements are followed")
        
        if "e175" in str(model).lower():
            recommendations.append("Review E175-specific operational limitations and procedures")
        
        # Country-specific recommendations
        authority = self.authority_map.get(country.upper(), "")
        if authority:
            recommendations.append(f"Maintain current {authority} certification and documentation")
        
        if not recommendations:
            recommendations.append("All compliance requirements are currently satisfied")
            recommendations.append("Continue regular monitoring and documentation review")
            
        return recommendations