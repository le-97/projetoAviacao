"""
Verificar dados na base de dados.
"""

import asyncio
import sys
import os

# Add src to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.repositories.aircraft_model import AircraftModelRepository
from src.database import AsyncSessionLocal, create_tables


async def check_database_data():
    """Verificar dados na base."""
    print("🔍 Verificando dados na base...")
    
    await create_tables()
    
    async with AsyncSessionLocal() as session:
        repo = AircraftModelRepository(session)
        
        # Listar todos os aircraft
        aircraft = await repo.get_all()
        print(f"\n📋 {len(aircraft)} aircraft models na base:")
        
        for ac in aircraft:
            print(f"   - ID: {ac.id}")
            print(f"     Manufacturer: {ac.manufacturer}")
            print(f"     Model: {ac.model}")
            print(f"     Variant: {ac.variant}")
            print(f"     Full: {ac.manufacturer} {ac.model} {ac.variant or ''}")
            print()
        
        # Tentar buscar E175-E2 de diferentes formas
        print("🔍 Buscando E175-E2 de diferentes formas:")
        
        # Busca exata por model
        result1 = await repo.get_by_model("E175-E2")
        print(f"   Por model='E175-E2': {len(result1)} resultados")
        
        # Busca por model E175
        result2 = await repo.get_by_model("E175")
        print(f"   Por model='E175': {len(result2)} resultados")
        if result2:
            for ac in result2:
                print(f"     - {ac.model} {ac.variant}")
        
        # Busca por manufacturer e model
        result3 = await repo.get_by_manufacturer_and_model("Embraer", "E175")
        print(f"   Por manufacturer='Embraer', model='E175': {len(result3)} resultados")
        if result3:
            for ac in result3:
                print(f"     - {ac.model} {ac.variant}")


if __name__ == "__main__":
    asyncio.run(check_database_data())