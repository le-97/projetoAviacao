"""
Script to add new aircraft models E175 and E-Jets E2 series.
"""

import asyncio
from src.db.session import AsyncSessionLocal
from src.repositories import AircraftModelRepository


async def add_new_aircraft_models():
    """Add E175 and E-Jets E2 series to database."""
    print("🚁 Adding new aircraft models: E175 and E-Jets E2 series...")
    
    new_aircraft_data = [
        {
            "manufacturer": "Embraer",
            "model": "E175",
            "variant": "E175-E1",
            "type_certificate": "TC-E175",
            "category": "Transport",
            "max_seats": 88,
            "max_weight_kg": 38790
        },
        {
            "manufacturer": "Embraer",
            "model": "E175",
            "variant": "E175-E2",
            "type_certificate": "TC-E175-E2",
            "category": "Transport",
            "max_seats": 90,
            "max_weight_kg": 41050
        },
        {
            "manufacturer": "Embraer",
            "model": "E190",
            "variant": "E190-E1",
            "type_certificate": "TC-E190-E1",
            "category": "Transport",
            "max_seats": 114,
            "max_weight_kg": 51800
        },
        {
            "manufacturer": "Embraer",
            "model": "E195",
            "variant": "E195-E1",
            "type_certificate": "TC-E195-E1",
            "category": "Transport",
            "max_seats": 122,
            "max_weight_kg": 52290
        }
    ]
    
    async with AsyncSessionLocal() as session:
        aircraft_repo = AircraftModelRepository(session)
        
        for aircraft in new_aircraft_data:
            try:
                # Check if already exists
                existing = await aircraft_repo.get_by_manufacturer_and_model(
                    aircraft["manufacturer"], aircraft["model"]
                )
                
                # Check if this specific variant exists
                variant_exists = any(
                    existing_aircraft.variant == aircraft["variant"] 
                    for existing_aircraft in existing
                )
                
                if not variant_exists:
                    model = await aircraft_repo.create(**aircraft)
                    print(f"✓ Added: {model.manufacturer} {model.model} ({model.variant})")
                else:
                    print(f"⚠ Already exists: {aircraft['manufacturer']} {aircraft['model']} ({aircraft['variant']})")
                    
            except Exception as e:
                print(f"✗ Error adding {aircraft['manufacturer']} {aircraft['model']} ({aircraft['variant']}): {e}")
        
        await session.commit()
        print("✅ New aircraft models added successfully!")


if __name__ == "__main__":
    asyncio.run(add_new_aircraft_models())