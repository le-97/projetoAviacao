"""
Rate limiting middleware for FastAPI applications.

Implements token bucket algorithm for rate limiting with configurable limits
per endpoint and comprehensive logging integration.
"""

import time
import asyncio
from typing import Dict, Optional, Tuple, Any
from collections import defaultdict
from dataclasses import dataclass, field
from threading import Lock

from fastapi import Request, Response, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from src.logger import log_security_event, log_performance_metric


@dataclass
class TokenBucket:
    """Token bucket for rate limiting implementation."""
    capacity: int
    refill_rate: float  # tokens per second
    tokens: float = field(init=False)
    last_refill: float = field(init=False)
    lock: Lock = field(default_factory=Lock, init=False)
    
    def __post_init__(self):
        self.tokens = float(self.capacity)
        self.last_refill = time.time()
    
    def consume(self, tokens: int = 1) -> bool:
        """
        Attempt to consume tokens from the bucket.

        Args:
            tokens: Number of tokens to consume

        Returns:
            True if tokens were consumed, False if not enough tokens available
        """
        with self.lock:
            # Get current time, handle mocked time
            now = time.time()
            
            # Handle the case where time is mocked
            if hasattr(now, '_mock_name'):
                # If time is mocked, use the mock value
                now = float(now)
            
            # Refill tokens based on time elapsed
            time_passed = max(0, now - self.last_refill)
            tokens_to_add = time_passed * self.refill_rate
            
            # Update tokens with proper float handling
            new_tokens = self.tokens + tokens_to_add
            self.tokens = min(float(self.capacity), new_tokens)
            self.last_refill = now

            if self.tokens >= tokens:
                self.tokens -= tokens
                return True
            return False

    def get_status(self) -> Tuple[int, float]:
        """
        Get current bucket status.
        
        Returns:
            Tuple of (available_tokens, time_until_next_token)
        """
        with self.lock:
            now = time.time()
            time_passed = now - self.last_refill
            tokens_to_add = time_passed * self.refill_rate
            current_tokens = min(self.capacity, self.tokens + tokens_to_add)
            
            if current_tokens >= self.capacity:
                time_until_refill = 0.0
            else:
                time_until_refill = (1.0 - (current_tokens % 1.0)) / self.refill_rate
                
            return int(current_tokens), time_until_refill


@dataclass
class RateLimitConfig:
    """Configuration for rate limiting rules."""
    requests_per_minute: int = 60
    burst_size: int = 10
    window_size: int = 60  # seconds
    enabled: bool = True


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting middleware using token bucket algorithm.
    
    Features:
    - Per-IP rate limiting
    - Configurable limits per endpoint
    - Standard HTTP headers (X-RateLimit-*)
    - Comprehensive logging
    - Thread-safe implementation
    """
    
    def __init__(
        self,
        app,
        default_config: Optional[RateLimitConfig] = None,
        endpoint_configs: Optional[Dict[str, RateLimitConfig]] = None,
        key_func: Optional[callable] = None
    ):
        super().__init__(app)
        self.default_config = default_config or RateLimitConfig()
        self.endpoint_configs = endpoint_configs or {}
        self.key_func = key_func or self._default_key_func
        
        # Storage for token buckets per client/endpoint
        self.buckets: Dict[str, TokenBucket] = {}
        self.bucket_lock = Lock()
        
        # Cleanup old buckets periodically
        self._last_cleanup = time.time()
        self._cleanup_interval = 300  # 5 minutes
    
    def _default_key_func(self, request: Request) -> str:
        """Default function to generate rate limit key from request."""
        # Use client IP as the key
        client_ip = request.client.host if request.client else "unknown"
        return f"ip:{client_ip}"
    
    def _get_endpoint_config(self, path: str) -> RateLimitConfig:
        """Get rate limit configuration for specific endpoint."""
        for endpoint_pattern, config in self.endpoint_configs.items():
            if path.startswith(endpoint_pattern):
                return config
        return self.default_config
    
    def _get_bucket_key(self, request: Request) -> str:
        """Generate bucket key combining client key and endpoint."""
        client_key = self.key_func(request)
        endpoint = request.url.path
        return f"{client_key}:{endpoint}"
    
    def _get_or_create_bucket(self, bucket_key: str, config: RateLimitConfig) -> TokenBucket:
        """Get existing bucket or create new one."""
        with self.bucket_lock:
            if bucket_key not in self.buckets:
                # Create token bucket with refill rate in tokens per second
                refill_rate = config.requests_per_minute / 60.0
                self.buckets[bucket_key] = TokenBucket(
                    capacity=config.burst_size,
                    refill_rate=refill_rate
                )
            return self.buckets[bucket_key]
    
    def _cleanup_old_buckets(self):
        """Remove old unused buckets to prevent memory leaks."""
        now = time.time()
        if now - self._last_cleanup < self._cleanup_interval:
            return
            
        with self.bucket_lock:
            keys_to_remove = []
            for key, bucket in self.buckets.items():
                # Remove buckets that haven't been accessed in 10 minutes
                if now - bucket.last_refill > 600:
                    keys_to_remove.append(key)
            
            for key in keys_to_remove:
                del self.buckets[key]
                
            self._last_cleanup = now
    
    async def dispatch(self, request: Request, call_next):
        """Main middleware logic."""
        # Skip rate limiting for certain paths
        if request.url.path in ["/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)
        
        start_time = time.time()
        
        # Get configuration for this endpoint
        config = self._get_endpoint_config(request.url.path)
        
        if not config.enabled:
            return await call_next(request)
        
        # Generate bucket key
        bucket_key = self._get_bucket_key(request)
        
        # Get or create token bucket
        bucket = self._get_or_create_bucket(bucket_key, config)
        
        # Try to consume a token
        allowed = bucket.consume(1)
        
        # Get current status for headers
        available_tokens, time_until_refill = bucket.get_status()
        
        # Calculate reset time
        reset_time = int(time.time() + time_until_refill)
        
        # Prepare response headers
        headers = {
            "X-RateLimit-Limit": str(config.requests_per_minute),
            "X-RateLimit-Remaining": str(max(0, available_tokens)),
            "X-RateLimit-Reset": str(reset_time),
            "X-RateLimit-Window": str(config.window_size)
        }
        
        if not allowed:
            # Rate limit exceeded
            client_key = self.key_func(request)
            
            log_security_event(
                "rate_limit_exceeded",
                "warning",
                {
                    "client_key": client_key,
                    "endpoint": request.url.path,
                    "method": request.method,
                    "limit": config.requests_per_minute,
                    "window": config.window_size,
                    "user_agent": request.headers.get("user-agent", "unknown")
                }
            )
            
            log_performance_metric(
                "rate_limit_blocked_request",
                {
                    "endpoint": request.url.path,
                    "client_key": client_key,
                    "limit_type": "rate_limit"
                }
            )
            
            error_response = {
                "error": "RATE_LIMIT_EXCEEDED",
                "message": f"Rate limit exceeded. Maximum {config.requests_per_minute} requests per minute allowed.",
                "details": {
                    "limit": config.requests_per_minute,
                    "window": config.window_size,
                    "reset_time": reset_time,
                    "retry_after": max(1, int(time_until_refill))
                }
            }
            
            response = JSONResponse(
                status_code=429,
                content=error_response,
                headers=headers
            )
            
            # Add Retry-After header
            response.headers["Retry-After"] = str(max(1, int(time_until_refill)))
            
            return response
        
        # Request allowed, proceed
        try:
            response = await call_next(request)
            
            # Add rate limit headers to successful responses
            for key, value in headers.items():
                response.headers[key] = value
            
            # Log successful rate limited request
            processing_time = time.time() - start_time
            log_performance_metric(
                "rate_limited_request_success",
                {
                    "endpoint": request.url.path,
                    "method": request.method,
                    "processing_time": processing_time,
                    "tokens_remaining": available_tokens,
                    "status_code": response.status_code
                }
            )
            
            return response
            
        except Exception as e:
            # Log failed requests
            log_security_event(
                "rate_limited_request_error",
                "error",
                {
                    "endpoint": request.url.path,
                    "method": request.method,
                    "error": str(e),
                    "error_type": type(e).__name__
                }
            )
            raise
        finally:
            # Periodic cleanup
            self._cleanup_old_buckets()


# Predefined configurations for different endpoint types
ENDPOINT_CONFIGS = {
    "/check-compliance": RateLimitConfig(
        requests_per_minute=30,  # Lower limit for main business endpoint
        burst_size=5,
        window_size=60
    ),
    "/metrics": RateLimitConfig(
        requests_per_minute=120,  # Higher limit for monitoring
        burst_size=20,
        window_size=60
    ),
    "/health": RateLimitConfig(
        requests_per_minute=300,  # Very high limit for health checks
        burst_size=50,
        window_size=60
    ),
    "/": RateLimitConfig(
        requests_per_minute=100,  # Moderate limit for root endpoint
        burst_size=10,
        window_size=60
    )
}


def create_rate_limit_middleware(
    default_requests_per_minute: int = 60,
    endpoint_configs: Optional[Dict[str, RateLimitConfig]] = None
):
    """
    Factory function to create rate limit middleware with custom configuration.
    
    Args:
        default_requests_per_minute: Default rate limit for all endpoints
        endpoint_configs: Custom configurations for specific endpoints
        
    Returns:
        Partial function that can be used with app.add_middleware()
    """
    from functools import partial
    
    default_config = RateLimitConfig(
        requests_per_minute=default_requests_per_minute,
        burst_size=max(10, default_requests_per_minute // 6),
        window_size=60
    )
    
    return partial(
        RateLimitMiddleware,
        default_config=default_config,
        endpoint_configs=endpoint_configs or ENDPOINT_CONFIGS
    )