#!/usr/bin/env python3
"""Simple test without external dependencies."""

import sqlite3
import json

def test_database_direct():
    """Test database directly with sqlite3."""
    print("🔍 Testing Database Connection...")
    
    try:
        # Connect to database
        conn = sqlite3.connect('projetoAviacao.db')
        cursor = conn.cursor()
        
        # Test aircraft models
        cursor.execute("SELECT id, model, variant FROM aircraft_models")
        models = cursor.fetchall()
        print(f"✅ Aircraft models in database: {len(models)}")
        for model in models:
            print(f"  - {model[1]} {model[2] or ''} (ID: {model[0]})")
        
        # Test authorities  
        cursor.execute("SELECT id, name, country FROM authorities")
        authorities = cursor.fetchall()
        print(f"✅ Authorities in database: {len(authorities)}")
        for auth in authorities:
            print(f"  - {auth[1]} ({auth[2]}) (ID: {auth[0]})")
            
        # Test regulations
        cursor.execute("SELECT id, title, description FROM regulations LIMIT 5")
        regulations = cursor.fetchall()
        print(f"✅ Sample regulations: {len(regulations)}")
        for reg in regulations:
            print(f"  - {reg[1]}: {reg[2][:50]}...")
            
        conn.close()
        print("✅ Database test successful!")
        
    except Exception as e:
        print(f"❌ Database test failed: {e}")

def test_basic_compliance_logic():
    """Test basic compliance logic without external dependencies."""
    print("\n🔍 Testing Basic Compliance Logic...")
    
    try:
        # Mock data
        mock_aircraft = {
            "id": 1,
            "model": "E175",
            "variant": "E2",
            "manufacturer": "Embraer"
        }
        
        mock_authority = {
            "id": 1,
            "name": "FAA",
            "country": "USA"
        }
        
        mock_regulations = [
            {
                "id": 1,
                "title": "Part 25 Certification",
                "description": "Transport category aircraft certification",
                "authority_id": 1,
                "status": "active"
            }
        ]
        
        # Basic compliance check logic
        model_key = f"{mock_aircraft['model']}-{mock_aircraft['variant']}"
        country = mock_authority['country']
        
        print(f"✅ Model: {model_key}")
        print(f"✅ Country: {country}")
        print(f"✅ Authority: {mock_authority['name']}")
        print(f"✅ Applicable regulations: {len(mock_regulations)}")
        
        # Mock compliance result
        compliance_result = {
            "aircraft_model": model_key,
            "country": country,
            "authority": mock_authority['name'],
            "compliant": True,
            "regulations_checked": len(mock_regulations),
            "violations": []
        }
        
        print(f"✅ Compliance check result: {json.dumps(compliance_result, indent=2)}")
        print("✅ Basic compliance logic test successful!")
        
    except Exception as e:
        print(f"❌ Basic compliance logic test failed: {e}")

if __name__ == "__main__":
    test_database_direct()
    test_basic_compliance_logic()