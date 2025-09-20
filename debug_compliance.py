"""
Debug do erro de compliance check.
"""

import asyncio
import sys
import os
import traceback

# Add src to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.services.enhanced_compliance_service import EnhancedComplianceService
from src.database import AsyncSessionLocal, create_tables


async def debug_compliance_check():
    """Debug específico do compliance check."""
    print("🔍 Debug do compliance check...")
    
    # Create database tables
    await create_tables()
    
    async with AsyncSessionLocal() as session:
        service = EnhancedComplianceService(session)
        
        try:
            print("1. Validando entrada...")
            await service.validate_input("E175-E2", "BRAZIL")
            print("✅ Validação OK")
            
            print("2. Obtendo regulamentações aplicáveis...")
            regulations = await service.get_applicable_regulations("E175-E2", "BRAZIL")
            print(f"✅ {len(regulations)} regulamentações encontradas")
            
            if regulations:
                print("3. Primeira regulamentação:")
                reg = regulations[0]
                print(f"   - Tipo: {type(reg)}")
                for key, value in reg.items():
                    print(f"   - {key}: {type(value)} = {value}")
            
            print("4. Fazendo compliance check completo...")
            result = await service.check_compliance("E175-E2", "BRAZIL")
            print("✅ Compliance check OK!")
            
        except Exception as e:
            print(f"❌ Erro: {e}")
            print("Traceback:")
            traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(debug_compliance_check())