"""
Prometheus metrics endpoint for FastAPI application.
Exposes metrics in Prometheus format.
"""

from fastapi import APIRouter, Response
from src.middleware.prometheus_metrics import get_prometheus_metrics, get_prometheus_content_type

router = APIRouter(prefix="/prometheus", tags=["monitoring"])


@router.get(
    "/metrics",
    summary="Prometheus Metrics",
    description="""
    Expose application metrics in Prometheus format.
    
    This endpoint provides all collected metrics including:
    - HTTP request metrics (duration, count, errors)
    - System metrics (CPU, memory, disk usage)
    - Application metrics (compliance checks, database queries)
    - Cache operations metrics
    
    These metrics can be scraped by Prometheus for monitoring and alerting.
    """,
    responses={
        200: {
            "description": "Metrics in Prometheus format",
            "content": {
                "text/plain": {
                    "example": """# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",endpoint="/compliance/check/{model}/{country}",status_code="200"} 42.0

# HELP http_request_duration_seconds HTTP request duration in seconds  
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{method="GET",endpoint="/compliance/check/{model}/{country}",le="0.1"} 35.0
http_request_duration_seconds_bucket{method="GET",endpoint="/compliance/check/{model}/{country}",le="0.5"} 40.0
http_request_duration_seconds_bucket{method="GET",endpoint="/compliance/check/{model}/{country}",le="+Inf"} 42.0
http_request_duration_seconds_sum{method="GET",endpoint="/compliance/check/{model}/{country}"} 8.2
http_request_duration_seconds_count{method="GET",endpoint="/compliance/check/{model}/{country}"} 42.0

# HELP system_cpu_percent System CPU usage percentage
# TYPE system_cpu_percent gauge
system_cpu_percent 23.5

# HELP compliance_checks_total Total number of compliance checks performed
# TYPE compliance_checks_total counter
compliance_checks_total{aircraft_model="E190",country="USA",result="compliant"} 15.0"""
                }
            }
        }
    }
)
async def prometheus_metrics():
    """
    Return Prometheus metrics in the standard exposition format.
    
    This endpoint is designed to be scraped by Prometheus servers.
    The metrics are automatically collected by the PrometheusMetricsMiddleware
    and include comprehensive application and system monitoring data.
    """
    metrics_content = get_prometheus_metrics()
    content_type = get_prometheus_content_type()
    
    return Response(
        content=metrics_content,
        media_type=content_type
    )


# Alternative endpoint for backward compatibility
@router.get(
    "/",
    include_in_schema=False,  # Hide from OpenAPI docs
    response_class=Response
)
async def prometheus_metrics_root():
    """Alternative metrics endpoint for compatibility."""
    return await prometheus_metrics()