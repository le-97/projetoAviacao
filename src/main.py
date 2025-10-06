"""Main application file with database and cache management."""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api import compliance
from src.api import metrics
from src.api import cache
from src.api import analytics
from src.database import create_tables
from src.middleware import PerformanceMiddleware, create_rate_limit_middleware
from src.logger import RequestLoggingMiddleware, setup_logging
from src.services.cache_service import cache_service
from src.config import settings
from src.error_handlers import register_exception_handlers

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle with database, Redis connection, and monitoring."""
    # Startup: Initialize database and connect to Redis
    setup_logging()  # Initialize logging first
    
    await create_tables()  # Create database tables
    
    if settings.cache_enabled:
        await cache_service.connect()
    
    # Log startup completion
    from src.logger import get_logger
    logger = get_logger(__name__)
    logger.info(f"🚀 {settings.app_name} v{settings.app_version} started successfully")
    
    yield  # Application runs here
    
    # Shutdown: Clean shutdown of all services
    logger.info("🛑 Shutting down application...")
    
    # Shutdown Prometheus monitoring
    from src.middleware.prometheus_metrics import PrometheusMetricsMiddleware
    middleware_instance = getattr(PrometheusMetricsMiddleware, '_instance', None)
    if middleware_instance:
        middleware_instance.shutdown()
    
    # Disconnect from Redis
    if cache_service.is_connected:
        await cache_service.disconnect()
    
    logger.info("✅ Application shutdown complete")

# API metadata for documentation
app = FastAPI(
    title=settings.app_name,
    description=f"""
    🛩️ **Enhanced {settings.app_name}**
    
    This microservice validates the regulatory compliance of aircraft models 
    against international aviation regulations (ANAC, FAA, EASA).
    
    ## Supported Aircraft Models
    - **E175 Series** - E175-E1, E175-E2 regional jets
    - **E190 Series** - E190-E1, E190-E2 regional jets
    - **E195 Series** - E195-E1, E195-E2 regional jets
    - **Boeing 737** - Boeing 737-800 and variants
    - **Airbus A320** - A320neo and variants
    
    ## Supported Countries/Regions
    - **BRAZIL** - ANAC (Agência Nacional de Aviação Civil) regulations
    - **USA** - FAA (Federal Aviation Administration) regulations  
    - **EUROPE** - EASA (European Union Aviation Safety Agency) regulations
    
    ## Features
    - ✅ Database-backed aircraft model validation
    - ✅ Authority-specific regulation retrieval
    - ✅ Enhanced E175 and E-Jets E2 support
    - ✅ Model-specific compliance validation
    - ✅ Comprehensive reporting and recommendations
    - ✅ Real-time compliance checking with optional Redis caching
    - ✅ Performance monitoring and metrics
    - ✅ Health checks and system status
    - ✅ Structured JSON logging with request correlation
    - ✅ Rate limiting protection with configurable limits
    """,
    version=settings.app_version,
    contact={
        "name": "Projeto Aviacao Team",
        "url": "https://github.com/le-97/projetoAviacao",
    },
    license_info={
        "name": "MIT",
    },
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc",  # ReDoc alternative documentation
    lifespan=lifespan  # Manage database and Redis connections
)

# Initialize structured logging (moved to lifespan for better control)

# Register global exception handlers
register_exception_handlers(app)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add middleware (order matters! LIFO - Last In, First Out)
from src.middleware.prometheus_metrics import PrometheusMetricsMiddleware

# Configure Prometheus middleware with settings
if settings.prometheus_metrics_enabled:
    app.add_middleware(PrometheusMetricsMiddleware)   # First to add = Last to execute (outermost)

app.add_middleware(PerformanceMiddleware)             # Performance monitoring
app.add_middleware(RequestLoggingMiddleware)          # Request correlation
app.add_middleware(create_rate_limit_middleware())    # Last to add = First to execute (innermost)

@app.get("/", tags=["Health"])
def read_root():
    """Health check endpoint."""
    return {
        "service": "Enhanced Aviation Compliance Microservice",
        "status": "healthy",
        "version": settings.app_version,
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """Detailed health check with service, cache, and monitoring information."""
    # Get cache statistics
    cache_stats = await cache_service.get_cache_stats()
    
    # Check monitoring status
    monitoring_status = {}
    if settings.prometheus_metrics_enabled:
        from src.middleware.prometheus_metrics import PrometheusMetricsMiddleware
        middleware_instance = getattr(PrometheusMetricsMiddleware, '_instance', None)
        monitoring_status = {
            "prometheus_metrics": "enabled",
            "system_monitoring": "enabled" if settings.system_metrics_enabled else "disabled",
            "openmetrics_support": "enabled" if settings.openmetrics_support else "disabled",
            "monitoring_thread": "active" if middleware_instance and hasattr(middleware_instance, '_system_monitor_task') and middleware_instance._system_monitor_task and middleware_instance._system_monitor_task.is_alive() else "inactive"
        }
    else:
        monitoring_status = {"prometheus_metrics": "disabled"}
    
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
        "supported_models": ["E175", "E175-E1", "E175-E2", "E190", "E190-E1", "E190-E2", "E195", "E195-E1", "E195-E2", "737", "A320"],
        "supported_countries": ["BRAZIL", "USA", "EUROPE"],
        "database": "sqlite",
        "cache": cache_stats,
        "monitoring": monitoring_status,
        "rate_limits": {
            "compliance_endpoint": "30 requests/minute",
            "metrics_endpoint": "120 requests/minute", 
            "health_endpoint": "300 requests/minute",
            "default": "60 requests/minute"
        },
        "endpoints": {
            "compliance_check": "/compliance/check/{model}/{country}",
            "compliance_legacy": "/compliance/check-compliance",
            "models": "/compliance/models",
            "regulations": "/compliance/regulations/{model}/{country}",
            "authorities": "/compliance/authorities",
            "aircraft": "/compliance/aircraft",
            "compliance_health": "/compliance/health",
            "analytics_fleet_metrics": "/analytics/fleet-metrics",
            "analytics_compliance_trends": "/analytics/compliance-trends",
            "analytics_alerts": "/analytics/alerts",
            "analytics_performance_metrics": "/analytics/performance-metrics",
            "analytics_requirements_summary": "/analytics/requirements-summary",
            "metrics": "/metrics",
            "performance_health": "/metrics/health",
            "documentation": "/docs",
            "alternative_docs": "/redoc"
        }
    }

app.include_router(compliance.router, tags=["Compliance"])
app.include_router(metrics.router, tags=["Monitoring"])
app.include_router(cache.router, tags=["Cache Management"])
app.include_router(analytics.router, tags=["Analytics"])

# Import and include Prometheus router
from src.api import prometheus
app.include_router(prometheus.router, tags=["Monitoring"])

# Add main /metrics endpoint (Prometheus standard)
from src.middleware.prometheus_metrics import get_prometheus_metrics, get_prometheus_content_type
from fastapi import Response, Request

@app.get("/metrics", tags=["Monitoring"], include_in_schema=False)
async def metrics_endpoint(request: Request):
    """
    Prometheus metrics endpoint (standard location).
    Supports both Prometheus and OpenMetrics formats.
    """
    # Check Accept header for OpenMetrics support
    accept_header = request.headers.get("accept", "")
    openmetrics_format = "application/openmetrics-text" in accept_header
    
    return Response(
        content=get_prometheus_metrics(openmetrics_format=openmetrics_format),
        media_type=get_prometheus_content_type(openmetrics_format=openmetrics_format)
    )
