"""
Global exception handlers for the Aviation Compliance FastAPI application.

This module defines global exception handlers that provide consistent error responses
across all API endpoints, structured logging, and proper HTTP status codes.
"""

import logging
import traceback
from typing import Dict, Any
from fastapi import Request, HTTPException
from fastapi.exception_handlers import http_exception_handler
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.responses import JSONResponse

from src.exceptions import (
    AppException,
    ValidationError,
    DatabaseError,
    CacheError,
    BusinessLogicError,
    AuthenticationError,
    AuthorizationError,
    ExternalServiceError,
    RateLimitError
)
from src.models.compliance import ErrorResponse
from src.logger import log_security_event

# Configure module logger
logger = logging.getLogger(__name__)


def get_request_id(request: Request) -> str:
    """Extract request ID from request headers or generate one."""
    return request.headers.get("x-request-id", "unknown")


def create_error_response(
    error_type: str,
    error_code: str,
    message: str,
    context: Dict[str, Any] = None,
    request_id: str = None
) -> JSONResponse:
    """
    Create a standardized error response.
    
    Args:
        error_type: Category of error
        error_code: Specific error identifier
        message: Human-readable error message
        context: Additional error context
        request_id: Request correlation ID
        
    Returns:
        JSONResponse with standardized error format
    """
    error_context = context or {}
    if request_id:
        error_context["request_id"] = request_id
    
    error_data = {
        "error": {
            "type": error_type,
            "code": error_code,
            "message": message,
            "context": error_context
        }
    }
    
    return JSONResponse(content=error_data)


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """
    Handle custom application exceptions.
    
    Args:
        request: FastAPI request object
        exc: Custom application exception
        
    Returns:
        JSONResponse with structured error information
    """
    request_id = get_request_id(request)
    
    # Log the exception with context
    log_security_event(
        event_type="exception_handled",
        level="ERROR" if exc.status_code >= 500 else "WARNING",
        details={
            "exception_type": exc.error_type,
            "exception_code": exc.error_code,
            "message": exc.message,
            "request_path": request.url.path,
            "request_method": request.method,
            "request_id": request_id,
            "context": exc.context
        }
    )
    
    # Add request ID to context
    exc.context["request_id"] = request_id
    
    response = JSONResponse(
        status_code=exc.status_code,
        content=exc.to_dict()
    )
    
    return response


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """
    Handle FastAPI request validation errors.
    
    Args:
        request: FastAPI request object
        exc: Request validation error
        
    Returns:
        JSONResponse with detailed validation error information
    """
    request_id = get_request_id(request)
    
    # Extract validation errors
    validation_errors = []
    for error in exc.errors():
        field_path = " -> ".join(str(loc) for loc in error["loc"])
        validation_errors.append({
            "field": field_path,
            "message": error["msg"],
            "type": error["type"],
            "input": error.get("input")
        })
    
    # Log validation error
    log_security_event(
        event_type="validation_error",
        level="WARNING",
        details={
            "request_path": request.url.path,
            "request_method": request.method,
            "request_id": request_id,
            "validation_errors": validation_errors
        }
    )
    
    error_response = create_error_response(
        error_type="VALIDATION_ERROR",
        error_code="REQUEST_VALIDATION_FAILED",
        message="Request validation failed",
        context={
            "validation_errors": validation_errors,
            "total_errors": len(validation_errors)
        },
        request_id=request_id
    )
    
    error_response.status_code = 422
    return error_response


async def http_exception_handler_custom(request: Request, exc: HTTPException) -> JSONResponse:
    """
    Handle FastAPI HTTP exceptions.
    
    Args:
        request: FastAPI request object
        exc: HTTP exception
        
    Returns:
        JSONResponse with structured error information
    """
    request_id = get_request_id(request)
    
    # Log HTTP exception
    log_security_event(
        event_type="http_exception",
        level="ERROR" if exc.status_code >= 500 else "WARNING",
        details={
            "status_code": exc.status_code,
            "detail": exc.detail,
            "request_path": request.url.path,
            "request_method": request.method,
            "request_id": request_id
        }
    )
    
    # Determine error type based on status code
    error_type_mapping = {
        400: "BAD_REQUEST",
        401: "AUTHENTICATION_ERROR", 
        403: "AUTHORIZATION_ERROR",
        404: "RESOURCE_NOT_FOUND",
        422: "VALIDATION_ERROR",
        429: "RATE_LIMIT_ERROR",
        500: "INTERNAL_SERVER_ERROR",
        502: "EXTERNAL_SERVICE_ERROR",
        503: "SERVICE_UNAVAILABLE"
    }
    
    error_type = error_type_mapping.get(exc.status_code, "HTTP_ERROR")
    
    error_response = create_error_response(
        error_type=error_type,
        error_code=f"HTTP_{exc.status_code}",
        message=str(exc.detail),
        context={"status_code": exc.status_code},
        request_id=request_id
    )
    
    error_response.status_code = exc.status_code
    return error_response


async def starlette_http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """
    Handle Starlette HTTP exceptions.
    
    Args:
        request: FastAPI request object
        exc: Starlette HTTP exception
        
    Returns:
        JSONResponse with structured error information
    """
    request_id = get_request_id(request)
    
    # Log Starlette exception
    log_security_event(
        event_type="starlette_exception",
        level="ERROR" if exc.status_code >= 500 else "WARNING",
        details={
            "status_code": exc.status_code,
            "detail": exc.detail,
            "request_path": request.url.path,
            "request_method": request.method,
            "request_id": request_id
        }
    )
    
    error_response = create_error_response(
        error_type="HTTP_ERROR",
        error_code=f"STARLETTE_{exc.status_code}",
        message=str(exc.detail),
        context={"status_code": exc.status_code},
        request_id=request_id
    )
    
    error_response.status_code = exc.status_code
    return error_response


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Handle unexpected exceptions.
    
    Args:
        request: FastAPI request object
        exc: Unexpected exception
        
    Returns:
        JSONResponse with generic error information
    """
    request_id = get_request_id(request)
    
    # Log unexpected exception with full traceback
    log_security_event(
        event_type="unexpected_exception",
        level="ERROR",
        details={
            "exception_type": type(exc).__name__,
            "exception_message": str(exc),
            "request_path": request.url.path,
            "request_method": request.method,
            "request_id": request_id,
            "traceback": traceback.format_exc()
        }
    )
    
    # In production, don't expose internal error details
    error_response = create_error_response(
        error_type="INTERNAL_SERVER_ERROR",
        error_code="UNEXPECTED_ERROR",
        message="An unexpected error occurred. Please try again later.",
        context={"exception_type": type(exc).__name__},
        request_id=request_id
    )
    
    error_response.status_code = 500
    return error_response


def register_exception_handlers(app):
    """
    Register all exception handlers with the FastAPI application.
    
    Args:
        app: FastAPI application instance
    """
    
    # Custom application exceptions
    app.add_exception_handler(AppException, app_exception_handler)
    app.add_exception_handler(ValidationError, app_exception_handler)
    app.add_exception_handler(DatabaseError, app_exception_handler)
    app.add_exception_handler(CacheError, app_exception_handler)
    app.add_exception_handler(BusinessLogicError, app_exception_handler)
    app.add_exception_handler(AuthenticationError, app_exception_handler)
    app.add_exception_handler(AuthorizationError, app_exception_handler)
    app.add_exception_handler(ExternalServiceError, app_exception_handler)
    app.add_exception_handler(RateLimitError, app_exception_handler)
    
    # FastAPI built-in exceptions
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(HTTPException, http_exception_handler_custom)
    app.add_exception_handler(StarletteHTTPException, starlette_http_exception_handler)
    
    # Catch-all for unexpected exceptions
    app.add_exception_handler(Exception, general_exception_handler)
    
    logger.info("Exception handlers registered successfully")


# Convenience functions for common error scenarios

def raise_validation_error(message: str, field: str = None, value: Any = None):
    """Raise a validation error with common parameters."""
    raise ValidationError(
        message=message,
        field=field,
        value=value
    )


def raise_not_found_error(resource: str, identifier: Any):
    """Raise a not found error for missing resources."""
    raise ValidationError(
        message=f"{resource} not found",
        error_code="RESOURCE_NOT_FOUND",
        context={"resource": resource, "identifier": str(identifier)}
    )


def raise_database_error(message: str, operation: str = None, table: str = None):
    """Raise a database error with common parameters."""
    raise DatabaseError(
        message=message,
        operation=operation,
        table=table
    )


def raise_cache_error(message: str, operation: str = None, key: str = None):
    """Raise a cache error with common parameters."""
    raise CacheError(
        message=message,
        operation=operation,
        key=key
    )