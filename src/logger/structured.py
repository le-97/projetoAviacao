"""
Structured logging configuration for the application.
Provides JSON-formatted logs with request context and performance metrics.
"""

import json
import logging
import sys
import time
from typing import Dict, Any, Optional
from datetime import datetime
from contextvars import ContextVar
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

# Context variables for request tracking
request_id_var: ContextVar[str] = ContextVar('request_id', default='')
user_id_var: ContextVar[str] = ContextVar('user_id', default='')
correlation_id_var: ContextVar[str] = ContextVar('correlation_id', default='')


class StructuredFormatter(logging.Formatter):
    """Custom formatter that outputs structured JSON logs."""
    
    def __init__(self, service_name: str = "compliance-microservice", version: str = "2.0.0"):
        super().__init__()
        self.service_name = service_name
        self.version = version
    
    def format(self, record: logging.LogRecord) -> str:
        """Format log record as structured JSON."""
        
        # Base log structure
        log_entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "service": {
                "name": self.service_name,
                "version": self.version
            }
        }
        
        # Add request context if available
        request_id = request_id_var.get()
        if request_id:
            log_entry["request_id"] = request_id
        
        user_id = user_id_var.get()
        if user_id:
            log_entry["user_id"] = user_id
        
        correlation_id = correlation_id_var.get()
        if correlation_id:
            log_entry["correlation_id"] = correlation_id
        
        # Add extra fields from record
        extra_fields = {}
        for key, value in record.__dict__.items():
            if key not in ('name', 'msg', 'args', 'levelname', 'levelno', 'pathname', 
                          'filename', 'module', 'exc_info', 'exc_text', 'stack_info',
                          'lineno', 'funcName', 'created', 'msecs', 'relativeCreated',
                          'thread', 'threadName', 'processName', 'process', 'message'):
                extra_fields[key] = value
        
        if extra_fields:
            log_entry["extra"] = extra_fields
        
        # Add exception info if present
        if record.exc_info:
            log_entry["exception"] = {
                "type": record.exc_info[0].__name__ if record.exc_info[0] else None,
                "message": str(record.exc_info[1]) if record.exc_info[1] else None,
                "traceback": self.formatException(record.exc_info) if record.exc_info else None
            }
        
        # Add source location
        log_entry["source"] = {
            "file": record.pathname,
            "line": record.lineno,
            "function": record.funcName
        }
        
        return json.dumps(log_entry, default=str, ensure_ascii=False)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for structured request/response logging."""
    
    def __init__(self, app, logger: Optional[logging.Logger] = None):
        super().__init__(app)
        self.logger = logger or logging.getLogger("request")
    
    async def dispatch(self, request: Request, call_next):
        """Log request and response with structured context."""
        import uuid
        
        # Generate request ID
        request_id = str(uuid.uuid4())
        request_id_var.set(request_id)
        
        # Extract correlation ID from headers if present
        correlation_id = request.headers.get("X-Correlation-ID", request_id)
        correlation_id_var.set(correlation_id)
        
        # Start timing
        start_time = time.time()
        
        # Log incoming request
        self.logger.info(
            "Incoming request",
            extra={
                "request": {
                    "method": request.method,
                    "path": request.url.path,
                    "query_params": dict(request.query_params),
                    "headers": dict(request.headers),
                    "client_ip": request.client.host if request.client else None,
                    "user_agent": request.headers.get("user-agent")
                },
                "request_id": request_id,
                "correlation_id": correlation_id
            }
        )
        
        # Process request
        try:
            response = await call_next(request)
            
            # Calculate response time
            response_time = time.time() - start_time
            
            # Log successful response
            self.logger.info(
                "Request completed",
                extra={
                    "response": {
                        "status_code": response.status_code,
                        "headers": dict(response.headers),
                        "response_time_ms": round(response_time * 1000, 3)
                    },
                    "request_id": request_id,
                    "correlation_id": correlation_id
                }
            )
            
            # Add request ID to response headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Correlation-ID"] = correlation_id
            
            return response
            
        except Exception as exc:
            # Calculate response time for errors
            response_time = time.time() - start_time
            
            # Log error
            self.logger.error(
                "Request failed",
                extra={
                    "error": {
                        "type": type(exc).__name__,
                        "message": str(exc),
                        "response_time_ms": round(response_time * 1000, 3)
                    },
                    "request_id": request_id,
                    "correlation_id": correlation_id
                },
                exc_info=True
            )
            
            raise


def setup_logging(
    level: str = "INFO",
    service_name: str = "compliance-microservice",
    version: str = "1.0.0",
    enable_console: bool = True,
    log_file: Optional[str] = None
) -> logging.Logger:
    """
    Setup structured logging configuration.
    
    Args:
        level: Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        service_name: Name of the service for log context
        version: Version of the service
        enable_console: Whether to log to console
        log_file: Optional file path for logging
    
    Returns:
        Configured root logger
    """
    
    # Get root logger
    logger = logging.getLogger()
    
    # Set level
    logger.setLevel(getattr(logging, level.upper()))
    
    # Clear existing handlers
    logger.handlers.clear()
    
    # Create formatter
    formatter = StructuredFormatter(service_name=service_name, version=version)
    
    # Console handler
    if enable_console:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
    
    # File handler
    if log_file:
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    # Configure uvicorn loggers to use our formatter
    logging.getLogger("uvicorn").handlers.clear()
    logging.getLogger("uvicorn.access").handlers.clear()
    
    # Create specific loggers for different components
    loggers = {
        "request": logging.getLogger("request"),
        "business": logging.getLogger("business"),
        "performance": logging.getLogger("performance"),
        "security": logging.getLogger("security"),
        "integration": logging.getLogger("integration")
    }
    
    return logger


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance for a specific component."""
    return logging.getLogger(name)


def log_business_event(
    event: str,
    details: Dict[str, Any],
    level: str = "INFO",
    user_id: Optional[str] = None
):
    """
    Log a business event with structured data.
    
    Args:
        event: Event name/type
        details: Event details
        level: Log level
        user_id: Optional user ID
    """
    logger = get_logger("business")
    
    if user_id:
        user_id_var.set(user_id)
    
    log_method = getattr(logger, level.lower())
    log_method(
        f"Business event: {event}",
        extra={
            "event": event,
            "details": details,
            "event_type": "business"
        }
    )


def log_performance_metric(
    metric_name: str,
    value: float,
    unit: str = "ms",
    context: Optional[Dict[str, Any]] = None
):
    """
    Log a performance metric.
    
    Args:
        metric_name: Name of the metric
        value: Metric value
        unit: Unit of measurement
        context: Additional context
    """
    logger = get_logger("performance")
    
    logger.info(
        f"Performance metric: {metric_name}",
        extra={
            "metric": {
                "name": metric_name,
                "value": value,
                "unit": unit
            },
            "context": context or {},
            "event_type": "performance"
        }
    )


def log_security_event(
    event: str,
    severity: str = "INFO",
    details: Optional[Dict[str, Any]] = None,
    user_id: Optional[str] = None
):
    """
    Log a security-related event.
    
    Args:
        event: Security event description
        severity: Event severity (INFO, WARNING, ERROR, CRITICAL)
        details: Event details
        user_id: Optional user ID
    """
    logger = get_logger("security")
    
    if user_id:
        user_id_var.set(user_id)
    
    log_method = getattr(logger, severity.lower())
    log_method(
        f"Security event: {event}",
        extra={
            "event": event,
            "details": details or {},
            "event_type": "security",
            "severity": severity
        }
    )