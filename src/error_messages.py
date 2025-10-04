"""
User-friendly error messages for the Aviation Compliance Microservice.

This module provides localized, clear, and actionable error messages for
common error scenarios, improving the user experience by providing helpful
guidance and avoiding technical jargon.
"""

from typing import Dict, Any, Optional, List
from src.exceptions import ValidationError, DatabaseError, CacheError


class ErrorMessageBuilder:
    """
    Builder class for creating user-friendly error messages.
    
    Provides methods to create clear, actionable error messages with
    contextual information and helpful suggestions.
    """
    
    # Supported aircraft models with their display names
    AIRCRAFT_MODELS = {
        "E175": "Embraer E175",
        "E175-E1": "Embraer E175-E1", 
        "E175-E2": "Embraer E175-E2",
        "E190": "Embraer E190",
        "E190-E1": "Embraer E190-E1",
        "E190-E2": "Embraer E190-E2", 
        "E195": "Embraer E195",
        "E195-E1": "Embraer E195-E1",
        "E195-E2": "Embraer E195-E2",
        "737": "Boeing 737",
        "A320": "Airbus A320"
    }
    
    # Supported countries/regions with their regulatory authorities
    COUNTRIES = {
        "USA": {
            "name": "Estados Unidos",
            "authority": "FAA (Federal Aviation Administration)",
            "description": "Regulamentações americanas de aviação civil"
        },
        "BRAZIL": {
            "name": "Brasil", 
            "authority": "ANAC (Agência Nacional de Aviação Civil)",
            "description": "Regulamentações brasileiras de aviação civil"
        },
        "EUROPE": {
            "name": "Europa",
            "authority": "EASA (European Union Aviation Safety Agency)", 
            "description": "Regulamentações europeias de aviação civil"
        },
        "UK": {
            "name": "Reino Unido",
            "authority": "CAA (Civil Aviation Authority)",
            "description": "Regulamentações britânicas de aviação civil"
        },
        "CANADA": {
            "name": "Canadá",
            "authority": "Transport Canada",
            "description": "Regulamentações canadenses de aviação civil"
        }
    }

    @staticmethod
    def get_supported_models_list() -> List[str]:
        """Get a formatted list of supported aircraft models."""
        return list(ErrorMessageBuilder.AIRCRAFT_MODELS.keys())

    @staticmethod
    def get_supported_countries_list() -> List[str]:
        """Get a formatted list of supported countries."""
        return list(ErrorMessageBuilder.COUNTRIES.keys())

    @staticmethod
    def create_unsupported_aircraft_error(model: str) -> ValidationError:
        """
        Create a user-friendly error for unsupported aircraft models.
        
        Args:
            model: The invalid aircraft model provided
            
        Returns:
            ValidationError with detailed, helpful message
        """
        supported_models = ErrorMessageBuilder.get_supported_models_list()
        friendly_models = [f"{key} ({value})" for key, value in ErrorMessageBuilder.AIRCRAFT_MODELS.items()]
        
        message = (
            f"O modelo de aeronave '{model}' não é suportado pelo sistema. "
            f"Por favor, utilize um dos modelos disponíveis."
        )
        
        return ValidationError(
            message=message,
            error_code="UNSUPPORTED_AIRCRAFT_MODEL",
            field="model",
            value=model,
            context={
                "supported_models": supported_models,
                "friendly_models": friendly_models,
                "suggestion": "Verifique a documentação da API para a lista completa de modelos suportados.",
                "total_supported": len(supported_models)
            }
        )

    @staticmethod
    def create_unsupported_country_error(country: str) -> ValidationError:
        """
        Create a user-friendly error for unsupported countries.
        
        Args:
            country: The invalid country provided
            
        Returns:
            ValidationError with detailed, helpful message
        """
        supported_countries = ErrorMessageBuilder.get_supported_countries_list()
        friendly_countries = []
        
        for key, info in ErrorMessageBuilder.COUNTRIES.items():
            friendly_countries.append({
                "code": key,
                "name": info["name"],
                "authority": info["authority"],
                "description": info["description"]
            })
        
        message = (
            f"O país/região '{country}' não é suportado pelo sistema. "
            f"Por favor, utilize uma das opções disponíveis."
        )
        
        return ValidationError(
            message=message,
            error_code="UNSUPPORTED_COUNTRY",
            field="country", 
            value=country,
            context={
                "supported_countries": supported_countries,
                "friendly_countries": friendly_countries,
                "suggestion": "Consulte a documentação para ver todas as regiões e autoridades regulatórias suportadas.",
                "total_supported": len(supported_countries)
            }
        )

    @staticmethod
    def create_missing_parameter_error(parameter: str, description: str) -> ValidationError:
        """
        Create a user-friendly error for missing required parameters.
        
        Args:
            parameter: Name of the missing parameter
            description: Description of what the parameter represents
            
        Returns:
            ValidationError with helpful guidance
        """
        message = (
            f"O parâmetro '{parameter}' é obrigatório mas não foi fornecido. "
            f"Este parâmetro representa: {description}."
        )
        
        return ValidationError(
            message=message,
            error_code="MISSING_REQUIRED_PARAMETER",
            field=parameter,
            context={
                "parameter": parameter,
                "description": description,
                "suggestion": f"Inclua o parâmetro '{parameter}' na sua requisição."
            }
        )

    @staticmethod
    def create_database_connection_error() -> DatabaseError:
        """
        Create a user-friendly error for database connection issues.
        
        Returns:
            DatabaseError with helpful message
        """
        message = (
            "Não foi possível conectar ao banco de dados do sistema. "
            "Este é um problema temporário. Por favor, tente novamente em alguns momentos."
        )
        
        return DatabaseError(
            message=message,
            error_code="DATABASE_CONNECTION_FAILED",
            operation="CONNECT",
            context={
                "suggestion": "Se o problema persistir, entre em contato com o suporte técnico.",
                "retry_recommended": True,
                "estimated_fix_time": "5-10 minutos"
            }
        )

    @staticmethod
    def create_resource_not_found_error(resource_type: str, identifier: Any) -> ValidationError:
        """
        Create a user-friendly error for missing resources.
        
        Args:
            resource_type: Type of resource that wasn't found
            identifier: The identifier used to search for the resource
            
        Returns:
            ValidationError with helpful guidance
        """
        resource_names = {
            "aircraft": "aeronave",
            "regulation": "regulamentação",
            "authority": "autoridade regulatória",
            "compliance_check": "verificação de conformidade",
            "model": "modelo de aeronave"
        }
        
        friendly_name = resource_names.get(resource_type.lower(), resource_type)
        
        message = (
            f"A {friendly_name} solicitada (ID: {identifier}) não foi encontrada no sistema. "
            f"Verifique se o identificador está correto."
        )
        
        return ValidationError(
            message=message,
            error_code="RESOURCE_NOT_FOUND",
            context={
                "resource_type": resource_type,
                "identifier": str(identifier),
                "suggestion": f"Verifique se o identificador da {friendly_name} está correto e existe no sistema.",
                "friendly_name": friendly_name
            }
        )

    @staticmethod
    def create_service_unavailable_error(service_name: str) -> CacheError:
        """
        Create a user-friendly error for service unavailability.
        
        Args:
            service_name: Name of the unavailable service
            
        Returns:
            CacheError with helpful message
        """
        service_names = {
            "cache": "serviço de cache",
            "redis": "sistema de cache Redis",
            "database": "banco de dados"
        }
        
        friendly_name = service_names.get(service_name.lower(), service_name)
        
        message = (
            f"O {friendly_name} está temporariamente indisponível. "
            f"O sistema continuará funcionando, mas com performance reduzida."
        )
        
        return CacheError(
            message=message,
            error_code="SERVICE_UNAVAILABLE",
            context={
                "service_name": service_name,
                "friendly_name": friendly_name,
                "impact": "Performance reduzida, mas funcionalidade mantida",
                "suggestion": "Nenhuma ação necessária. O serviço será restaurado automaticamente."
            }
        )

    @staticmethod
    def create_rate_limit_error(limit: int, window: str) -> ValidationError:
        """
        Create a user-friendly error for rate limit exceeded.
        
        Args:
            limit: The rate limit that was exceeded
            window: The time window for the limit
            
        Returns:
            ValidationError with helpful guidance
        """
        message = (
            f"Limite de requisições excedido. "
            f"Você pode fazer até {limit} requisições por {window}. "
            f"Aguarde um momento antes de tentar novamente."
        )
        
        return ValidationError(
            message=message,
            error_code="RATE_LIMIT_EXCEEDED",
            context={
                "limit": limit,
                "window": window,
                "suggestion": f"Aguarde {window} antes de fazer novas requisições ou reduza a frequência.",
                "retry_after": window
            }
        )

    @staticmethod
    def create_validation_error_summary(errors: List[Dict[str, Any]]) -> ValidationError:
        """
        Create a comprehensive validation error for multiple field errors.
        
        Args:
            errors: List of validation errors with field details
            
        Returns:
            ValidationError with summary of all issues
        """
        error_count = len(errors)
        
        if error_count == 1:
            error = errors[0]
            message = f"Erro de validação no campo '{error['field']}': {error['message']}"
        else:
            message = f"Foram encontrados {error_count} erros de validação nos dados fornecidos."
        
        return ValidationError(
            message=message,
            error_code="MULTIPLE_VALIDATION_ERRORS",
            context={
                "validation_errors": errors,
                "total_errors": error_count,
                "suggestion": "Corrija os erros indicados e tente novamente.",
                "fields_with_errors": [error["field"] for error in errors]
            }
        )


# Convenience functions for creating common errors

def unsupported_aircraft_model(model: str) -> ValidationError:
    """Convenience function to create unsupported aircraft model error."""
    return ErrorMessageBuilder.create_unsupported_aircraft_error(model)


def unsupported_country(country: str) -> ValidationError:
    """Convenience function to create unsupported country error.""" 
    return ErrorMessageBuilder.create_unsupported_country_error(country)


def missing_parameter(parameter: str, description: str) -> ValidationError:
    """Convenience function to create missing parameter error."""
    return ErrorMessageBuilder.create_missing_parameter_error(parameter, description)


def resource_not_found(resource_type: str, identifier: Any) -> ValidationError:
    """Convenience function to create resource not found error."""
    return ErrorMessageBuilder.create_resource_not_found_error(resource_type, identifier)


def database_connection_failed() -> DatabaseError:
    """Convenience function to create database connection error."""
    return ErrorMessageBuilder.create_database_connection_error()


def service_unavailable(service_name: str) -> CacheError:
    """Convenience function to create service unavailable error."""
    return ErrorMessageBuilder.create_service_unavailable_error(service_name)


def rate_limit_exceeded(limit: int, window: str) -> ValidationError:
    """Convenience function to create rate limit error."""
    return ErrorMessageBuilder.create_rate_limit_error(limit, window)