"""
MVP Aviation Compliance API - Simplified version for demo
"""
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any
import json

app = FastAPI(
    title="Aviation Compliance MVP",
    description="Simplified MVP for aviation compliance checking",
    version="0.1.0"
)

# Basic models
class ComplianceRequest(BaseModel):
    aircraft_model: str
    country: str

class ComplianceResponse(BaseModel):
    aircraft_model: str
    country: str
    status: str
    compliant: bool
    message: str

# Mock compliance data
COMPLIANCE_DATA = {
    "E175": {
        "USA": {"compliant": True, "message": "All FAA requirements met"},
        "BRAZIL": {"compliant": True, "message": "All ANAC requirements met"},
        "EUROPE": {"compliant": True, "message": "All EASA requirements met"}
    },
    "E190": {
        "USA": {"compliant": True, "message": "All FAA requirements met"},
        "BRAZIL": {"compliant": True, "message": "All ANAC requirements met"},
        "EUROPE": {"compliant": True, "message": "All EASA requirements met"}
    },
    "E195": {
        "USA": {"compliant": True, "message": "All FAA requirements met"},
        "BRAZIL": {"compliant": True, "message": "All ANAC requirements met"},
        "EUROPE": {"compliant": True, "message": "All EASA requirements met"}
    }
}

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Aviation Compliance MVP",
        "status": "healthy",
        "version": "0.1.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "Service is running"}

@app.get("/compliance/models")
async def get_available_models():
    """Get available aircraft models"""
    return {
        "models": list(COMPLIANCE_DATA.keys()),
        "count": len(COMPLIANCE_DATA)
    }

@app.get("/compliance/authorities")
async def get_authorities():
    """Get available regulatory authorities"""
    return {
        "authorities": ["USA", "BRAZIL", "EUROPE"],
        "details": {
            "USA": "FAA - Federal Aviation Administration",
            "BRAZIL": "ANAC - Agência Nacional de Aviação Civil",
            "EUROPE": "EASA - European Union Aviation Safety Agency"
        }
    }

@app.get("/compliance/check/{model}/{country}")
async def check_compliance(model: str, country: str) -> ComplianceResponse:
    """Check compliance for specific aircraft model and country"""
    model_upper = model.upper()
    country_upper = country.upper()
    
    if model_upper not in COMPLIANCE_DATA:
        return ComplianceResponse(
            aircraft_model=model,
            country=country,
            status="error",
            compliant=False,
            message=f"Aircraft model '{model}' not supported"
        )
    
    if country_upper not in COMPLIANCE_DATA[model_upper]:
        return ComplianceResponse(
            aircraft_model=model,
            country=country,
            status="error", 
            compliant=False,
            message=f"Country '{country}' not supported"
        )
    
    compliance_info = COMPLIANCE_DATA[model_upper][country_upper]
    
    return ComplianceResponse(
        aircraft_model=model,
        country=country,
        status="success",
        compliant=compliance_info["compliant"],
        message=compliance_info["message"]
    )

@app.post("/compliance/check")
async def check_compliance_post(request: ComplianceRequest) -> ComplianceResponse:
    """Check compliance via POST request"""
    return await check_compliance(request.aircraft_model, request.country)

@app.get("/analytics/simple-metrics")
async def get_simple_metrics():
    """Simple analytics endpoint"""
    return {
        "total_models": len(COMPLIANCE_DATA),
        "total_authorities": 3,
        "compliance_rate": 100.0,
        "message": "MVP analytics - all models compliant"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)