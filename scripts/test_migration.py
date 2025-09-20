"""
Test script for data migration - creates SQLite database for testing.
"""

import json
import asyncio
import sys
import os
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import text

from src.models.db_models import Base
from src.repositories import AuthorityRepository, AircraftModelRepository, RegulationRepository
from src.config import settings


async def create_test_database():
    """Create SQLite database for testing migration."""
    # Use SQLite for testing
    test_engine = create_async_engine(
        "sqlite+aiosqlite:///./test_compliance.db",
        echo=True
    )
    
    # Create all tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    return test_engine


async def test_migration():
    """Test the data migration process."""
    print("Creating test database...")
    engine = await create_test_database()
    
    AsyncTestSession = async_sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False
    )
    
    async with AsyncTestSession() as session:
        try:
            # Test authority creation
            print("\nTesting authority creation...")
            authority_repo = AuthorityRepository(session)
            
            anac = await authority_repo.create(
                code="ANAC",
                name="Agência Nacional de Aviação Civil",
                country="BRA",
                website="https://www.anac.gov.br"
            )
            print(f"Created: {anac.name} ({anac.code})")
            
            faa = await authority_repo.create(
                code="FAA",
                name="Federal Aviation Administration", 
                country="USA",
                website="https://www.faa.gov"
            )
            print(f"Created: {faa.name} ({faa.code})")
            
            # Test aircraft model creation
            print("\nTesting aircraft model creation...")
            aircraft_repo = AircraftModelRepository(session)
            
            e190 = await aircraft_repo.create(
                manufacturer="Embraer",
                model="E190",
                variant="E190-E2",
                type_certificate="TC-E190",
                category="Transport",
                max_seats=114,
                max_weight_kg=56000
            )
            print(f"Created: {e190.manufacturer} {e190.model}")
            
            # Test regulation creation
            print("\nTesting regulation creation...")
            regulation_repo = RegulationRepository(session)
            
            regulation = await regulation_repo.create(
                authority_id=anac.id,
                reference="RBAC 121.445",
                title="Emergency Equipment Requirements",
                description="Requirements for emergency equipment on transport category aircraft",
                category="Emergency Equipment",
                status="active"
            )
            print(f"Created: {regulation.reference} - {regulation.title}")
            
            # Test queries
            print("\nTesting queries...")
            
            # Get authority by code
            found_anac = await authority_repo.get_by_code("ANAC")
            print(f"Found authority: {found_anac.name if found_anac else 'Not found'}")
            
            # Get aircraft by manufacturer
            embraer_aircraft = await aircraft_repo.get_by_manufacturer("Embraer")
            print(f"Found {len(embraer_aircraft)} Embraer aircraft")
            
            # Get regulations by authority
            anac_regulations = await regulation_repo.get_by_authority(anac.id)
            print(f"Found {len(anac_regulations)} ANAC regulations")
            
            # Test JSON data migration if file exists
            regulations_file = project_root / "src" / "data" / "regulations.json"
            if regulations_file.exists():
                print(f"\nTesting JSON migration from {regulations_file}...")
                with open(regulations_file, "r") as f:
                    regulations_json = json.load(f)
                
                print(f"Found {len(regulations_json)} regulations in JSON file")
                
                # Migrate first regulation as test
                if regulations_json:
                    first_reg = regulations_json[0]
                    try:
                        test_reg = await regulation_repo.create(
                            authority_id=anac.id,  # Use ANAC for test
                            reference=first_reg.get("reference", "TEST-001"),
                            title=first_reg.get("title", first_reg["description"][:50]),
                            description=first_reg["description"],
                            category=first_reg.get("category", "General"),
                            status="active",
                            content={"original": first_reg}
                        )
                        print(f"Migrated regulation: {test_reg.reference}")
                    except Exception as e:
                        print(f"Error migrating regulation: {e}")
            
            await session.commit()
            print("\n✅ Migration test completed successfully!")
            
        except Exception as e:
            print(f"\n❌ Migration test failed: {e}")
            await session.rollback()
            raise
        finally:
            await engine.dispose()


if __name__ == "__main__":
    asyncio.run(test_migration())