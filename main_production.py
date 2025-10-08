"""
Aviation Compliance API - Production Version
Consolidated production-ready FastAPI application for Azure deployment
"""

import time
import json
import os
from datetime import datetime
from typing import Dict, List, Optional, Any
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends, Request, Response, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn

# Aircraft specifications data
AIRCRAFT_DATA = {
    "E170": {
        "model": "E170",
        "series": "E1", 
        "seats": 80,
        "mtow_lbs": 79500,
        "range_nm": 2150,
        "engine_type": "2 × GE CF34-8E (14,200 lbf)",
        "noise_compliance": "ICAO Chapter 4",
        "emissions_compliance": "Stage 3",
        "certification": ["FAA Part 25", "EASA CS-25", "ICAO Annex 16"],
        "fuel_capacity_kg": 9400,
        "avionics": "Honeywell Primus Epic",
        "safety_rating": "A"
    },
    "E175": {
        "model": "E175",
        "series": "E1",
        "seats": 88,
        "mtow_lbs": 89000,
        "range_nm": 2200,
        "engine_type": "2 × GE CF34-8E (14,200 lbf)",
        "noise_compliance": "ICAO Chapter 4",
        "emissions_compliance": "Stage 3",
        "certification": ["FAA Part 25", "EASA CS-25", "ICAO Annex 16"],
        "fuel_capacity_kg": 9400,
        "avionics": "Honeywell Primus Epic",
        "safety_rating": "A"
    },
    "E190": {
        "model": "E190",
        "series": "E1",
        "seats": 114,
        "mtow_lbs": 124341,
        "range_nm": 2400,
        "engine_type": "2 × GE CF34-10E (18,500 lbf)",
        "noise_compliance": "ICAO Chapter 4",
        "emissions_compliance": "Stage 3",
        "certification": ["FAA Part 25", "EASA CS-25", "ICAO Annex 16"],
        "fuel_capacity_kg": 13500,
        "avionics": "Honeywell Primus Epic",
        "safety_rating": "A"
    },
    "E195": {
        "model": "E195",
        "series": "E1",
        "seats": 124,
        "mtow_lbs": 124341,
        "range_nm": 2300,
        "engine_type": "2 × GE CF34-10E (18,500 lbf)",
        "noise_compliance": "ICAO Chapter 4",
        "emissions_compliance": "Stage 3",
        "certification": ["FAA Part 25", "EASA CS-25", "ICAO Annex 16"],
        "fuel_capacity_kg": 13500,
        "avionics": "Honeywell Primus Epic",
        "safety_rating": "A"
    },
    "E175-E2": {
        "model": "E175-E2",
        "series": "E2",
        "seats": 88,
        "mtow_lbs": 89000,
        "range_nm": 2600,
        "engine_type": "2 × PW1700G (Geared Turbofan)",
        "noise_compliance": "ICAO Chapter 14",
        "emissions_compliance": "Stage 5",
        "certification": ["FAA Part 25", "EASA CS-25", "ICAO Annex 16"],
        "fuel_capacity_kg": 9400,
        "avionics": "Honeywell Primus Epic 2 + Fly-by-wire",
        "safety_rating": "A+"
    },
    "E190-E2": {
        "model": "E190-E2",
        "series": "E2",
        "seats": 114,
        "mtow_lbs": 124341,
        "range_nm": 2850,
        "engine_type": "2 × PW1900G (Geared Turbofan)",
        "noise_compliance": "ICAO Chapter 14",
        "emissions_compliance": "Stage 5",
        "certification": ["FAA Part 25", "EASA CS-25", "ICAO Annex 16"],
        "fuel_capacity_kg": 13500,
        "avionics": "Honeywell Primus Epic 2 + Fly-by-wire",
        "safety_rating": "A+"
    },
    "E195-E2": {
        "model": "E195-E2",
        "series": "E2",
        "seats": 146,
        "mtow_lbs": 124341,
        "range_nm": 2600,
        "engine_type": "2 × PW1900G (Geared Turbofan)",
        "noise_compliance": "ICAO Chapter 14",
        "emissions_compliance": "Stage 5",
        "certification": ["FAA Part 25", "EASA CS-25", "ICAO Annex 16"],
        "fuel_capacity_kg": 13500,
        "avionics": "Honeywell Primus Epic 2 + Fly-by-wire",
        "safety_rating": "A+"
    }
}

# Compliance authorities data
AUTHORITIES_DATA = {
    "FAA": {"name": "Federal Aviation Administration", "region": "USA"},
    "EASA": {"name": "European Union Aviation Safety Agency", "region": "Europe"},
    "ANAC": {"name": "Agência Nacional de Aviação Civil", "region": "Brazil"},
    "ICAO": {"name": "International Civil Aviation Organization", "region": "Global"}
}

# Pydantic models
class AircraftSpecification(BaseModel):
    model: str
    series: str
    seats: int
    mtow_lbs: int
    range_nm: int
    engine_type: str
    noise_compliance: str
    emissions_compliance: str
    certification: List[str]
    fuel_capacity_kg: int
    avionics: str
    safety_rating: str

class ComplianceCheckResult(BaseModel):
    aircraft_model: str
    authority: str
    compliance_status: str
    score: float
    details: Dict[str, Any]
    specifications: AircraftSpecification
    timestamp: str

# Application startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    print("🚀 Starting Aviation Compliance API...")
    print(f"📊 {len(AIRCRAFT_DATA)} aircraft models loaded")
    yield
    print("✅ Aviation Compliance API shutdown complete")

# Initialize FastAPI app
app = FastAPI(
    title="Aviation Compliance API - Embraer E-Jets",
    description="Production API for Embraer E-Jets compliance checking and specifications",
    version="4.0.0",
    contact={
        "name": "Aviation Compliance Team",
        "email": "compliance@aviation.com"
    },
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware for Azure
azure_hosts = [
    "aviation-compliance-app.wonderfulsea-d38b4e92.eastus.azurecontainerapps.io",
    "localhost",
    "127.0.0.1"
]
app.add_middleware(TrustedHostMiddleware, allowed_hosts=azure_hosts)

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint for monitoring and load balancers.
    """
    return {
        "status": "healthy",
        "message": "Aviation Compliance API operational",
        "timestamp": datetime.utcnow().isoformat(),
        "database_status": "in-memory",
        "aircraft_models_loaded": len(AIRCRAFT_DATA)
    }

# Aircraft endpoints
@app.get("/aircraft/models", tags=["Aircraft"])
async def get_aircraft_models():
    """
    Get all available aircraft models.
    """
    e1_models = [model for model, data in AIRCRAFT_DATA.items() if data["series"] == "E1"]
    e2_models = [model for model, data in AIRCRAFT_DATA.items() if data["series"] == "E2"]
    
    return {
        "total_models": len(AIRCRAFT_DATA),
        "models_by_series": {
            "E1": e1_models,
            "E2": e2_models
        },
        "all_models": list(AIRCRAFT_DATA.keys()),
        "latest_generation": "E2 Series with Geared Turbofan engines"
    }

@app.get("/aircraft/specifications/{model}", response_model=AircraftSpecification, tags=["Aircraft"])
async def get_aircraft_specifications(model: str):
    """
    Get detailed specifications for a specific aircraft model.
    """
    if model not in AIRCRAFT_DATA:
        raise HTTPException(status_code=404, detail=f"Aircraft model '{model}' not found")
    
    return AircraftSpecification(**AIRCRAFT_DATA[model])

# Compliance endpoints
@app.get("/compliance/authorities", tags=["Compliance"])
async def get_compliance_authorities():
    """
    Get all supported compliance authorities and their information.
    """
    return {
        "authorities": AUTHORITIES_DATA,
        "supported_checks": ["full", "noise", "emissions", "safety"],
        "global_standards": ["ICAO", "RVSM", "TCAS II", "ADS-B"]
    }

@app.get("/compliance/check/{model}/{authority}", response_model=ComplianceCheckResult, tags=["Compliance"])
async def check_compliance(
    model: str, 
    authority: str,
    check_type: str = Query("full", description="Type of compliance check")
):
    """
    Perform compliance check for an aircraft model against a specific authority.
    """
    if model not in AIRCRAFT_DATA:
        raise HTTPException(status_code=404, detail=f"Aircraft model '{model}' not found")
    
    if authority not in AUTHORITIES_DATA:
        raise HTTPException(status_code=404, detail=f"Authority '{authority}' not supported")
    
    aircraft_spec = AIRCRAFT_DATA[model]
    
    # Calculate compliance score based on generation and standards
    base_score = 90 if aircraft_spec["series"] == "E1" else 95
    
    # Adjust score based on noise and emissions compliance
    if aircraft_spec["noise_compliance"] == "ICAO Chapter 14":
        base_score += 5
    if aircraft_spec["emissions_compliance"] == "Stage 5":
        base_score += 3
    
    # Ensure score doesn't exceed 100
    compliance_score = min(base_score, 100)
    
    # Determine compliance status
    if compliance_score >= 95:
        status = "COMPLIANT"
    elif compliance_score >= 80:
        status = "PARTIAL"
    else:
        status = "NON-COMPLIANT"
    
    return ComplianceCheckResult(
        aircraft_model=model,
        authority=authority,
        compliance_status=status,
        score=compliance_score,
        details={
            "noise_level": aircraft_spec["noise_compliance"],
            "emissions_level": aircraft_spec["emissions_compliance"],
            "certifications": aircraft_spec["certification"],
            "engine_technology": aircraft_spec["engine_type"],
            "avionics_suite": aircraft_spec["avionics"],
            "generation": aircraft_spec["series"],
            "check_performed": check_type,
            "authority_region": AUTHORITIES_DATA[authority]["region"]
        },
        specifications=AircraftSpecification(**aircraft_spec),
        timestamp=datetime.utcnow().isoformat()
    )

# Analytics endpoints
@app.get("/analytics/fleet-metrics", tags=["Analytics"])
async def get_fleet_metrics():
    """
    Get fleet-wide analytics and metrics.
    """
    e1_models = [data for data in AIRCRAFT_DATA.values() if data["series"] == "E1"]
    e2_models = [data for data in AIRCRAFT_DATA.values() if data["series"] == "E2"]
    
    # Calculate average compliance scores
    e1_avg_score = sum(90 + (3 if spec["emissions_compliance"] == "Stage 5" else 0) + 
                      (5 if spec["noise_compliance"] == "ICAO Chapter 14" else 0) 
                      for spec in e1_models) / len(e1_models) if e1_models else 0
    
    e2_avg_score = sum(95 + (3 if spec["emissions_compliance"] == "Stage 5" else 0) + 
                      (5 if spec["noise_compliance"] == "ICAO Chapter 14" else 0) 
                      for spec in e2_models) / len(e2_models) if e2_models else 0
    
    overall_avg = (e1_avg_score * len(e1_models) + e2_avg_score * len(e2_models)) / len(AIRCRAFT_DATA)
    
    return {
        "total_models": len(AIRCRAFT_DATA),
        "e1_series_count": len(e1_models),
        "e2_series_count": len(e2_models),
        "average_compliance_score": round(overall_avg, 1),
        "compliance_by_series": {
            "E1": round(e1_avg_score, 1),
            "E2": round(e2_avg_score, 1)
        },
        "latest_models": [model for model, data in AIRCRAFT_DATA.items() if data["series"] == "E2"]
    }

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    API root endpoint with basic information.
    """
    return {
        "message": "Aviation Compliance API - Embraer E-Jets",
        "version": "4.0.0",
        "status": "operational",
        "aircraft_models": len(AIRCRAFT_DATA),
        "supported_authorities": list(AUTHORITIES_DATA.keys()),
        "documentation": "/docs",
        "health_check": "/health"
    }

# Error handlers
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler for unhandled errors.
    """
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "timestamp": datetime.utcnow().isoformat(),
            "path": str(request.url)
        }
    )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info",
        access_log=True
    )