import json
from src.models.compliance import ComplianceReport
from fastapi import HTTPException
from src.logger import log_business_event, log_security_event
from src.services.cache_service import cache_service
from src.config import settings


class ValidationError(Exception):
    """Custom exception for validation errors."""
    def __init__(self, message: str, error_type: str = "VALIDATION_ERROR"):
        self.message = message
        self.error_type = error_type
        super().__init__(self.message)


class ComplianceService:
    """Service for checking aircraft compliance with Redis caching."""

    def __init__(self):
        # Load regulations once at startup
        self._regulations = None
        self.authority_map = {
            "USA": "FAA",
            "BRAZIL": "ANAC", 
            "EUROPE": "EASA",
        }
        self.supported_models = [
            # E-Jets E2 (Nova Geração)
            "E175-E2", "E190-E2", "E195-E2",
            
            # E-Jets (Primeira Geração)
            "E170", "E175", "E190", "E195",
            
            # Aviação Executiva - Família Phenom
            "Phenom-100EX", "Phenom-300E",
            
            # Aviação Executiva - Família Praetor
            "Praetor-500", "Praetor-600",
            
            # Defesa e Segurança
            "C-390", "KC-390", "A-29",
            
            # Aviação Agrícola
            "EMB-203"
        ]
        self.supported_countries = ["USA", "BRAZIL", "EUROPE"]

    @property
    def regulations(self):
        """Lazy load regulations data."""
        if self._regulations is None:
            with open("src/data/regulations.json") as f:
                self._regulations = json.load(f)
        return self._regulations

    def validate_input(self, model: str, country: str) -> None:
        """Validates input parameters.
        
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
        
        if not model or not model.strip():
            log_security_event(
                "invalid_input_detected",
                "warning",
                {"error": "missing_model", "input": "empty_model"}
            )
            raise ValidationError("Aircraft model is required", "MISSING_MODEL")
            
        if not country or not country.strip():
            log_security_event(
                "invalid_input_detected",
                "warning", 
                {"error": "missing_country", "input": "empty_country"}
            )
            raise ValidationError("Country is required", "MISSING_COUNTRY")
            
        if model.upper() not in self.supported_models:
            log_security_event(
                "invalid_input_detected",
                "warning",
                {"error": "unsupported_model", "model": model, "supported": self.supported_models}
            )
            raise ValidationError(
                f"Aircraft model '{model}' is not supported. Supported models: {', '.join(self.supported_models)}", 
                "UNSUPPORTED_MODEL"
            )
            
        if country.upper() not in self.supported_countries:
            log_security_event(
                "invalid_input_detected",
                "warning",
                {"error": "unsupported_country", "country": country, "supported": self.supported_countries}
            )
            raise ValidationError(
                f"Country '{country}' is not supported. Supported countries: {', '.join(self.supported_countries)}", 
                "UNSUPPORTED_COUNTRY"
            )
            
        log_business_event(
            "input_validation_completed",
            {"model": model, "country": country, "status": "valid"}
        )

    async def check_compliance(self, model: str, country: str) -> ComplianceReport:
        """Checks the compliance of an aircraft model in a given country with caching.

        Args:
            model: The aircraft model.
            country: The country to check compliance in.

        Returns:
            A compliance report.
            
        Raises:
            ValidationError: If model or country is not supported.
        """
        log_business_event(
            "compliance_check_started",
            {"model": model, "country": country}
        )
        
        # Validate input first
        self.validate_input(model, country)
        
        # Try to get from cache first
        if settings.cache_enabled and cache_service.is_connected:
            try:
                cached_result = await cache_service.get_compliance_result(model, country)
                if cached_result:
                    log_business_event(
                        "compliance_check_cache_hit",
                        {
                            "model": model, 
                            "country": country,
                            "cache_used": True
                        }
                    )
                    # Convert cached dict back to ComplianceReport
                    return ComplianceReport(**cached_result)
            except Exception as e:
                log_business_event(
                    "compliance_check_cache_error",
                    {
                        "model": model, 
                        "country": country,
                        "error": str(e)
                    }
                )
        
        # Cache miss or cache disabled - perform actual compliance check
        pending_requirements = []
        status = "OK"
        authority = self.authority_map.get(country.upper())

        if authority:
            for reg in self.regulations:
                if authority == reg["authority"] and model.upper() in reg["applicability"]:
                    if "AD-" in reg["description"]:
                        pending_requirements.append(reg["description"])
                        status = "PENDING"

        result = ComplianceReport(
            aircraft_model=model,
            country=country,
            status=status,
            pending_requirements=pending_requirements,
        )
        
        # Cache the result for future requests
        if settings.cache_enabled and cache_service.is_connected:
            try:
                await cache_service.set_compliance_result(model, country, result)
                log_business_event(
                    "compliance_check_cached",
                    {
                        "model": model, 
                        "country": country,
                        "cached": True
                    }
                )
            except Exception as e:
                log_business_event(
                    "compliance_check_cache_store_error",
                    {
                        "model": model, 
                        "country": country,
                        "error": str(e)
                    }
                )
        
        log_business_event(
            "compliance_check_completed",
            {
                "model": model, 
                "country": country, 
                "authority": authority,
                "status": status,
                "pending_count": len(pending_requirements),
                "cache_used": False
            }
        )
        
        return result
