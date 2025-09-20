"""
Data migration script to populate PostgreSQL from existing JSON data.
"""

import json
import asyncio
from datetime import datetime
from uuid import uuid4
from sqlalchemy.ext.asyncio import AsyncSession

from src.db.session import AsyncSessionLocal
from src.models.db_models import Authority, AircraftModel, Regulation
from src.repositories import AuthorityRepository, AircraftModelRepository, RegulationRepository


async def migrate_authorities(session: AsyncSession):
    """Migrate authority data to PostgreSQL."""
    authority_repo = AuthorityRepository(session)
    
    authorities_data = [
        {
            "code": "ANAC",
            "name": "Agência Nacional de Aviação Civil",
            "country": "BRA",
            "website": "https://www.anac.gov.br"
        },
        {
            "code": "FAA", 
            "name": "Federal Aviation Administration",
            "country": "USA",
            "website": "https://www.faa.gov"
        },
        {
            "code": "EASA",
            "name": "European Union Aviation Safety Agency", 
            "country": "EUR",
            "website": "https://www.easa.europa.eu"
        }
    ]
    
    print("Migrating authorities...")
    for auth_data in authorities_data:
        try:
            existing = await authority_repo.get_by_code(auth_data["code"])
            if not existing:
                authority = await authority_repo.create(**auth_data)
                print(f"Created authority: {authority.name}")
            else:
                print(f"Authority {auth_data['code']} already exists")
        except Exception as e:
            print(f"Error creating authority {auth_data['code']}: {e}")


async def migrate_aircraft_models(session: AsyncSession):
    """Migrate aircraft model data to PostgreSQL."""
    aircraft_repo = AircraftModelRepository(session)
    
    aircraft_data = [
        {
            "manufacturer": "Embraer",
            "model": "E190",
            "variant": "E190-E2",
            "type_certificate": "TC-E190",
            "category": "Transport",
            "max_seats": 114,
            "max_weight_kg": 56000
        },
        {
            "manufacturer": "Embraer", 
            "model": "E195",
            "variant": "E195-E2",
            "type_certificate": "TC-E195",
            "category": "Transport", 
            "max_seats": 146,
            "max_weight_kg": 61500
        },
        {
            "manufacturer": "Boeing",
            "model": "737",
            "variant": "737-800",
            "type_certificate": "TC-737",
            "category": "Transport",
            "max_seats": 189,
            "max_weight_kg": 79015
        },
        {
            "manufacturer": "Airbus",
            "model": "A320",
            "variant": "A320neo",
            "type_certificate": "TC-A320",
            "category": "Transport",
            "max_seats": 195,
            "max_weight_kg": 79000
        }
    ]
    
    print("Migrating aircraft models...")
    for aircraft in aircraft_data:
        try:
            existing = await aircraft_repo.get_by_manufacturer_and_model(
                aircraft["manufacturer"], aircraft["model"]
            )
            if not existing:
                model = await aircraft_repo.create(**aircraft)
                print(f"Created aircraft model: {model.manufacturer} {model.model}")
            else:
                print(f"Aircraft model {aircraft['manufacturer']} {aircraft['model']} already exists")
        except Exception as e:
            print(f"Error creating aircraft model {aircraft['manufacturer']} {aircraft['model']}: {e}")


async def migrate_regulations(session: AsyncSession):
    """Migrate regulation data from JSON file to PostgreSQL."""
    regulation_repo = RegulationRepository(session)
    authority_repo = AuthorityRepository(session)
    
    # Load existing regulations from JSON
    try:
        with open("src/data/regulations.json", "r") as f:
            regulations_json = json.load(f)
    except FileNotFoundError:
        print("Regulations JSON file not found, skipping...")
        return
    
    print("Migrating regulations...")
    for reg_data in regulations_json:
        try:
            # Get authority by code
            authority = await authority_repo.get_by_code(reg_data["authority"])
            if not authority:
                print(f"Authority {reg_data['authority']} not found, skipping regulation")
                continue
            
            # Check if regulation already exists
            existing = await regulation_repo.get_by_reference(reg_data.get("reference", ""))
            if existing:
                print(f"Regulation {reg_data.get('reference', 'N/A')} already exists")
                continue
            
            # Create regulation
            regulation_data = {
                "authority_id": authority.id,
                "reference": reg_data.get("reference", f"REG-{uuid4().hex[:8]}"),
                "title": reg_data.get("title", reg_data["description"][:100]),
                "description": reg_data["description"],
                "category": reg_data.get("category", "General"),
                "subcategory": reg_data.get("subcategory"),
                "status": "active",
                "content": {
                    "applicability": reg_data.get("applicability", []),
                    "original_data": reg_data
                }
            }
            
            regulation = await regulation_repo.create(**regulation_data)
            print(f"Created regulation: {regulation.reference}")
            
        except Exception as e:
            print(f"Error creating regulation: {e}")


async def create_sample_data(session: AsyncSession):
    """Create additional sample data for testing."""
    regulation_repo = RegulationRepository(session)
    authority_repo = AuthorityRepository(session)
    
    # Get authorities
    anac = await authority_repo.get_by_code("ANAC")
    faa = await authority_repo.get_by_code("FAA") 
    easa = await authority_repo.get_by_code("EASA")
    
    sample_regulations = [
        {
            "authority_id": anac.id if anac else None,
            "reference": "RBAC 121.445",
            "title": "Emergency Equipment Requirements",
            "description": "Requirements for emergency equipment on transport category aircraft",
            "category": "Emergency Equipment",
            "status": "active"
        },
        {
            "authority_id": faa.id if faa else None, 
            "reference": "14 CFR 25.562",
            "title": "Emergency Landing Dynamic Conditions",
            "description": "Dynamic conditions for emergency landing tests", 
            "category": "Structural",
            "status": "active"
        },
        {
            "authority_id": easa.id if easa else None,
            "reference": "CS-25.1309",
            "title": "Equipment, Systems, and Installations",
            "description": "Requirements for aircraft systems and equipment installations",
            "category": "Systems",
            "status": "active"
        }
    ]
    
    print("Creating sample regulations...")
    for reg_data in sample_regulations:
        if not reg_data["authority_id"]:
            continue
            
        try:
            existing = await regulation_repo.get_by_reference(reg_data["reference"])
            if not existing:
                regulation = await regulation_repo.create(**reg_data)
                print(f"Created sample regulation: {regulation.reference}")
            else:
                print(f"Sample regulation {reg_data['reference']} already exists")
        except Exception as e:
            print(f"Error creating sample regulation {reg_data['reference']}: {e}")


async def main():
    """Run all migrations."""
    print("Starting data migration to PostgreSQL...")
    
    async with AsyncSessionLocal() as session:
        try:
            await migrate_authorities(session)
            await migrate_aircraft_models(session)
            await migrate_regulations(session)
            await create_sample_data(session)
            
            print("Data migration completed successfully!")
            
        except Exception as e:
            print(f"Migration failed: {e}")
            await session.rollback()
            raise
        else:
            await session.commit()


if __name__ == "__main__":
    asyncio.run(main())