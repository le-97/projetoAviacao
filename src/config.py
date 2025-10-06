"""Configuration settings for the application."""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # Database Configuration  
    database_url: str = "sqlite+aiosqlite:///./projetoAviacao.db"
    database_pool_size: int = 10
    database_max_overflow: int = 20
    database_pool_timeout: int = 30
    database_pool_recycle: int = 1800
    
    # Redis Configuration
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_db: int = 0
    redis_password: Optional[str] = None
    redis_ssl: bool = False
    redis_socket_timeout: float = 5.0
    redis_socket_connect_timeout: float = 5.0
    
    # Cache Configuration
    cache_ttl_seconds: int = 300  # 5 minutes default TTL
    cache_enabled: bool = False  # Disabled by default for development
    cache_key_prefix: str = "compliance:"
    
    # Application Configuration
    app_name: str = "Aviation Compliance API"
    app_version: str = "2.0.0"
    debug: bool = False
    cors_origins: list = [
        "*",  # Allow all origins for development
        "https://proud-sky-09399eb0f.2.azurestaticapps.net",  # Production frontend
        "https://proud-sky-09399eb0f-preview.eastus2.2.azurestaticapps.net",  # Preview frontend
        "http://localhost:5173",  # Local development
        "http://127.0.0.1:5173"   # Local development alternative
    ]
    
    # Monitoring Configuration
    prometheus_metrics_enabled: bool = True
    system_metrics_enabled: bool = True
    metrics_update_interval: int = 30  # seconds
    openmetrics_support: bool = True
    
    # Performance Configuration
    max_cache_size: int = 1000  # Maximum number of cached items
    cache_eviction_policy: str = "allkeys-lru"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"  # Ignore extra fields from .env


# Global settings instance with reload capability
def get_settings() -> Settings:
    """Get settings instance - allows for easy reloading."""
    return Settings()

settings = get_settings()