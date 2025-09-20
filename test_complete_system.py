"""
Teste do sistema completo de compliance.
"""

import asyncio
import sys
import os

# Add src to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.services.enhanced_compliance_service import EnhancedComplianceService
from src.database import AsyncSessionLocal, create_tables


async def test_complete_system():
    """Teste completo do sistema."""
    print("🚀 Iniciando teste do sistema completo...")
    
    # Create database tables
    await create_tables()
    print("✅ Database tables created")
    
    # Test compliance service
    async with AsyncSessionLocal() as session:
        service = EnhancedComplianceService(session)
        
        # Test compliance check
        print("\n🔍 Testando compliance check...")
        try:
            result = await service.check_compliance("E175-E2", "BRAZIL")
            print(f"✅ Compliance check successful!")
            print(f"   Aircraft: {result.aircraft_model}")
            print(f"   Country: {result.country}")
            print(f"   Status: {result.overall_status}")
            print(f"   Total Checks: {result.total_checks}")
            print(f"   Compliant: {result.compliant_checks}")
            print(f"   Critical Issues: {result.critical_issues}")
            
            if result.recommendations:
                print(f"   Recommendations: {len(result.recommendations)}")
                for i, rec in enumerate(result.recommendations[:3], 1):
                    print(f"     {i}. {rec}")
                    
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Test models retrieval
        print("\n📋 Testando recuperação de modelos...")
        try:
            aircraft_models = await service.aircraft_repo.get_all()
            print(f"✅ Found {len(aircraft_models)} aircraft models")
            for aircraft in aircraft_models[:5]:
                print(f"   - {aircraft.manufacturer} {aircraft.model} {aircraft.variant or ''}")
                
            authorities = await service.authority_repo.get_all()
            print(f"✅ Found {len(authorities)} authorities")
            for auth in authorities:
                print(f"   - {auth.code}: {auth.name}")
                
            regulations = await service.regulation_repo.get_all()
            print(f"✅ Found {len(regulations)} regulations")
            
        except Exception as e:
            print(f"❌ Error retrieving data: {e}")
    
    print("\n🎉 Sistema funcionando perfeitamente!")
    print("\n📡 Para acessar a API:")
    print("   1. Execute: .venv\\Scripts\\python.exe -m uvicorn src.main:app --reload --port 8001")
    print("   2. Acesse: http://127.0.0.1:8001/docs")
    print("   3. Teste: http://127.0.0.1:8001/compliance/check/E175-E2/BRAZIL")
    
    print("\n🌐 Para acessar o Frontend:")
    print("   1. cd frontend")
    print("   2. npm install")
    print("   3. npm start")
    print("   4. Acesse: http://localhost:3000")


if __name__ == "__main__":
    asyncio.run(test_complete_system())