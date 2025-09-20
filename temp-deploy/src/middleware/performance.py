"""
Performance monitoring middleware for FastAPI application.
Tracks response times, request counts, and other performance metrics.
"""

import time
from typing import Dict, Optional, Callable
from collections import defaultdict, deque
from datetime import datetime, timedelta
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import threading


class PerformanceMetrics:
    """Thread-safe performance metrics collector."""
    
    def __init__(self, max_history: int = 1000):
        self._lock = threading.RLock()
        self.max_history = max_history
        
        # Request counters
        self.request_count: Dict[str, int] = defaultdict(int)
        self.error_count: Dict[str, int] = defaultdict(int)
        
        # Response time tracking
        self.response_times: Dict[str, deque] = defaultdict(lambda: deque(maxlen=max_history))
        self.total_response_time: Dict[str, float] = defaultdict(float)
        
        # Status code tracking
        self.status_codes: Dict[str, Dict[int, int]] = defaultdict(lambda: defaultdict(int))
        
        # System metrics
        self.start_time = datetime.now()
        self.last_request_time: Optional[datetime] = None
    
    def record_request(self, endpoint: str, method: str, response_time: float, status_code: int):
        """Record metrics for a completed request."""
        with self._lock:
            key = f"{method} {endpoint}"
            
            # Update counters
            self.request_count[key] += 1
            if status_code >= 400:
                self.error_count[key] += 1
            
            # Update response times
            self.response_times[key].append(response_time)
            self.total_response_time[key] += response_time
            
            # Update status codes
            self.status_codes[key][status_code] += 1
            
            # Update system metrics
            self.last_request_time = datetime.now()
    
    def get_endpoint_metrics(self, endpoint: str, method: str) -> Dict:
        """Get metrics for a specific endpoint."""
        with self._lock:
            key = f"{method} {endpoint}"
            response_times = list(self.response_times[key])
            
        if not response_times:
            return {
                "endpoint": endpoint,
                "method": method,
                "request_count": 0,
                "error_count": 0,
                "error_rate": 0.0,
                "avg_response_time": 0,
                "min_response_time": 0,
                "max_response_time": 0,
                "p95_response_time": 0,
                "p99_response_time": 0,
                "status_codes": {}
            }
        
        return {
                "endpoint": endpoint,
                "method": method,
                "request_count": self.request_count[key],
                "error_count": self.error_count[key],
                "error_rate": self.error_count[key] / self.request_count[key] if self.request_count[key] > 0 else 0,
                "avg_response_time": sum(response_times) / len(response_times),
                "min_response_time": min(response_times),
                "max_response_time": max(response_times),
                "p95_response_time": sorted(response_times)[int(len(response_times) * 0.95)] if response_times else 0,
                "p99_response_time": sorted(response_times)[int(len(response_times) * 0.99)] if response_times else 0,
                "status_codes": dict(self.status_codes[key])
            }
    
    def get_system_metrics(self) -> Dict:
        """Get overall system metrics."""
        with self._lock:
            uptime = datetime.now() - self.start_time
            total_requests = sum(self.request_count.values())
            total_errors = sum(self.error_count.values())
            
            all_response_times = []
            for times in self.response_times.values():
                all_response_times.extend(times)
            
            return {
                "uptime_seconds": uptime.total_seconds(),
                "uptime_human": str(uptime),
                "total_requests": total_requests,
                "total_errors": total_errors,
                "overall_error_rate": total_errors / total_requests if total_requests > 0 else 0,
                "avg_response_time": sum(all_response_times) / len(all_response_times) if all_response_times else 0,
                "requests_per_minute": total_requests / (uptime.total_seconds() / 60) if uptime.total_seconds() > 0 else 0,
                "last_request_time": self.last_request_time.isoformat() if self.last_request_time else None,
                "active_endpoints": len(self.request_count)
            }
    
    def get_all_metrics(self) -> Dict:
        """Get complete metrics summary."""
        with self._lock:
            endpoints_metrics = []
            for key in self.request_count.keys():
                method, endpoint = key.split(" ", 1)
                endpoints_metrics.append(self.get_endpoint_metrics(endpoint, method))
            
            return {
                "system": self.get_system_metrics(),
                "endpoints": endpoints_metrics
            }


# Global metrics instance
metrics = PerformanceMetrics()


class PerformanceMiddleware(BaseHTTPMiddleware):
    """FastAPI middleware for performance monitoring."""
    
    def __init__(self, app, exclude_paths: Optional[set] = None):
        super().__init__(app)
        self.exclude_paths = exclude_paths or {"/metrics", "/metrics/", "/metrics/health", "/metrics/endpoint", "/health", "/docs", "/redoc", "/openapi.json"}
    
    async def dispatch(self, request: Request, call_next):
        # Skip monitoring for excluded paths
        if request.url.path in self.exclude_paths or request.url.path.startswith("/metrics"):
            return await call_next(request)
        
        # Record start time
        start_time = time.time()
        
        # Process request
        response = await call_next(request)
        
        # Calculate response time
        response_time = time.time() - start_time
        
        # Extract endpoint info
        endpoint = request.url.path
        method = request.method
        status_code = response.status_code
        
        # Record metrics
        metrics.record_request(endpoint, method, response_time, status_code)
        
        # Add performance headers
        response.headers["X-Response-Time"] = f"{response_time:.3f}s"
        
        return response


def get_metrics() -> Dict:
    """Get current performance metrics."""
    return metrics.get_all_metrics()


def get_endpoint_metrics(endpoint: str, method: str = "GET") -> Dict:
    """Get metrics for a specific endpoint."""
    return metrics.get_endpoint_metrics(endpoint, method)


def reset_metrics():
    """Reset all performance metrics (useful for testing)."""
    global metrics
    metrics = PerformanceMetrics()