"""
Security hardening configuration for the Aviation Compliance API.
"""
import hashlib
import hmac
import secrets
import time
from datetime import datetime, timedelta
from typing import Optional, Dict, List
from functools import wraps

from fastapi import HTTPException, Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

# Security Configuration
SECURITY_CONFIG = {
    "api_key_length": 32,
    "jwt_secret_key": secrets.token_urlsafe(64),
    "jwt_algorithm": "HS256",
    "jwt_expiry_hours": 24,
    "rate_limit_requests": 100,
    "rate_limit_window": 3600,  # 1 hour
    "max_request_size": 1024 * 1024,  # 1MB
    "allowed_origins": [
        "http://localhost:3000",
        "http://localhost:8080",
        "https://aviacao-compliance.com"
    ],
    "blocked_ips": set(),
    "suspicious_patterns": [
        "union", "select", "drop", "delete", "insert", "update",
        "script", "javascript", "onload", "onerror",
        "../", "..\\", "/etc/", "c:\\"
    ]
}

# Rate limiting storage (in production use Redis)
rate_limit_store: Dict[str, List[float]] = {}

class SecurityManager:
    """Centralized security management."""
    
    @staticmethod
    def generate_api_key() -> str:
        """Generate a secure API key."""
        return secrets.token_urlsafe(SECURITY_CONFIG["api_key_length"])
    
    @staticmethod
    def hash_api_key(api_key: str) -> str:
        """Hash an API key for secure storage."""
        salt = secrets.token_hex(16)
        key_hash = hashlib.pbkdf2_hmac('sha256', api_key.encode(), salt.encode(), 100000)
        return f"{salt}:{key_hash.hex()}"
    
    @staticmethod
    def verify_api_key(api_key: str, stored_hash: str) -> bool:
        """Verify an API key against its hash."""
        try:
            salt, key_hash = stored_hash.split(':')
            computed_hash = hashlib.pbkdf2_hmac('sha256', api_key.encode(), salt.encode(), 100000)
            return hmac.compare_digest(key_hash, computed_hash.hex())
        except Exception:
            return False
    
    @staticmethod
    def create_jwt_token(user_id: str, permissions: List[str] = None) -> str:
        """Create a JWT token for authenticated users."""
        payload = {
            "user_id": user_id,
            "permissions": permissions or ["read"],
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(hours=SECURITY_CONFIG["jwt_expiry_hours"])
        }
        return jwt.encode(payload, SECURITY_CONFIG["jwt_secret_key"], algorithm=SECURITY_CONFIG["jwt_algorithm"])
    
    @staticmethod
    def verify_jwt_token(token: str) -> Optional[Dict]:
        """Verify and decode a JWT token."""
        try:
            payload = jwt.decode(token, SECURITY_CONFIG["jwt_secret_key"], algorithms=[SECURITY_CONFIG["jwt_algorithm"]])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token has expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid token")

# Security Middleware
def validate_input(value: str, field_name: str) -> str:
    """Validate and sanitize input values."""
    if not value or len(value.strip()) == 0:
        raise HTTPException(status_code=400, detail=f"Field {field_name} cannot be empty")
    
    # Check for suspicious patterns
    value_lower = value.lower()
    for pattern in SECURITY_CONFIG["suspicious_patterns"]:
        if pattern in value_lower:
            raise HTTPException(status_code=400, detail=f"Invalid characters detected in {field_name}")
    
    # Length validation
    if len(value) > 100:
        raise HTTPException(status_code=400, detail=f"Field {field_name} too long (max 100 characters)")
    
    return value.strip()

def rate_limit(max_requests: int = None, window_seconds: int = None):
    """Rate limiting decorator."""
    max_req = max_requests or SECURITY_CONFIG["rate_limit_requests"]
    window = window_seconds or SECURITY_CONFIG["rate_limit_window"]
    
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            client_ip = request.client.host
            current_time = time.time()
            
            # Clean old entries
            if client_ip in rate_limit_store:
                rate_limit_store[client_ip] = [
                    req_time for req_time in rate_limit_store[client_ip]
                    if current_time - req_time < window
                ]
            else:
                rate_limit_store[client_ip] = []
            
            # Check rate limit
            if len(rate_limit_store[client_ip]) >= max_req:
                raise HTTPException(
                    status_code=429,
                    detail=f"Rate limit exceeded. Max {max_req} requests per {window} seconds"
                )
            
            # Record this request
            rate_limit_store[client_ip].append(current_time)
            
            return await func(request, *args, **kwargs)
        return wrapper
    return decorator

def ip_whitelist(allowed_ips: List[str] = None):
    """IP whitelist decorator for sensitive endpoints."""
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            client_ip = request.client.host
            
            if allowed_ips and client_ip not in allowed_ips:
                raise HTTPException(status_code=403, detail="IP address not allowed")
            
            if client_ip in SECURITY_CONFIG["blocked_ips"]:
                raise HTTPException(status_code=403, detail="IP address blocked")
            
            return await func(request, *args, **kwargs)
        return wrapper
    return decorator

# Authentication Dependencies
security = HTTPBearer()

async def verify_api_key(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Dependency to verify API key authentication."""
    api_key = credentials.credentials
    
    # In production, load from database
    valid_api_keys = {
        "demo_key_hash": SecurityManager.hash_api_key("demo_api_key_12345"),
        "admin_key_hash": SecurityManager.hash_api_key("admin_api_key_67890")
    }
    
    for key_name, stored_hash in valid_api_keys.items():
        if SecurityManager.verify_api_key(api_key, stored_hash):
            return key_name
    
    raise HTTPException(status_code=401, detail="Invalid API key")

async def verify_jwt(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict:
    """Dependency to verify JWT authentication."""
    token = credentials.credentials
    return SecurityManager.verify_jwt_token(token)

# Security Headers
SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY", 
    "X-XSS-Protection": "1; mode=block",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), location=()"
}

def add_security_headers(response):
    """Add security headers to response."""
    for header, value in SECURITY_HEADERS.items():
        response.headers[header] = value
    return response

# Input Validation Schemas
class SecureModelInput:
    """Secure validation for aircraft model input."""
    
    @staticmethod
    def validate_model(model: str) -> str:
        """Validate aircraft model input."""
        model = validate_input(model, "aircraft_model")
        
        # Whitelist of allowed model patterns
        allowed_patterns = [
            "E175", "E190", "E195", "A320", "A380", "B737", "B747", "B777", "B787"
        ]
        
        base_model = model.split('-')[0] if '-' in model else model
        if base_model not in allowed_patterns:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported aircraft model: {model}"
            )
        
        return model

class SecureCountryInput:
    """Secure validation for country input."""
    
    @staticmethod
    def validate_country(country: str) -> str:
        """Validate country input."""
        country = validate_input(country, "country")
        
        # Whitelist of supported countries
        allowed_countries = ["USA", "BRA", "EUR", "CAN", "AUS", "JPN"]
        
        if country not in allowed_countries:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported country: {country}"
            )
        
        return country

# Security Audit Logging
class SecurityAuditLogger:
    """Security event audit logging."""
    
    @staticmethod
    def log_authentication_event(event_type: str, user_id: str, ip_address: str, success: bool):
        """Log authentication events."""
        timestamp = datetime.utcnow().isoformat()
        print(f"[SECURITY] {timestamp} - {event_type} - User: {user_id} - IP: {ip_address} - Success: {success}")
    
    @staticmethod
    def log_access_event(endpoint: str, user_id: str, ip_address: str, method: str):
        """Log API access events."""
        timestamp = datetime.utcnow().isoformat()
        print(f"[ACCESS] {timestamp} - {method} {endpoint} - User: {user_id} - IP: {ip_address}")
    
    @staticmethod
    def log_security_violation(violation_type: str, details: str, ip_address: str):
        """Log security violations."""
        timestamp = datetime.utcnow().isoformat()
        print(f"[VIOLATION] {timestamp} - {violation_type} - IP: {ip_address} - Details: {details}")

# Database Security
class DatabaseSecurity:
    """Database security utilities."""
    
    @staticmethod
    def sanitize_sql_param(param: str) -> str:
        """Sanitize SQL parameters to prevent injection."""
        if not param:
            return param
        
        # Remove dangerous characters
        dangerous_chars = ["'", '"', ";", "--", "/*", "*/", "xp_", "sp_"]
        sanitized = param
        
        for char in dangerous_chars:
            sanitized = sanitized.replace(char, "")
        
        return sanitized
    
    @staticmethod
    def validate_query_result_size(result_count: int, max_size: int = 1000):
        """Validate query result size to prevent resource exhaustion."""
        if result_count > max_size:
            raise HTTPException(
                status_code=413,
                detail=f"Query result too large: {result_count} rows (max {max_size})"
            )

# Security Testing Utilities
class SecurityTester:
    """Security testing and validation utilities."""
    
    @staticmethod
    def test_sql_injection_patterns(input_value: str) -> bool:
        """Test input for SQL injection patterns."""
        injection_patterns = [
            "' OR '1'='1", "'; DROP TABLE", "UNION SELECT",
            "1' AND 1=1--", "' OR 1=1#", "admin'--"
        ]
        
        for pattern in injection_patterns:
            if pattern.lower() in input_value.lower():
                return True
        return False
    
    @staticmethod
    def test_xss_patterns(input_value: str) -> bool:
        """Test input for XSS patterns."""
        xss_patterns = [
            "<script>", "</script>", "javascript:", "onload=", 
            "onerror=", "<iframe>", "eval(", "document.cookie"
        ]
        
        for pattern in xss_patterns:
            if pattern.lower() in input_value.lower():
                return True
        return False

# Export security utilities
__all__ = [
    "SecurityManager",
    "validate_input", 
    "rate_limit",
    "ip_whitelist",
    "verify_api_key",
    "verify_jwt",
    "add_security_headers",
    "SecureModelInput",
    "SecureCountryInput", 
    "SecurityAuditLogger",
    "DatabaseSecurity",
    "SecurityTester",
    "SECURITY_CONFIG"
]