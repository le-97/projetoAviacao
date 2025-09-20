"""
Metrics API endpoints for performance monitoring.
"""

from typing import Dict, Optional
from fastapi import APIRouter, Query
from pydantic import BaseModel, Field
from src.middleware.performance import get_metrics, get_endpoint_metrics


class EndpointMetrics(BaseModel):
    """Model for individual endpoint metrics."""
    endpoint: str = Field(..., description="API endpoint path")
    method: str = Field(..., description="HTTP method")
    request_count: int = Field(..., description="Total number of requests")
    error_count: int = Field(..., description="Total number of errors (4xx/5xx)")
    error_rate: float = Field(..., description="Error rate (0.0 to 1.0)")
    avg_response_time: float = Field(..., description="Average response time in seconds")
    min_response_time: float = Field(..., description="Minimum response time in seconds")
    max_response_time: float = Field(..., description="Maximum response time in seconds")
    p95_response_time: float = Field(..., description="95th percentile response time")
    p99_response_time: float = Field(..., description="99th percentile response time")
    status_codes: Dict[int, int] = Field(..., description="Status code distribution")


class SystemMetrics(BaseModel):
    """Model for system-wide metrics."""
    uptime_seconds: float = Field(..., description="System uptime in seconds")
    uptime_human: str = Field(..., description="Human-readable uptime")
    total_requests: int = Field(..., description="Total requests processed")
    total_errors: int = Field(..., description="Total errors encountered")
    overall_error_rate: float = Field(..., description="Overall error rate")
    avg_response_time: float = Field(..., description="Overall average response time")
    requests_per_minute: float = Field(..., description="Requests per minute rate")
    last_request_time: Optional[str] = Field(..., description="Timestamp of last request")
    active_endpoints: int = Field(..., description="Number of active endpoints")


class MetricsResponse(BaseModel):
    """Complete metrics response."""
    system: SystemMetrics = Field(..., description="System-wide metrics")
    endpoints: list[EndpointMetrics] = Field(..., description="Per-endpoint metrics")


router = APIRouter(prefix="/metrics", tags=["monitoring"])


@router.get(
    "/",
    response_model=MetricsResponse,
    summary="Get Performance Metrics",
    description="""
    Returns comprehensive performance metrics for the API including:
    
    - **System Metrics**: Overall performance, uptime, request rates
    - **Endpoint Metrics**: Per-endpoint performance data with response times and error rates
    
    Useful for monitoring API health, identifying performance bottlenecks, and tracking usage patterns.
    """,
    responses={
        200: {
            "description": "Performance metrics retrieved successfully",
            "content": {
                "application/json": {
                    "example": {
                        "system": {
                            "uptime_seconds": 3600.5,
                            "uptime_human": "1:00:00.500000",
                            "total_requests": 150,
                            "total_errors": 5,
                            "overall_error_rate": 0.033,
                            "avg_response_time": 0.125,
                            "requests_per_minute": 2.5,
                            "last_request_time": "2025-09-18T10:30:00",
                            "active_endpoints": 3
                        },
                        "endpoints": [
                            {
                                "endpoint": "/check-compliance",
                                "method": "GET",
                                "request_count": 100,
                                "error_count": 3,
                                "error_rate": 0.03,
                                "avg_response_time": 0.150,
                                "min_response_time": 0.050,
                                "max_response_time": 0.300,
                                "p95_response_time": 0.250,
                                "p99_response_time": 0.290,
                                "status_codes": {"200": 97, "422": 3}
                            }
                        ]
                    }
                }
            }
        }
    }
)
async def get_performance_metrics() -> MetricsResponse:
    """Get comprehensive performance metrics for the API."""
    return get_metrics()


@router.get(
    "/endpoint",
    response_model=EndpointMetrics,
    summary="Get Endpoint-Specific Metrics",
    description="""
    Returns performance metrics for a specific API endpoint.
    
    Use this to drill down into the performance of individual endpoints
    and identify specific performance issues or usage patterns.
    """,
    responses={
        200: {
            "description": "Endpoint metrics retrieved successfully"
        }
    }
)
async def get_specific_endpoint_metrics(
    endpoint: str = Query(..., description="API endpoint path (e.g., '/check-compliance')", example="/check-compliance"),
    method: str = Query("GET", description="HTTP method", example="GET")
) -> EndpointMetrics:
    """Get metrics for a specific endpoint and method combination."""
    return get_endpoint_metrics(endpoint, method)


@router.get(
    "/health",
    summary="Performance Health Check",
    description="""
    Quick health check based on performance metrics.
    Returns simplified health status based on error rates and response times.
    """,
    responses={
        200: {"description": "Service is healthy"},
        503: {"description": "Service is degraded or unhealthy"}
    }
)
async def performance_health():
    """Quick performance-based health check."""
    metrics_data = get_metrics()
    system = metrics_data["system"]
    
    # Health thresholds
    MAX_ERROR_RATE = 0.05  # 5%
    MAX_AVG_RESPONSE_TIME = 1.0  # 1 second
    
    is_healthy = (
        system["overall_error_rate"] <= MAX_ERROR_RATE and
        system["avg_response_time"] <= MAX_AVG_RESPONSE_TIME
    )
    
    status = "healthy" if is_healthy else "degraded"
    
    health_data = {
        "status": status,
        "error_rate": system["overall_error_rate"],
        "avg_response_time": system["avg_response_time"],
        "total_requests": system["total_requests"],
        "uptime": system["uptime_human"],
        "thresholds": {
            "max_error_rate": MAX_ERROR_RATE,
            "max_avg_response_time": MAX_AVG_RESPONSE_TIME
        }
    }
    
    # Return 503 if unhealthy, 200 if healthy
    if not is_healthy:
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail=health_data)
    
    return health_data