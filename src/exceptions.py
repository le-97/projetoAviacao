"""
Custom exception classes for the Aviation Compliance Microservice.

This module defines a hierarchy of custom exceptions to handle different error scenarios
throughout the application, providing structured error information for proper handling
and logging.
"""

from typing import Dict, Any, Optional
from fastapi import HTTPException


class AppException(Exception):
    """
    Base exception class for all application-specific errors.
    
    Provides a common interface for all custom exceptions with structured
    error information including error codes, messages, and contextual data.
    """
    
    def __init__(
        self, 
        message: str,
        error_code: str = "APP_ERROR",
        error_type: str = "APPLICATION_ERROR",
        context: Optional[Dict[str, Any]] = None,
        status_code: int = 500
    ):
        """
        Initialize base application exception.
        
        Args:
            message: Human-readable error message
            error_code: Unique error code for identification
            error_type: Category of error for classification
            context: Additional contextual information
            status_code: HTTP status code for API responses
        """
        self.message = message
        self.error_code = error_code
        self.error_type = error_type
        self.context = context or {}
        self.status_code = status_code
        super().__init__(self.message)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert exception to dictionary format for serialization."""
        return {
            "error": {
                "type": self.error_type,
                "code": self.error_code,
                "message": self.message,
                "context": self.context
            }
        }


class ValidationError(AppException):
    """
    Exception raised for input validation errors.
    
    Used when user input fails validation, such as unsupported aircraft models,
    invalid country codes, or malformed request data.
    """
    
    def __init__(
        self, 
        message: str,
        error_code: str = "VALIDATION_ERROR",
        field: Optional[str] = None,
        value: Any = None,
        context: Optional[Dict[str, Any]] = None
    ):
        """
        Initialize validation error.
        
        Args:
            message: Human-readable error message
            error_code: Specific validation error code
            field: Field name that failed validation
            value: Invalid value that was provided
            context: Additional validation context
        """
        validation_context = context or {}
        if field:
            validation_context["field"] = field
        if value is not None:
            validation_context["value"] = value
            
        super().__init__(
            message=message,
            error_code=error_code,
            error_type="VALIDATION_ERROR",
            context=validation_context,
            status_code=400
        )


class DatabaseError(AppException):
    """
    Exception raised for database-related errors.
    
    Used when database operations fail, including connection issues,
    query failures, or data integrity violations.
    """
    
    def __init__(
        self, 
        message: str,
        error_code: str = "DATABASE_ERROR",
        operation: Optional[str] = None,
        table: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ):
        """
        Initialize database error.
        
        Args:
            message: Human-readable error message
            error_code: Specific database error code
            operation: Database operation that failed (e.g., 'SELECT', 'INSERT')
            table: Database table involved in the operation
            context: Additional database context
        """
        db_context = context or {}
        if operation:
            db_context["operation"] = operation
        if table:
            db_context["table"] = table
            
        super().__init__(
            message=message,
            error_code=error_code,
            error_type="DATABASE_ERROR",
            context=db_context,
            status_code=500
        )


class CacheError(AppException):
    """
    Exception raised for cache-related errors.
    
    Used when Redis cache operations fail, including connection issues
    or serialization problems.
    """
    
    def __init__(
        self, 
        message: str,
        error_code: str = "CACHE_ERROR",
        operation: Optional[str] = None,
        key: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ):
        """
        Initialize cache error.
        
        Args:
            message: Human-readable error message
            error_code: Specific cache error code
            operation: Cache operation that failed (e.g., 'GET', 'SET')
            key: Cache key involved in the operation
            context: Additional cache context
        """
        cache_context = context or {}
        if operation:
            cache_context["operation"] = operation
        if key:
            cache_context["key"] = key
            
        super().__init__(
            message=message,
            error_code=error_code,
            error_type="CACHE_ERROR",
            context=cache_context,
            status_code=503
        )


class BusinessLogicError(AppException):
    """
    Exception raised for business logic errors.
    
    Used when business rules are violated or logical inconsistencies
    are detected in the application flow.
    """
    
    def __init__(
        self, 
        message: str,
        error_code: str = "BUSINESS_LOGIC_ERROR",
        rule: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ):
        """
        Initialize business logic error.
        
        Args:
            message: Human-readable error message
            error_code: Specific business logic error code
            rule: Business rule that was violated
            context: Additional business context
        """
        business_context = context or {}
        if rule:
            business_context["rule"] = rule
            
        super().__init__(
            message=message,
            error_code=error_code,
            error_type="BUSINESS_LOGIC_ERROR",
            context=business_context,
            status_code=422
        )


class AuthenticationError(AppException):
    """
    Exception raised for authentication errors.
    
    Used when authentication fails or is required but not provided.
    """
    
    def __init__(
        self, 
        message: str = "Authentication required",
        error_code: str = "AUTHENTICATION_ERROR",
        context: Optional[Dict[str, Any]] = None
    ):
        """
        Initialize authentication error.
        
        Args:
            message: Human-readable error message
            error_code: Specific authentication error code
            context: Additional authentication context
        """
        super().__init__(
            message=message,
            error_code=error_code,
            error_type="AUTHENTICATION_ERROR",
            context=context,
            status_code=401
        )


class AuthorizationError(AppException):
    """
    Exception raised for authorization errors.
    
    Used when a user is authenticated but lacks permission for an operation.
    """
    
    def __init__(
        self, 
        message: str = "Insufficient permissions",
        error_code: str = "AUTHORIZATION_ERROR",
        resource: Optional[str] = None,
        action: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ):
        """
        Initialize authorization error.
        
        Args:
            message: Human-readable error message
            error_code: Specific authorization error code
            resource: Resource being accessed
            action: Action being attempted
            context: Additional authorization context
        """
        auth_context = context or {}
        if resource:
            auth_context["resource"] = resource
        if action:
            auth_context["action"] = action
            
        super().__init__(
            message=message,
            error_code=error_code,
            error_type="AUTHORIZATION_ERROR",
            context=auth_context,
            status_code=403
        )


class ExternalServiceError(AppException):
    """
    Exception raised for external service errors.
    
    Used when calls to external APIs or services fail.
    """
    
    def __init__(
        self, 
        message: str,
        error_code: str = "EXTERNAL_SERVICE_ERROR",
        service: Optional[str] = None,
        endpoint: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ):
        """
        Initialize external service error.
        
        Args:
            message: Human-readable error message
            error_code: Specific external service error code
            service: Name of the external service
            endpoint: Endpoint that failed
            context: Additional service context
        """
        service_context = context or {}
        if service:
            service_context["service"] = service
        if endpoint:
            service_context["endpoint"] = endpoint
            
        super().__init__(
            message=message,
            error_code=error_code,
            error_type="EXTERNAL_SERVICE_ERROR",
            context=service_context,
            status_code=502
        )


class RateLimitError(AppException):
    """
    Exception raised when rate limits are exceeded.
    
    Used by rate limiting middleware when request limits are exceeded.
    """
    
    def __init__(
        self, 
        message: str = "Rate limit exceeded",
        error_code: str = "RATE_LIMIT_ERROR",
        limit: Optional[int] = None,
        window: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ):
        """
        Initialize rate limit error.
        
        Args:
            message: Human-readable error message
            error_code: Specific rate limit error code
            limit: Rate limit that was exceeded
            window: Time window for the limit
            context: Additional rate limiting context
        """
        rate_context = context or {}
        if limit:
            rate_context["limit"] = limit
        if window:
            rate_context["window"] = window
            
        super().__init__(
            message=message,
            error_code=error_code,
            error_type="RATE_LIMIT_ERROR",
            context=rate_context,
            status_code=429
        )


# Convenience factory functions for common errors

def create_validation_error(
    message: str,
    field: Optional[str] = None,
    value: Any = None,
    error_code: str = "VALIDATION_ERROR"
) -> ValidationError:
    """Create a validation error with common parameters."""
    return ValidationError(
        message=message,
        error_code=error_code,
        field=field,
        value=value
    )


def create_not_found_error(
    resource: str,
    identifier: Any,
    error_code: str = "RESOURCE_NOT_FOUND"
) -> ValidationError:
    """Create a not found error for missing resources."""
    return ValidationError(
        message=f"{resource} not found",
        error_code=error_code,
        context={"resource": resource, "identifier": str(identifier)}
    )


def create_database_connection_error(
    error_code: str = "DATABASE_CONNECTION_ERROR"
) -> DatabaseError:
    """Create a database connection error."""
    return DatabaseError(
        message="Unable to connect to the database",
        error_code=error_code,
        operation="CONNECT"
    )


def create_cache_connection_error(
    error_code: str = "CACHE_CONNECTION_ERROR"
) -> CacheError:
    """Create a cache connection error."""
    return CacheError(
        message="Unable to connect to cache service",
        error_code=error_code,
        operation="CONNECT"
    )