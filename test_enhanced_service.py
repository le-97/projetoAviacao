"""
Test script to verify the enhanced compliance service functionality.
"""

import asyncio
import sqlite3
import os
import sys

# Add src to path for imports
sys.path.append('src')

async def test_database_setup():
    """Test database setup and basic operations."""
    print("🔍 Testing Database Setup...")
    
    # Check if database file exists
    db_path = "projetoAviacao.db"
    if os.path.exists(db_path):
        print(f"✅ Database file exists: {db_path}")
        
        # Test basic SQLite connection
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Check tables
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = cursor.fetchall()
            print(f"✅ Found {len(tables)} tables: {[table[0] for table in tables]}")
            
            # Check data
            cursor.execute("SELECT COUNT(*) FROM authorities")
            auth_count = cursor.fetchone()[0]
            print(f"✅ Authorities in database: {auth_count}")
            
            cursor.execute("SELECT COUNT(*) FROM aircraft_models")
            aircraft_count = cursor.fetchone()[0]
            print(f"✅ Aircraft models in database: {aircraft_count}")
            
            cursor.execute("SELECT COUNT(*) FROM regulations")
            reg_count = cursor.fetchone()[0]
            print(f"✅ Regulations in database: {reg_count}")
            
            conn.close()
            
        except Exception as e:
            print(f"❌ Database error: {e}")
    else:
        print(f"❌ Database file not found: {db_path}")

async def test_models():
    """Test the new compliance models."""
    print("\n🔍 Testing Compliance Models...")
    
    try:
        from src.models.compliance import ComplianceReport, ComplianceCheck as ComplianceCheckModel, AircraftInfo
        
        # Test AircraftInfo
        aircraft = AircraftInfo(
            manufacturer="Embraer",
            model="E175-E2",
            variant="E175-E2",
            type_certificate="TC-E175-E2",
            max_seats=88,
            max_weight_kg=38790
        )
        print(f"✅ AircraftInfo created: {aircraft.model}")
        
        # Test ComplianceCheck
        check = ComplianceCheckModel(
            regulation_reference="ANAC-2024-001",
            regulation_title="E-Jets E2 Series Operational Requirements",
            status="COMPLIANT",
            severity="MAJOR",
            findings=["All requirements met for E175-E2"],
            recommendations=["Continue regular maintenance"]
        )
        print(f"✅ ComplianceCheck created: {check.regulation_reference}")
        
        # Test ComplianceReport
        report = ComplianceReport(
            aircraft_model="E175-E2",
            country="BRAZIL",
            overall_status="COMPLIANT",
            total_checks=1,
            compliant_checks=1,
            non_compliant_checks=0,
            critical_issues=0,
            checks=[check],
            recommendations=["Aircraft is fully compliant"],
            aircraft_info=aircraft
        )
        print(f"✅ ComplianceReport created: {report.aircraft_model} - {report.overall_status}")
        
    except Exception as e:
        print(f"❌ Model error: {e}")

async def test_enhanced_service():
    """Test the enhanced compliance service logic."""
    print("\n🔍 Testing Enhanced Service Logic...")
    
    try:
        # Test model matching logic
        from src.services.enhanced_compliance_service import EnhancedComplianceService
        
        # Create a mock session (we'll test without database for now)
        service = EnhancedComplianceService(None)
        
        # Test model matching
        test_cases = [
            ("E175", "E175-E1", True),
            ("E175-E2", "E175", True),
            ("E190", "E190-E2", True),
            ("737", "A320", False),
        ]
        
        for aircraft_model, regulation_model, expected in test_cases:
            result = service._model_matches(aircraft_model, regulation_model)
            status = "✅" if result == expected else "❌"
            print(f"{status} Model match test: {aircraft_model} vs {regulation_model} = {result} (expected {expected})")
        
        # Test supported models
        print(f"✅ Supported models: {service.supported_models}")
        print(f"✅ Supported countries: {service.supported_countries}")
        print(f"✅ Authority mapping: {service.authority_map}")
        
    except Exception as e:
        print(f"❌ Service error: {e}")

async def main():
    """Run all tests."""
    print("🚀 Starting Enhanced Compliance Service Tests\n")
    
    await test_database_setup()
    await test_models()
    await test_enhanced_service()
    
    print("\n🎉 Test execution completed!")

if __name__ == "__main__":
    asyncio.run(main())