"""Main application file with database and cache management."""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api import compliance
from src.api import metrics
from src.api import cache
from src.database import create_tables
from src.middleware import PerformanceMiddleware, create_rate_limit_middleware
from src.logger import RequestLoggingMiddleware, setup_logging
from src.services.cache_service import cache_service
from src.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle with database and Redis connection."""
    # Startup: Initialize database and connect to Redis
    await create_tables()  # Create database tables
    
    if settings.cache_enabled:
        await cache_service.connect()
    
    yield  # Application runs here
    
    # Shutdown: Disconnect from Redis
    if cache_service.is_connected:
        await cache_service.disconnect()

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

# Initialize structured logging
setup_logging()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add middleware (order matters!)
app.add_middleware(create_rate_limit_middleware())  # First for rate limiting
app.add_middleware(RequestLoggingMiddleware)        # Then request correlation  
app.add_middleware(PerformanceMiddleware)           # Finally performance monitoring

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
    """Detailed health check with service and cache information."""
    # Get cache statistics
    cache_stats = await cache_service.get_cache_stats()
    
    return {
        "status": "healthy",
        "service": "enhanced-compliance-microservice",
        "version": settings.app_version,
        "supported_models": ["E175", "E175-E1", "E175-E2", "E190", "E190-E1", "E190-E2", "E195", "E195-E1", "E195-E2", "737", "A320"],
        "supported_countries": ["BRAZIL", "USA", "EUROPE"],
        "database": "sqlite",
        "cache": cache_stats,
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
            "metrics": "/metrics",
            "performance_health": "/metrics/health",
            "documentation": "/docs",
            "alternative_docs": "/redoc"
        }
    }

app.include_router(compliance.router, tags=["Compliance"])
app.include_router(metrics.router, tags=["Monitoring"])
app.include_router(cache.router, tags=["Cache Management"])
