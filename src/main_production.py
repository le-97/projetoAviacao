"""
Production-ready FastAPI application with integrated security and monitoring.
"""
import time
import json
from datetime import datetime
from typing import Dict, List, Optional, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
import uvicorn

# Import our components
from api.compliance import router as compliance_router
from security.security_manager import (
    SecurityManager, AuthenticationManager, RateLimiter,
    InputValidator, AuditLogger
)
from monitoring.monitoring_system import (
    metrics_collector, system_monitor, app_monitor, 
    alert_manager, health_checker
)

# Security and monitoring instances
security_manager = SecurityManager()
auth_manager = AuthenticationManager()
rate_limiter = RateLimiter()
input_validator = InputValidator()
audit_logger = AuditLogger()
security = HTTPBearer(auto_error=False)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup
    print("🚀 Starting Aviation Compliance API...")
    
    # Start system monitoring
    system_monitor.start_monitoring(interval=30)
    
    # Register health checks
    health_checker.register_check("database", check_database_health)
    health_checker.register_check("memory", check_memory_health)
    health_checker.register_check("disk", check_disk_health)
    
    # Start alert monitoring
    import threading
    def alert_loop():
        while True:
            try:
                alert_manager.check_alerts()
                time.sleep(60)  # Check every minute
            except Exception as e:
                print(f"Alert check error: {e}")
                time.sleep(60)
    
    alert_thread = threading.Thread(target=alert_loop, daemon=True)
    alert_thread.start()
    
    print("✅ Aviation Compliance API started successfully")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down Aviation Compliance API...")
    system_monitor.stop_monitoring()
    print("✅ Aviation Compliance API shutdown complete")

# Create FastAPI app
app = FastAPI(
    title="Aviation Compliance API",
    description="Production-ready aviation compliance checking microservice with security and monitoring",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure properly for production
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def security_middleware(request: Request, call_next):
    """Security and monitoring middleware."""
    start_time = time.time()
    
    # Get client IP
    client_ip = request.client.host
    
    try:
        # Security checks
        if not security_manager.check_ip_whitelist(client_ip):
            audit_logger.log_security_event(
                "ip_blocked",
                {"ip": client_ip, "reason": "not_whitelisted"}
            )
            raise HTTPException(status_code=403, detail="Access denied")
        
        if security_manager.is_ip_blacklisted(client_ip):
            audit_logger.log_security_event(
                "ip_blocked", 
                {"ip": client_ip, "reason": "blacklisted"}
            )
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Rate limiting
        if not rate_limiter.check_rate_limit(client_ip):
            audit_logger.log_security_event(
                "rate_limit_exceeded",
                {"ip": client_ip}
            )
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        
        # Process request
        response = await call_next(request)
        
        # Record metrics
        duration = time.time() - start_time
        app_monitor.record_request(
            method=request.method,
            endpoint=str(request.url.path),
            status_code=response.status_code,
            duration=duration
        )
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY" 
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Log unexpected errors
        audit_logger.log_security_event(
            "unexpected_error",
            {"ip": client_ip, "error": str(e)}
        )
        
        # Record error metrics
        duration = time.time() - start_time
        app_monitor.record_request(
            method=request.method,
            endpoint=str(request.url.path), 
            status_code=500,
            duration=duration
        )
        
        raise HTTPException(status_code=500, detail="Internal server error")

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Authenticate user based on JWT token or API key."""
    if not credentials:
        return None
    
    # Try JWT first
    user = auth_manager.verify_jwt_token(credentials.credentials)
    if user:
        return user
    
    # Try API key
    if auth_manager.verify_api_key(credentials.credentials):
        return {"user_id": "api_user", "type": "api_key"}
    
    return None

# Health check endpoints
@app.get("/health", tags=["Health"])
async def health_check():
    """Basic health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/health/detailed", tags=["Health"])
async def detailed_health_check():
    """Detailed health check with all components."""
    return health_checker.run_checks()

@app.get("/health/ready", tags=["Health"])
async def readiness_check():
    """Kubernetes readiness probe endpoint."""
    checks = health_checker.run_checks()
    if checks["status"] == "healthy":
        return {"status": "ready"}
    else:
        raise HTTPException(status_code=503, detail="Service not ready")

@app.get("/health/live", tags=["Health"])
async def liveness_check():
    """Kubernetes liveness probe endpoint."""
    return {"status": "alive", "uptime": app_monitor.get_uptime()}

# Metrics endpoints
@app.get("/metrics", tags=["Monitoring"])
async def get_metrics(user=Depends(get_current_user)):
    """Get application metrics (requires authentication)."""
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    # Get basic metrics
    metrics = {
        "http_requests": metrics_collector.get_metric_stats("http_requests_total"),
        "http_errors": metrics_collector.get_metric_stats("http_errors_total"),
        "request_duration": metrics_collector.get_metric_stats("http_request_duration_seconds"),
        "database_queries": metrics_collector.get_metric_stats("database_queries_total"),
        "compliance_checks": metrics_collector.get_metric_stats("compliance_checks_total"),
        "system_cpu": metrics_collector.get_metric_stats("system_cpu_percent"),
        "system_memory": metrics_collector.get_metric_stats("system_memory_percent"),
        "uptime_seconds": app_monitor.get_uptime()
    }
    
    return metrics

@app.get("/metrics/alerts", tags=["Monitoring"])
async def get_alerts(user=Depends(get_current_user)):
    """Get active alerts and alert history."""
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    return {
        "active_alerts": list(alert_manager.active_alerts.keys()),
        "alert_history": alert_manager.alert_history[-50:]  # Last 50 alerts
    }

# Authentication endpoints
@app.post("/auth/login", tags=["Authentication"])
async def login(username: str, password: str):
    """Login and get JWT token."""
    if auth_manager.verify_password(username, password):
        token = auth_manager.create_jwt_token(username)
        audit_logger.log_authentication_event("login_success", {"username": username})
        return {"access_token": token, "token_type": "bearer"}
    else:
        audit_logger.log_authentication_event("login_failed", {"username": username})
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/auth/api-key", tags=["Authentication"])
async def create_api_key(name: str, user=Depends(get_current_user)):
    """Create a new API key (requires authentication)."""
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    api_key = auth_manager.create_api_key(name)
    audit_logger.log_authentication_event("api_key_created", {"name": name, "user": user})
    return {"api_key": api_key, "name": name}

# Security management endpoints
@app.post("/security/blacklist", tags=["Security"])
async def blacklist_ip(ip: str, user=Depends(get_current_user)):
    """Add IP to blacklist (requires authentication)."""
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    security_manager.blacklist_ip(ip)
    audit_logger.log_security_event("ip_blacklisted", {"ip": ip, "by_user": user})
    return {"message": f"IP {ip} blacklisted"}

@app.delete("/security/blacklist/{ip}", tags=["Security"])
async def remove_from_blacklist(ip: str, user=Depends(get_current_user)):
    """Remove IP from blacklist (requires authentication)."""
    if not user:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    security_manager.remove_from_blacklist(ip)
    audit_logger.log_security_event("ip_removed_from_blacklist", {"ip": ip, "by_user": user})
    return {"message": f"IP {ip} removed from blacklist"}

# Include compliance router
app.include_router(compliance_router, prefix="/api/v1")

# Health check functions
def check_database_health() -> Dict[str, Any]:
    """Check database connectivity."""
    try:
        # Simple database check - would connect to actual database
        import sqlite3
        conn = sqlite3.connect("data/aviation_compliance.db")
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        conn.close()
        
        return {
            "healthy": result is not None,
            "message": "Database connection successful"
        }
    except Exception as e:
        return {
            "healthy": False,
            "message": f"Database connection failed: {str(e)}"
        }

def check_memory_health() -> Dict[str, Any]:
    """Check memory usage."""
    try:
        import psutil
        memory = psutil.virtual_memory()
        
        return {
            "healthy": memory.percent < 90,
            "usage_percent": memory.percent,
            "message": f"Memory usage: {memory.percent}%"
        }
    except Exception as e:
        return {
            "healthy": False,
            "message": f"Memory check failed: {str(e)}"
        }

def check_disk_health() -> Dict[str, Any]:
    """Check disk usage."""
    try:
        import psutil
        disk = psutil.disk_usage('/')
        usage_percent = (disk.used / disk.total) * 100
        
        return {
            "healthy": usage_percent < 85,
            "usage_percent": round(usage_percent, 2),
            "message": f"Disk usage: {usage_percent:.1f}%"
        }
    except Exception as e:
        return {
            "healthy": False,
            "message": f"Disk check failed: {str(e)}"
        }

if __name__ == "__main__":
    # Production configuration
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,  # Disable reload in production
        workers=1,
        log_level="info",
        access_log=True
    )