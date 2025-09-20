"""
Cache management endpoints for monitoring and administration.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from src.services.cache_service import cache_service
from src.logger import log_business_event

router = APIRouter(prefix="/cache", tags=["Cache Management"])


@router.get("/stats", summary="Get Cache Statistics")
async def get_cache_stats() -> Dict[str, Any]:
    """Get detailed cache statistics and health information."""
    log_business_event(
        "cache_stats_requested",
        {"endpoint": "/cache/stats"}
    )
    
    stats = await cache_service.get_cache_stats()
    
    log_business_event(
        "cache_stats_retrieved",
        {"endpoint": "/cache/stats", "connected": stats.get("connected", False)}
    )
    
    return stats


@router.delete("/compliance", summary="Clear Compliance Cache")
async def clear_compliance_cache() -> Dict[str, Any]:
    """Clear all compliance-related cache entries."""
    log_business_event(
        "cache_clear_requested",
        {"endpoint": "/cache/compliance", "action": "clear_all"}
    )
    
    if not cache_service.is_connected:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "CACHE_UNAVAILABLE",
                "message": "Redis cache is not connected"
            }
        )
    
    deleted_count = await cache_service.clear_all_compliance_cache()
    
    log_business_event(
        "cache_cleared",
        {
            "endpoint": "/cache/compliance",
            "action": "clear_all",
            "deleted_count": deleted_count
        }
    )
    
    return {
        "action": "clear_all_compliance_cache",
        "deleted_entries": deleted_count,
        "status": "success"
    }


@router.delete("/compliance/{model}/{country}", summary="Clear Specific Cache Entry")
async def clear_specific_cache(model: str, country: str) -> Dict[str, Any]:
    """Clear cache entry for a specific model and country combination."""
    log_business_event(
        "cache_invalidate_requested",
        {
            "endpoint": "/cache/compliance/specific",
            "model": model,
            "country": country
        }
    )
    
    if not cache_service.is_connected:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "CACHE_UNAVAILABLE",
                "message": "Redis cache is not connected"
            }
        )
    
    was_deleted = await cache_service.invalidate_compliance_result(model, country)
    
    log_business_event(
        "cache_invalidated",
        {
            "endpoint": "/cache/compliance/specific",
            "model": model,
            "country": country,
            "was_present": was_deleted
        }
    )
    
    return {
        "action": "invalidate_cache_entry",
        "model": model,
        "country": country,
        "was_present": was_deleted,
        "status": "success"
    }