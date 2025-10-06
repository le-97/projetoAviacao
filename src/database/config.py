"""
Database configuration and connection management
Configuração de banco de dados para Azure PostgreSQL
"""

import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from contextlib import asynccontextmanager
from typing import AsyncGenerator

# Try PostgreSQL first, fallback to SQLite
AZURE_DATABASE_URL = os.getenv("AZURE_DATABASE_URL")
POSTGRES_URL = os.getenv("DATABASE_URL")

if AZURE_DATABASE_URL:
    DATABASE_URL = AZURE_DATABASE_URL
elif POSTGRES_URL:
    DATABASE_URL = POSTGRES_URL
else:
    # Fallback to SQLite for initial deployment
    DATABASE_URL = "sqlite+aiosqlite:///./aviation_compliance.db"

print(f"Using database: {'PostgreSQL' if 'postgresql' in DATABASE_URL else 'SQLite'}")

# Create async engine
if "sqlite" in DATABASE_URL:
    engine = create_async_engine(
        DATABASE_URL,
        echo=False,
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_async_engine(
        DATABASE_URL,
        echo=False,
        pool_size=20,
        max_overflow=0,
        pool_pre_ping=True,
        pool_recycle=300,
    )

# Create async session factory
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

@asynccontextmanager
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency to get database session
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def init_database():
    """
    Initialize database tables
    """
    from src.models.database import Base
    
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)

async def populate_initial_data():
    """
    Populate database with initial Embraer aircraft data
    """
    from src.models.database import AircraftModel, RegulatoryAuthority
    
    async with get_db() as db:
        # Check if data already exists
        from sqlalchemy import select
        result = await db.execute(select(AircraftModel))
        existing_aircraft = result.scalars().first()
        
        if existing_aircraft:
            return  # Data already exists
            
        print("Populating initial data...")
        
        # Create regulatory authorities
        authorities = [
            RegulatoryAuthority(
                code="FAA",
                name="Federal Aviation Administration",
                region="USA",
                description="The Federal Aviation Administration of the United States",
                website="https://www.faa.gov"
            ),
            RegulatoryAuthority(
                code="EASA",
                name="European Union Aviation Safety Agency",
                region="Europe",
                description="The aviation safety agency of the European Union",
                website="https://www.easa.europa.eu"
            ),
            RegulatoryAuthority(
                code="ANAC",
                name="Agência Nacional de Aviação Civil",
                region="Brazil",
                description="The civil aviation authority of Brazil",
                website="https://www.anac.gov.br"
            ),
            RegulatoryAuthority(
                code="ICAO",
                name="International Civil Aviation Organization",
                region="Global",
                description="A specialized agency of the United Nations",
                website="https://www.icao.int"
            )
        ]
        
        for authority in authorities:
            db.add(authority)
        
        # Create Embraer aircraft models
        aircraft_models = [
            # E1 Series (Original)
            AircraftModel(
                model="E170",
                series="E1",
                seats=78,
                mtow_lbs=82011,
                range_nm=2150,
                fuel_capacity_kg=9400,
                engine_type="2 × GE CF34-8E (14,200 lbf)",
                avionics="Honeywell Primus Epic",
                noise_compliance="ICAO Chapter 4",
                emissions_compliance="Stage 3",
                safety_rating="A",
                base_score=92.0,
                certifications=["FAA Part 25", "EASA CS-25", "ICAO Annex 16"]
            ),
            AircraftModel(
                model="E175",
                series="E1",
                seats=88,
                mtow_lbs=89000,
                range_nm=2200,
                fuel_capacity_kg=9400,
                engine_type="2 × GE CF34-8E (14,200 lbf)",
                avionics="Honeywell Primus Epic",
                noise_compliance="ICAO Chapter 4",
                emissions_compliance="Stage 3",
                safety_rating="A",
                base_score=95.0,
                certifications=["FAA Part 25", "EASA CS-25", "ICAO Annex 16"]
            ),
            AircraftModel(
                model="E190",
                series="E1",
                seats=114,
                mtow_lbs=114199,
                range_nm=2400,
                fuel_capacity_kg=13000,
                engine_type="2 × GE CF34-10E (20,000 lbf)",
                avionics="Honeywell Primus Epic",
                noise_compliance="ICAO Chapter 4",
                emissions_compliance="Stage 3",
                safety_rating="A",
                base_score=94.0,
                certifications=["FAA Part 25", "EASA CS-25", "ICAO Annex 16"]
            ),
            AircraftModel(
                model="E195",
                series="E1",
                seats=124,
                mtow_lbs=118000,
                range_nm=2300,
                fuel_capacity_kg=13000,
                engine_type="2 × GE CF34-10E (20,000 lbf)",
                avionics="Honeywell Primus Epic",
                noise_compliance="ICAO Chapter 4",
                emissions_compliance="Stage 3",
                safety_rating="A",
                base_score=93.0,
                certifications=["FAA Part 25", "EASA CS-25", "ICAO Annex 16"]
            ),
            # E2 Series (Next Generation)
            AircraftModel(
                model="E175-E2",
                series="E2",
                seats=90,
                mtow_lbs=98767,
                range_nm=2060,
                fuel_capacity_kg=9600,
                engine_type="2 × PW1700G (Geared Turbofan)",
                avionics="Honeywell Primus Epic 2 + Fly-by-wire",
                noise_compliance="ICAO Chapter 14",
                emissions_compliance="Stage 5",
                safety_rating="A+",
                base_score=97.0,
                certifications=["FAA Part 25", "EASA CS-25", "ICAO Annex 16"]
            ),
            AircraftModel(
                model="E190-E2",
                series="E2",
                seats=114,
                mtow_lbs=124341,
                range_nm=2850,
                fuel_capacity_kg=13500,
                engine_type="2 × PW1900G (Geared Turbofan)",
                avionics="Honeywell Primus Epic 2 + Fly-by-wire",
                noise_compliance="ICAO Chapter 14",
                emissions_compliance="Stage 5",
                safety_rating="A+",
                base_score=98.0,
                certifications=["FAA Part 25", "EASA CS-25", "ICAO Annex 16"]
            ),
            AircraftModel(
                model="E195-E2",
                series="E2",
                seats=146,
                mtow_lbs=133821,
                range_nm=2450,
                fuel_capacity_kg=13500,
                engine_type="2 × PW1900G (Geared Turbofan)",
                avionics="Honeywell Primus Epic 2 + Fly-by-wire",
                noise_compliance="ICAO Chapter 14",
                emissions_compliance="Stage 5",
                safety_rating="A+",
                base_score=96.5,
                certifications=["FAA Part 25", "EASA CS-25", "ICAO Annex 16"]
            )
        ]
        
        for aircraft in aircraft_models:
            db.add(aircraft)
        
        await db.commit()
        print(f"Populated {len(aircraft_models)} aircraft models and {len(authorities)} authorities")