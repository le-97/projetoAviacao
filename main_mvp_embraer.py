"""
Aviation Compliance API - Embraer E-Jets Family Complete Implementation
Desenvolvido para demonstrar MVP completo com todos os modelos da família E-Jets
Baseado na pesquisa TaskMaster sobre especificações técnicas da Embraer
"""

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uvicorn
from datetime import datetime

app = FastAPI(
    title="Aviation Compliance API - Embraer E-Jets",
    description="API completa para compliance da família E-Jets da Embraer (E1 e E2 Series)",
    version="2.0.0",
    contact={
        "name": "Aviation Compliance Team",
        "email": "compliance@aviation.com"
    }
)

# Modelos de dados
class AircraftSpecification(BaseModel):
    model: str
    series: str  # "E1" or "E2" 
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

# Base de dados completa da família E-Jets Embraer
# Dados baseados na pesquisa TaskMaster realizada
EMBRAER_AIRCRAFT_DB = {
    # E1 Series (Original E-Jets)
    "E170": {
        "model": "E170",
        "series": "E1", 
        "seats": 78,
        "mtow_lbs": 82011,
        "range_nm": 2150,
        "engine_type": "2 × GE CF34-8E (14,200 lbf)",
        "noise_compliance": "ICAO Chapter 4",
        "emissions_compliance": "Stage 3",
        "certification": ["FAA Part 25", "EASA CS-25", "ICAO Annex 16"],
        "fuel_capacity_kg": 9400,
        "avionics": "Honeywell Primus Epic",
        "safety_rating": "A",
        "base_score": 92.0,
        "icao_compliance": True,
        "faa_compliance": True,
        "easa_compliance": True,
        "anac_compliance": True
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
        "safety_rating": "A",
        "base_score": 95.0,
        "icao_compliance": True,
        "faa_compliance": True,
        "easa_compliance": True,
        "anac_compliance": True
    },
    "E190": {
        "model": "E190",
        "series": "E1", 
        "seats": 114,
        "mtow_lbs": 114199,
        "range_nm": 2400,
        "engine_type": "2 × GE CF34-10E (20,000 lbf)",
        "noise_compliance": "ICAO Chapter 4",
        "emissions_compliance": "Stage 3",
        "certification": ["FAA Part 25", "EASA CS-25", "ICAO Annex 16"],
        "fuel_capacity_kg": 13000,
        "avionics": "Honeywell Primus Epic",
        "safety_rating": "A", 
        "base_score": 94.0,
        "icao_compliance": True,
        "faa_compliance": True,
        "easa_compliance": True,
        "anac_compliance": True
    },
    "E195": {
        "model": "E195",
        "series": "E1",
        "seats": 124, 
        "mtow_lbs": 118000,
        "range_nm": 2300,
        "engine_type": "2 × GE CF34-10E (20,000 lbf)",
        "noise_compliance": "ICAO Chapter 4",
        "emissions_compliance": "Stage 3",
        "certification": ["FAA Part 25", "EASA CS-25", "ICAO Annex 16"],
        "fuel_capacity_kg": 13000,
        "avionics": "Honeywell Primus Epic",
        "safety_rating": "A",
        "base_score": 93.0,
        "icao_compliance": True,
        "faa_compliance": True,
        "easa_compliance": True,
        "anac_compliance": True
    },
    # E2 Series (Next Generation E-Jets)
    "E175-E2": {
        "model": "E175-E2",
        "series": "E2",
        "seats": 90,
        "mtow_lbs": 98767,
        "range_nm": 2060,
        "engine_type": "2 × PW1700G (Geared Turbofan)",
        "noise_compliance": "ICAO Chapter 14",
        "emissions_compliance": "Stage 5",
        "certification": ["FAA Part 25", "EASA CS-25", "ICAO Annex 16"],
        "fuel_capacity_kg": 9600,
        "avionics": "Honeywell Primus Epic 2 + Fly-by-wire",
        "safety_rating": "A+",
        "base_score": 97.0,
        "icao_compliance": True,
        "faa_compliance": True,
        "easa_compliance": True,
        "anac_compliance": True
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
        "safety_rating": "A+",
        "base_score": 98.0,
        "icao_compliance": True,
        "faa_compliance": True,
        "easa_compliance": True,
        "anac_compliance": True
    },
    "E195-E2": {
        "model": "E195-E2",
        "series": "E2",
        "seats": 146,
        "mtow_lbs": 133821,
        "range_nm": 2450,
        "engine_type": "2 × PW1900G (Geared Turbofan)",
        "noise_compliance": "ICAO Chapter 14",
        "emissions_compliance": "Stage 5",
        "certification": ["FAA Part 25", "EASA CS-25", "ICAO Annex 16"],
        "fuel_capacity_kg": 13500,
        "avionics": "Honeywell Primus Epic 2 + Fly-by-wire",
        "safety_rating": "A+",
        "base_score": 96.5,
        "icao_compliance": True,
        "faa_compliance": True,
        "easa_compliance": True,
        "anac_compliance": True
    }
}

# Mapeamento de autoridades regulatórias
REGULATORY_AUTHORITIES = {
    "FAA": {"name": "Federal Aviation Administration", "region": "USA"},
    "EASA": {"name": "European Union Aviation Safety Agency", "region": "Europe"},
    "ANAC": {"name": "Agência Nacional de Aviação Civil", "region": "Brazil"},
    "ICAO": {"name": "International Civil Aviation Organization", "region": "Global"}
}

@app.get("/")
async def root():
    """Root endpoint com informações da API"""
    return {
        "service": "Aviation Compliance API - Embraer E-Jets",
        "version": "2.0.0",
        "status": "operational",
        "aircraft_count": len(EMBRAER_AIRCRAFT_DB),
        "supported_series": ["E1 (Original)", "E2 (Next Generation)"],
        "documentation": "/docs",
        "research_source": "TaskMaster Research - Embraer E-Jets Family"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy", 
        "message": "Aviation Compliance API operational",
        "timestamp": datetime.now().isoformat(),
        "database_status": "loaded",
        "models_available": len(EMBRAER_AIRCRAFT_DB)
    }

@app.get("/aircraft/models", response_model=Dict[str, Any])
async def get_aircraft_models():
    """Lista todos os modelos de aeronaves disponíveis"""
    models_by_series = {
        "E1": [model for model, data in EMBRAER_AIRCRAFT_DB.items() if data["series"] == "E1"],
        "E2": [model for model, data in EMBRAER_AIRCRAFT_DB.items() if data["series"] == "E2"]
    }
    
    return {
        "total_models": len(EMBRAER_AIRCRAFT_DB),
        "models_by_series": models_by_series,
        "all_models": list(EMBRAER_AIRCRAFT_DB.keys()),
        "latest_generation": "E2 Series with Geared Turbofan engines"
    }

@app.get("/aircraft/specifications/{model}", response_model=AircraftSpecification)
async def get_aircraft_specifications(model: str):
    """Obter especificações técnicas de um modelo específico"""
    model_upper = model.upper()
    
    if model_upper not in EMBRAER_AIRCRAFT_DB:
        raise HTTPException(
            status_code=404, 
            detail=f"Aircraft model '{model}' not found. Available models: {list(EMBRAER_AIRCRAFT_DB.keys())}"
        )
    
    data = EMBRAER_AIRCRAFT_DB[model_upper]
    
    return AircraftSpecification(
        model=data["model"],
        series=data["series"],
        seats=data["seats"],
        mtow_lbs=data["mtow_lbs"],
        range_nm=data["range_nm"],
        engine_type=data["engine_type"],
        noise_compliance=data["noise_compliance"],
        emissions_compliance=data["emissions_compliance"],
        certification=data["certification"],
        fuel_capacity_kg=data["fuel_capacity_kg"],
        avionics=data["avionics"],
        safety_rating=data["safety_rating"]
    )

@app.get("/compliance/authorities")
async def get_regulatory_authorities():
    """Lista todas as autoridades regulatórias suportadas"""
    return {
        "authorities": REGULATORY_AUTHORITIES,
        "supported_checks": ["full", "noise", "emissions", "safety"],
        "global_standards": ["ICAO", "RVSM", "TCAS II", "ADS-B"]
    }

@app.get("/compliance/check/{model}/{authority}")
async def check_compliance(model: str, authority: str, check_type: str = Query("full")) -> ComplianceResponse:
    """Verificar compliance de um modelo para uma autoridade específica"""
    model_upper = model.upper()
    authority_upper = authority.upper()
    
    if model_upper not in EMBRAER_AIRCRAFT_DB:
        raise HTTPException(
            status_code=404,
            detail=f"Aircraft model '{model}' not found"
        )
    
    if authority_upper not in REGULATORY_AUTHORITIES:
        raise HTTPException(
            status_code=404,
            detail=f"Authority '{authority}' not supported"
        )
    
    aircraft_data = EMBRAER_AIRCRAFT_DB[model_upper]
    authority_lower = authority_upper.lower()
    compliance_field = f"{authority_lower}_compliance"
    
    # Verificar compliance específica
    is_compliant = aircraft_data.get(compliance_field, True)
    base_score = aircraft_data["base_score"]
    
    # Ajustar score baseado na série (E2 tem scores mais altos)
    if aircraft_data["series"] == "E2":
        final_score = min(base_score + 2.0, 100.0)  # E2 series bonus
    else:
        final_score = base_score
    
    # Detalhes específicos do check
    details = {
        "noise_level": aircraft_data["noise_compliance"],
        "emissions_level": aircraft_data["emissions_compliance"],
        "certifications": aircraft_data["certification"],
        "engine_technology": aircraft_data["engine_type"],
        "avionics_suite": aircraft_data["avionics"],
        "generation": aircraft_data["series"],
        "check_performed": check_type
    }
    
    if check_type == "noise":
        details["noise_margin"] = "Exceeds requirements" if aircraft_data["series"] == "E2" else "Meets requirements"
    elif check_type == "emissions":
        details["co2_efficiency"] = "Best in class" if aircraft_data["series"] == "E2" else "Industry standard"
    
    # Criar especificações para resposta
    specifications = AircraftSpecification(
        model=aircraft_data["model"],
        series=aircraft_data["series"],
        seats=aircraft_data["seats"],
        mtow_lbs=aircraft_data["mtow_lbs"],
        range_nm=aircraft_data["range_nm"],
        engine_type=aircraft_data["engine_type"],
        noise_compliance=aircraft_data["noise_compliance"],
        emissions_compliance=aircraft_data["emissions_compliance"],
        certification=aircraft_data["certification"],
        fuel_capacity_kg=aircraft_data["fuel_capacity_kg"],
        avionics=aircraft_data["avionics"],
        safety_rating=aircraft_data["safety_rating"]
    )
    
    return ComplianceResponse(
        aircraft_model=model,
        authority=authority,
        compliance_status="COMPLIANT" if is_compliant else "NON_COMPLIANT",
        score=final_score,
        details=details,
        specifications=specifications,
        timestamp=datetime.now().isoformat()
    )

@app.post("/compliance/check")
async def check_compliance_post(request: ComplianceRequest) -> ComplianceResponse:
    """Verificar compliance via POST request"""
    return await check_compliance(
        request.aircraft_model, 
        request.authority, 
        request.check_type or "full"
    )

@app.get("/analytics/fleet-metrics", response_model=AnalyticsResponse)
async def get_fleet_analytics():
    """Analytics avançadas da frota E-Jets"""
    e1_models = [model for model, data in EMBRAER_AIRCRAFT_DB.items() if data["series"] == "E1"]
    e2_models = [model for model, data in EMBRAER_AIRCRAFT_DB.items() if data["series"] == "E2"]
    
    # Calcular scores médios
    e1_avg = sum(data["base_score"] for data in EMBRAER_AIRCRAFT_DB.values() if data["series"] == "E1") / len(e1_models)
    e2_avg = sum(data["base_score"] for data in EMBRAER_AIRCRAFT_DB.values() if data["series"] == "E2") / len(e2_models)
    overall_avg = (e1_avg + e2_avg) / 2
    
    return AnalyticsResponse(
        total_models=len(EMBRAER_AIRCRAFT_DB),
        e1_series_count=len(e1_models),
        e2_series_count=len(e2_models),
        average_compliance_score=round(overall_avg, 1),
        compliance_by_series={
            "E1": round(e1_avg, 1),
            "E2": round(e2_avg, 1)
        },
        latest_models=e2_models
    )

@app.get("/analytics/comparison/{model1}/{model2}")
async def compare_aircraft(model1: str, model2: str):
    """Comparar especificações entre dois modelos"""
    model1_upper = model1.upper()
    model2_upper = model2.upper()
    
    if model1_upper not in EMBRAER_AIRCRAFT_DB or model2_upper not in EMBRAER_AIRCRAFT_DB:
        raise HTTPException(status_code=404, detail="One or both aircraft models not found")
    
    data1 = EMBRAER_AIRCRAFT_DB[model1_upper]
    data2 = EMBRAER_AIRCRAFT_DB[model2_upper]
    
    comparison = {
        "models": [model1, model2],
        "series": [data1["series"], data2["series"]],
        "capacity_comparison": {
            "seats": [data1["seats"], data2["seats"]],
            "difference": abs(data1["seats"] - data2["seats"])
        },
        "performance_comparison": {
            "range_nm": [data1["range_nm"], data2["range_nm"]],
            "mtow_lbs": [data1["mtow_lbs"], data2["mtow_lbs"]],
            "fuel_capacity_kg": [data1["fuel_capacity_kg"], data2["fuel_capacity_kg"]]
        },
        "technology_comparison": {
            "engines": [data1["engine_type"], data2["engine_type"]],
            "avionics": [data1["avionics"], data2["avionics"]],
            "noise_compliance": [data1["noise_compliance"], data2["noise_compliance"]],
            "emissions": [data1["emissions_compliance"], data2["emissions_compliance"]]
        },
        "scores": [data1["base_score"], data2["base_score"]],
        "recommendation": "E2 series offers improved efficiency and lower emissions" if "E2" in [data1["series"], data2["series"]] else "Both are reliable E1 series aircraft"
    }
    
    return comparison

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)