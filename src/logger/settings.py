"""
Logging configuration settings.
"""

import os
from typing import Optional
from pydantic import BaseModel


class LoggingConfig(BaseModel):
    """Configuration for structured logging."""
    
    level: str = "INFO"
    service_name: str = "compliance-microservice"
    version: str = "1.0.0"
    enable_console: bool = True
    log_file: Optional[str] = None
    enable_request_logging: bool = True
    enable_performance_logging: bool = True
    
    class Config:
        env_prefix = "LOG_"


def get_logging_config() -> LoggingConfig:
    """Get logging configuration from environment variables or defaults."""
    return LoggingConfig(
        level=os.getenv("LOG_LEVEL", "INFO"),
        service_name=os.getenv("LOG_SERVICE_NAME", "compliance-microservice"),
        version=os.getenv("LOG_VERSION", "1.0.0"),
        enable_console=os.getenv("LOG_ENABLE_CONSOLE", "true").lower() == "true",
        log_file=os.getenv("LOG_FILE"),
        enable_request_logging=os.getenv("LOG_ENABLE_REQUEST", "true").lower() == "true",
        enable_performance_logging=os.getenv("LOG_ENABLE_PERFORMANCE", "true").lower() == "true"
    )