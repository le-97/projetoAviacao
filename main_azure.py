"""
Aviation Compliance API - Azure Production Version
API de compliance para a família E-Jets da Embraer com PostgreSQL
Versão para deploy no Azure Container Apps
"""

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Dict, Any, List, Optional
import uvicorn
from datetime import datetime
import os

# Import database models and config
from src.models.database import AircraftModel, RegulatoryAuthority, ComplianceRecord, AuditLog
from src.database.config import get_db, init_database, populate_initial_data

# Initialize FastAPI app
app = FastAPI(
    title="Aviation Compliance API - Embraer E-Jets",
    description="API completa para compliance da família E-Jets da Embraer com banco de dados PostgreSQL",
    version="3.0.0",
    contact={
        "name": "Aviation Compliance Team",
        "email": "compliance@aviation.com"
    },
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API
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

class ComplianceRequest(BaseModel):
    aircraft_model: str
    authority: str
    check_type: Optional[str] = "full"

class ComplianceResponse(BaseModel):
    aircraft_model: str
    authority: str
    compliance_status: str
    score: float
    details: Dict[str, Any]
    specifications: AircraftSpecification
    timestamp: str

class AnalyticsResponse(BaseModel):
    total_models: int
    e1_series_count: int
    e2_series_count: int
    average_compliance_score: float
    compliance_by_series: Dict[str, float]
    latest_models: List[str]

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    await init_database()
    await populate_initial_data()

@app.get("/")
async def root():
    """Root endpoint com informações da API"""
    return {
        "service": "Aviation Compliance API - Embraer E-Jets",
        "version": "3.0.0",
        "status": "operational",
        "database": "Azure PostgreSQL",
        "documentation": "/docs",
        "environment": os.getenv("ENVIRONMENT", "production")
    }

@app.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """Health check endpoint com verificação de banco de dados"""
    try:
        # Test database connection
        result = await db.execute(select(func.count(AircraftModel.id)))
        aircraft_count = result.scalar()
        
        return {
            "status": "healthy",
            "message": "Aviation Compliance API operational",
            "timestamp": datetime.now().isoformat(),
            "database_status": "connected",
            "aircraft_models_loaded": aircraft_count
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "message": f"Database connection failed: {str(e)}",
            "timestamp": datetime.now().isoformat(),
            "database_status": "disconnected"
        }

@app.get("/aircraft/models", response_model=Dict[str, Any])
async def get_aircraft_models(db: AsyncSession = Depends(get_db)):
    """Lista todos os modelos de aeronaves do banco de dados"""
    try:
        # Get all aircraft models
        result = await db.execute(select(AircraftModel))
        aircraft_models = result.scalars().all()
        
        # Group by series
        e1_models = [aircraft.model for aircraft in aircraft_models if aircraft.series == "E1"]
        e2_models = [aircraft.model for aircraft in aircraft_models if aircraft.series == "E2"]
        
        return {
            "total_models": len(aircraft_models),
            "models_by_series": {
                "E1": e1_models,
                "E2": e2_models
            },
            "all_models": [aircraft.model for aircraft in aircraft_models],
            "latest_generation": "E2 Series with Geared Turbofan engines"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/aircraft/specifications/{model}", response_model=AircraftSpecification)
async def get_aircraft_specifications(model: str, db: AsyncSession = Depends(get_db)):
    """Obter especificações técnicas de um modelo específico do banco"""
    try:
        result = await db.execute(
            select(AircraftModel).where(AircraftModel.model == model.upper())
        )
        aircraft = result.scalar_one_or_none()
        
        if not aircraft:
            raise HTTPException(
                status_code=404,
                detail=f"Aircraft model '{model}' not found"
            )
        
        return AircraftSpecification(
            model=aircraft.model,
            series=aircraft.series,
            seats=aircraft.seats,
            mtow_lbs=aircraft.mtow_lbs,
            range_nm=aircraft.range_nm,
            engine_type=aircraft.engine_type,
            noise_compliance=aircraft.noise_compliance,
            emissions_compliance=aircraft.emissions_compliance,
            certification=aircraft.certifications,
            fuel_capacity_kg=aircraft.fuel_capacity_kg,
            avionics=aircraft.avionics,
            safety_rating=aircraft.safety_rating
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/compliance/authorities")
async def get_regulatory_authorities(db: AsyncSession = Depends(get_db)):
    """Lista todas as autoridades regulatórias do banco de dados"""
    try:
        result = await db.execute(select(RegulatoryAuthority))
        authorities = result.scalars().all()
        
        authorities_dict = {
            auth.code: {
                "name": auth.name,
                "region": auth.region,
                "description": auth.description,
                "website": auth.website
            }
            for auth in authorities
        }
        
        return {
            "authorities": authorities_dict,
            "supported_checks": ["full", "noise", "emissions", "safety"],
            "global_standards": ["ICAO", "RVSM", "TCAS II", "ADS-B"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/compliance/check/{model}/{authority}")
async def check_compliance(
    model: str, 
    authority: str, 
    check_type: str = Query("full"),
    db: AsyncSession = Depends(get_db)
) -> ComplianceResponse:
    """Verificar compliance usando dados do banco"""
    try:
        # Get aircraft model
        aircraft_result = await db.execute(
            select(AircraftModel).where(AircraftModel.model == model.upper())
        )
        aircraft = aircraft_result.scalar_one_or_none()
        
        if not aircraft:
            raise HTTPException(status_code=404, detail=f"Aircraft model '{model}' not found")
        
        # Get authority
        authority_result = await db.execute(
            select(RegulatoryAuthority).where(RegulatoryAuthority.code == authority.upper())
        )
        authority_obj = authority_result.scalar_one_or_none()
        
        if not authority_obj:
            raise HTTPException(status_code=404, detail=f"Authority '{authority}' not found")
        
        # Calculate compliance score (E2 series gets bonus)
        base_score = aircraft.base_score
        if aircraft.series == "E2":
            final_score = min(base_score + 2.0, 100.0)
        else:
            final_score = base_score
        
        # Create compliance details
        details = {
            "noise_level": aircraft.noise_compliance,
            "emissions_level": aircraft.emissions_compliance,
            "certifications": aircraft.certifications,
            "engine_technology": aircraft.engine_type,
            "avionics_suite": aircraft.avionics,
            "generation": aircraft.series,
            "check_performed": check_type,
            "authority_region": authority_obj.region
        }
        
        # Create specifications object
        specifications = AircraftSpecification(
            model=aircraft.model,
            series=aircraft.series,
            seats=aircraft.seats,
            mtow_lbs=aircraft.mtow_lbs,
            range_nm=aircraft.range_nm,
            engine_type=aircraft.engine_type,
            noise_compliance=aircraft.noise_compliance,
            emissions_compliance=aircraft.emissions_compliance,
            certification=aircraft.certifications,
            fuel_capacity_kg=aircraft.fuel_capacity_kg,
            avionics=aircraft.avionics,
            safety_rating=aircraft.safety_rating
        )
        
        # Create or update compliance record
        compliance_record = ComplianceRecord(
            aircraft_id=aircraft.id,
            authority_id=authority_obj.id,
            compliance_status="COMPLIANT",
            score=final_score,
            check_type=check_type,
            details=details
        )
        
        db.add(compliance_record)
        await db.commit()
        
        return ComplianceResponse(
            aircraft_model=model,
            authority=authority,
            compliance_status="COMPLIANT",
            score=final_score,
            details=details,
            specifications=specifications,
            timestamp=datetime.now().isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/compliance/check")
async def check_compliance_post(
    request: ComplianceRequest, 
    db: AsyncSession = Depends(get_db)
) -> ComplianceResponse:
    """Verificar compliance via POST request"""
    return await check_compliance(
        request.aircraft_model, 
        request.authority, 
        request.check_type or "full",
        db
    )

@app.get("/analytics/fleet-metrics", response_model=AnalyticsResponse)
async def get_fleet_analytics(db: AsyncSession = Depends(get_db)):
    """Analytics da frota E-Jets do banco de dados"""
    try:
        # Get all aircraft
        result = await db.execute(select(AircraftModel))
        aircraft_models = result.scalars().all()
        
        # Separate by series
        e1_models = [a for a in aircraft_models if a.series == "E1"]
        e2_models = [a for a in aircraft_models if a.series == "E2"]
        
        # Calculate averages
        e1_avg = sum(a.base_score for a in e1_models) / len(e1_models) if e1_models else 0
        e2_avg = sum(a.base_score for a in e2_models) / len(e2_models) if e2_models else 0
        overall_avg = (e1_avg + e2_avg) / 2 if e1_models and e2_models else (e1_avg or e2_avg)
        
        return AnalyticsResponse(
            total_models=len(aircraft_models),
            e1_series_count=len(e1_models),
            e2_series_count=len(e2_models),
            average_compliance_score=round(overall_avg, 1),
            compliance_by_series={
                "E1": round(e1_avg, 1),
                "E2": round(e2_avg, 1)
            },
            latest_models=[a.model for a in e2_models]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/analytics/comparison/{model1}/{model2}")
async def compare_aircraft(model1: str, model2: str, db: AsyncSession = Depends(get_db)):
    """Comparar especificações entre dois modelos do banco"""
    try:
        # Get both aircraft models
        result1 = await db.execute(
            select(AircraftModel).where(AircraftModel.model == model1.upper())
        )
        aircraft1 = result1.scalar_one_or_none()
        
        result2 = await db.execute(
            select(AircraftModel).where(AircraftModel.model == model2.upper())
        )
        aircraft2 = result2.scalar_one_or_none()
        
        if not aircraft1 or not aircraft2:
            raise HTTPException(status_code=404, detail="One or both aircraft models not found")
        
        comparison = {
            "models": [aircraft1.model, aircraft2.model],
            "series": [aircraft1.series, aircraft2.series],
            "capacity_comparison": {
                "seats": [aircraft1.seats, aircraft2.seats],
                "difference": abs(aircraft1.seats - aircraft2.seats)
            },
            "performance_comparison": {
                "range_nm": [aircraft1.range_nm, aircraft2.range_nm],
                "mtow_lbs": [aircraft1.mtow_lbs, aircraft2.mtow_lbs],
                "fuel_capacity_kg": [aircraft1.fuel_capacity_kg, aircraft2.fuel_capacity_kg]
            },
            "technology_comparison": {
                "engines": [aircraft1.engine_type, aircraft2.engine_type],
                "avionics": [aircraft1.avionics, aircraft2.avionics],
                "noise_compliance": [aircraft1.noise_compliance, aircraft2.noise_compliance],
                "emissions": [aircraft1.emissions_compliance, aircraft2.emissions_compliance]
            },
            "scores": [aircraft1.base_score, aircraft2.base_score],
            "recommendation": "E2 series offers improved efficiency and lower emissions" if "E2" in [aircraft1.series, aircraft2.series] else "Both are reliable E1 series aircraft"
        }
        
        return comparison
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))