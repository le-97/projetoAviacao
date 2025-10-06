"""
Prometheus metrics middleware for FastAPI application.
Automatically collects HTTP metrics in Prometheus format with OpenTelemetry integration.
"""

import time
import re
from typing import Dict, Optional
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
from prometheus_client.openmetrics.exposition import CONTENT_TYPE_LATEST as OPENMETRICS_CONTENT_TYPE_LATEST, generate_latest as openmetrics_generate_latest
import psutil
import threading
import logging
import asyncio

# Configure logging
logger = logging.getLogger(__name__)


# Prometheus metrics definitions
http_requests_total = Counter(
    'http_requests_total',
    'Total number of HTTP requests',
    ['method', 'endpoint', 'status_code']
)

http_request_duration_seconds = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)

http_requests_in_progress = Gauge(
    'http_requests_in_progress',
    'Number of HTTP requests currently being processed',
    ['method', 'endpoint']
)

# System metrics
system_cpu_percent = Gauge(
    'system_cpu_percent',
    'System CPU usage percentage'
)

system_memory_percent = Gauge(
    'system_memory_percent', 
    'System memory usage percentage'
)

system_disk_percent = Gauge(
    'system_disk_percent',
    'System disk usage percentage'
)

# Application-specific metrics
compliance_checks_total = Counter(
    'compliance_checks_total',
    'Total number of compliance checks performed',
    ['aircraft_model', 'country', 'result']
)

database_queries_total = Counter(
    'database_queries_total',
    'Total number of database queries',
    ['operation', 'table', 'success']
)

cache_operations_total = Counter(
    'cache_operations_total',
    'Total number of cache operations',
    ['operation', 'success']
)

# Error metrics
http_errors_total = Counter(
    'http_errors_total',
    'Total number of HTTP errors',
    ['method', 'endpoint', 'error_type']
)


class PrometheusMetricsMiddleware(BaseHTTPMiddleware):
    """
    FastAPI middleware for automatic Prometheus metrics collection with thread safety.
    """
    
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls, app, exclude_paths: Optional[list] = None):
        """Singleton pattern to ensure only one instance."""
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self, app, exclude_paths: Optional[list] = None):
        if hasattr(self, '_initialized'):
            return
        super().__init__(app)
        self.exclude_paths = exclude_paths or ["/metrics", "/health", "/docs", "/redoc", "/openapi.json"]
        self._system_monitor_task = None
        self._shutdown_event = threading.Event()
        self._initialized = True
        self._start_system_monitoring()
    
    def _start_system_monitoring(self):
        """Start background thread for system metrics collection."""
        if self._system_monitor_task is None or not self._system_monitor_task.is_alive():
            self._shutdown_event.clear()
            self._system_monitor_task = threading.Thread(
                target=self._update_system_metrics,
                daemon=True,
                name="prometheus-system-monitor"
            )
            self._system_monitor_task.start()
            logger.info("Started Prometheus system monitoring thread")
    
    def _update_system_metrics(self):
        """Update system metrics periodically with better error handling."""
        logger.info("System metrics monitoring started")
        
        while not self._shutdown_event.is_set():
            try:
                # CPU usage (non-blocking)
                cpu_percent = psutil.cpu_percent(interval=None)
                system_cpu_percent.set(cpu_percent)
                
                # Memory usage
                memory = psutil.virtual_memory()
                system_memory_percent.set(memory.percent)
                
                # Disk usage with error handling
                try:
                    disk = psutil.disk_usage('/')
                    disk_percent = (disk.used / disk.total) * 100
                    system_disk_percent.set(disk_percent)
                except (OSError, PermissionError):
                    # In some containerized environments, disk access might be restricted
                    pass
                
                # Wait for 30 seconds or until shutdown
                if self._shutdown_event.wait(30):
                    break
                    
            except Exception as e:
                logger.warning(f"Error updating system metrics: {e}")
                # Wait before retrying
                if self._shutdown_event.wait(60):
                    break
        
        logger.info("System metrics monitoring stopped")
    
    def shutdown(self):
        """Gracefully shutdown the monitoring thread."""
        self._shutdown_event.set()
        if self._system_monitor_task and self._system_monitor_task.is_alive():
            self._system_monitor_task.join(timeout=5)
    
    def _should_exclude_path(self, path: str) -> bool:
        """Check if path should be excluded from metrics."""
        return any(excluded in path for excluded in self.exclude_paths)
    
    def _normalize_endpoint(self, path: str) -> str:
        """Normalize endpoint path for consistent metrics with comprehensive patterns."""
        # Replace path parameters with placeholders
        normalized = path
        
        # Comprehensive patterns to normalize (order matters - more specific first)
        patterns = [
            # Compliance endpoints
            (r'/compliance/check/[^/]+/[^/]+/?$', '/compliance/check/{model}/{country}'),
            (r'/compliance/regulations/[^/]+/[^/]+/?$', '/compliance/regulations/{model}/{country}'),
            (r'/compliance/ai-analysis/[^/]+/[^/]+/?$', '/compliance/ai-analysis/{model}/{country}'),
            (r'/compliance/aircraft/[^/]+/?$', '/compliance/aircraft/{model}'),
            
            # Analytics endpoints
            (r'/analytics/fleet-metrics/?$', '/analytics/fleet-metrics'),
            (r'/analytics/compliance-trends/?$', '/analytics/compliance-trends'),
            (r'/analytics/alerts/?$', '/analytics/alerts'),
            (r'/analytics/performance-metrics/?$', '/analytics/performance-metrics'),
            (r'/analytics/requirements-summary/?$', '/analytics/requirements-summary'),
            (r'/analytics/[^/]+/?$', '/analytics/{endpoint}'),
            
            # Cache endpoints
            (r'/cache/[^/]+/?$', '/cache/{operation}'),
            
            # Generic patterns for any remaining IDs/UUIDs
            (r'/[^/]+/\d+/?$', '/{resource}/{id}'),
            (r'/[^/]+/[a-f0-9-]{8,}/?$', '/{resource}/{uuid}'),
        ]
        
        for pattern, replacement in patterns:
            new_normalized = re.sub(pattern, replacement, normalized, count=1)
            if new_normalized != normalized:
                normalized = new_normalized
                break
        
        # Remove trailing slashes for consistency
        normalized = normalized.rstrip('/')
        if not normalized:
            normalized = '/'
        
        return normalized
    
    async def dispatch(self, request: Request, call_next):
        """Process request and collect metrics."""
        start_time = time.time()
        method = request.method
        path = request.url.path
        
        # Skip excluded paths
        if self._should_exclude_path(path):
            return await call_next(request)
        
        # Normalize endpoint for consistent labeling
        endpoint = self._normalize_endpoint(path)
        
        # Track requests in progress
        http_requests_in_progress.labels(method=method, endpoint=endpoint).inc()
        
        try:
            # Process request
            response = await call_next(request)
            status_code = str(response.status_code)
            
            # Record successful request
            http_requests_total.labels(
                method=method,
                endpoint=endpoint,
                status_code=status_code
            ).inc()
            
            # Record errors if applicable
            if response.status_code >= 400:
                error_type = "client_error" if response.status_code < 500 else "server_error"
                http_errors_total.labels(
                    method=method,
                    endpoint=endpoint,
                    error_type=error_type
                ).inc()
            
        except Exception as e:
            # Record server errors
            http_requests_total.labels(
                method=method,
                endpoint=endpoint,
                status_code="500"
            ).inc()
            
            http_errors_total.labels(
                method=method,
                endpoint=endpoint,
                error_type="server_error"
            ).inc()
            
            response = Response(
                content=f"Internal Server Error: {str(e)}",
                status_code=500
            )
        
        finally:
            # Record request duration
            duration = time.time() - start_time
            http_request_duration_seconds.labels(
                method=method,
                endpoint=endpoint
            ).observe(duration)
            
            # Decrement requests in progress
            http_requests_in_progress.labels(method=method, endpoint=endpoint).dec()
        
        return response


# Utility functions for manual metric recording
def record_compliance_check(aircraft_model: str, country: str, result: str):
    """Record a compliance check metric."""
    compliance_checks_total.labels(
        aircraft_model=aircraft_model,
        country=country,
        result=result
    ).inc()


def record_database_query(operation: str, table: str, success: bool):
    """Record a database query metric."""
    database_queries_total.labels(
        operation=operation,
        table=table,
        success=str(success).lower()
    ).inc()


def record_cache_operation(operation: str, success: bool):
    """Record a cache operation metric."""
    cache_operations_total.labels(
        operation=operation,
        success=str(success).lower()
    ).inc()


def get_prometheus_metrics(openmetrics_format: bool = False) -> str:
    """Generate Prometheus metrics in text format with optional OpenMetrics support."""
    try:
        if openmetrics_format:
            return openmetrics_generate_latest().decode('utf-8')
        else:
            return generate_latest().decode('utf-8')
    except Exception as e:
        logger.error(f"Error generating Prometheus metrics: {e}")
        return "# Error generating metrics\n"


def get_prometheus_content_type(openmetrics_format: bool = False) -> str:
    """Get the appropriate content type for Prometheus metrics."""
    if openmetrics_format:
        return OPENMETRICS_CONTENT_TYPE_LATEST
    return CONTENT_TYPE_LATEST


def get_current_trace_id() -> Optional[str]:
    """Get current trace ID for exemplars (placeholder for OpenTelemetry integration)."""
    # TODO: Integrate with OpenTelemetry to get actual trace ID
    # from opentelemetry import trace
    # span = trace.get_current_span()
    # if span.is_recording():
    #     return format(span.get_span_context().trace_id, '032x')
    return None