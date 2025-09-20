"""
Test script to validate SQLite database and repository functionality.
"""

import asyncio
from src.db.session import AsyncSessionLocal
from src.repositories import AuthorityRepository, AircraftModelRepository, RegulationRepository


async def test_database():
    """Test database connectivity and basic operations."""
    print("🧪 Testing database connectivity and repositories...")
    
    async with AsyncSessionLocal() as session:
        # Test Authority repository
        authority_repo = AuthorityRepository(session)
        authorities = await authority_repo.get_all()
        print(f"✓ Found {len(authorities)} authorities in database")
        
        for authority in authorities:
            print(f"  - {authority.code}: {authority.name}")
        
        # Test Aircraft Model repository
        aircraft_repo = AircraftModelRepository(session)
        aircraft_models = await aircraft_repo.get_all()
        print(f"✓ Found {len(aircraft_models)} aircraft models in database")
        
        for aircraft in aircraft_models:
            print(f"  - {aircraft.manufacturer} {aircraft.model} ({aircraft.variant})")
        
        # Test Regulation repository
        regulation_repo = RegulationRepository(session)
        regulations = await regulation_repo.get_all()
        print(f"✓ Found {len(regulations)} regulations in database")
        
        for regulation in regulations[:3]:  # Show first 3
            print(f"  - {regulation.reference}: {regulation.title[:50]}...")
        
        # Test specific queries
        anac = await authority_repo.get_by_code("ANAC")
        if anac:
            print(f"✓ Successfully retrieved ANAC: {anac.name}")
            
            # Get regulations by authority
            anac_regulations = await regulation_repo.get_by_authority(anac.id)
            print(f"✓ ANAC has {len(anac_regulations)} regulations")
        
        # Test aircraft model lookup
        embraer_e190_list = await aircraft_repo.get_by_manufacturer_and_model("Embraer", "E190")
        if embraer_e190_list:
            embraer_e190 = embraer_e190_list[0]  # Get first result
            print(f"✓ Successfully retrieved Embraer E190: {embraer_e190.variant}")
        
        print("✅ Database test completed successfully!")
        return True


if __name__ == "__main__":
    asyncio.run(test_database())