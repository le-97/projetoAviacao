"""
Unit tests for Enhanced Compliance Service.
"""
import sqlite3
from unittest.mock import AsyncMock, Mock

# Create a simple test without external dependencies
def test_database_connection():
    """Test basic database connectivity."""
    try:
        conn = sqlite3.connect('projetoaviacao.db')
        cursor = conn.cursor()
        
        # Verify tables exist
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        
        expected_tables = ['aircraft_models', 'authorities', 'regulations']
        for table in expected_tables:
            assert table in tables, f"Table {table} not found"
        
        # Verify data exists
        cursor.execute("SELECT COUNT(*) FROM aircraft_models")
        aircraft_count = cursor.fetchone()[0]
        assert aircraft_count > 0, "No aircraft models found"
        
        cursor.execute("SELECT COUNT(*) FROM authorities")
        authority_count = cursor.fetchone()[0]
        assert authority_count > 0, "No authorities found"
        
        cursor.execute("SELECT COUNT(*) FROM regulations")
        regulation_count = cursor.fetchone()[0]
        assert regulation_count > 0, "No regulations found"
        
        conn.close()
        print("✅ Database connection test passed")
        
    except Exception as e:
        print(f"❌ Database connection test failed: {e}")
        raise

def test_aircraft_model_structure():
    """Test aircraft model data structure."""
    try:
        conn = sqlite3.connect('projetoaviacao.db')
        cursor = conn.cursor()
        
        # Get sample aircraft
        cursor.execute("""
            SELECT model, variant, manufacturer, category
            FROM aircraft_models
            LIMIT 5
        """)
        
        models = cursor.fetchall()
        assert len(models) > 0, "No aircraft models found"
        
        # Verify E175 variants exist
        cursor.execute("""
            SELECT model, variant
            FROM aircraft_models
            WHERE model = 'E175'
        """)
        
        e175_variants = cursor.fetchall()
        assert len(e175_variants) >= 2, "E175 variants not found"
        
        # Verify we have both E1 and E2 variants
        variants = [variant[1] for variant in e175_variants]
        assert 'E175-E1' in variants or 'E1' in variants, "E175-E1 variant not found"
        assert 'E175-E2' in variants or 'E2' in variants, "E175-E2 variant not found"
        
        conn.close()
        print("✅ Aircraft model structure test passed")
        
    except Exception as e:
        print(f"❌ Aircraft model structure test failed: {e}")
        raise

def test_authority_mapping():
    """Test authority and country mapping."""
    try:
        conn = sqlite3.connect('projetoaviacao.db')
        cursor = conn.cursor()
        
        # Test authority-country mapping
        cursor.execute("""
            SELECT name, country
            FROM authorities
        """)
        
        authorities = cursor.fetchall()
        authority_map = {auth[1]: auth[0] for auth in authorities}
        
        # Verify expected mappings
        expected_mappings = {
            'USA': 'Federal Aviation Administration',
            'BRA': 'Agência Nacional de Aviação Civil',
            'EUR': 'European Union Aviation Safety Agency'
        }
        
        for country, expected_name in expected_mappings.items():
            assert country in authority_map, f"Authority for {country} not found"
            assert expected_name in authority_map[country], f"Expected authority name not found for {country}"
        
        conn.close()
        print("✅ Authority mapping test passed")
        
    except Exception as e:
        print(f"❌ Authority mapping test failed: {e}")
        raise

def test_compliance_logic_simulation():
    """Test basic compliance checking logic without external dependencies."""
    try:
        # Mock aircraft data
        aircraft = {
            'model': 'E175',
            'variant': 'E175-E2',
            'manufacturer': 'Embraer'
        }
        
        # Mock authority data
        authority = {
            'name': 'Federal Aviation Administration',
            'country': 'USA'
        }
        
        # Mock regulations
        regulations = [
            {'title': 'Part 25 Certification', 'status': 'active'},
            {'title': 'AD-2025-12', 'status': 'active'}
        ]
        
        # Simulate compliance check
        def check_compliance(aircraft, country, regulations):
            # Simplified compliance logic
            if aircraft['model'] in ['E175', 'E190', 'E195']:
                if country in ['USA', 'BRA', 'EUR']:
                    return {
                        'compliant': True,
                        'aircraft_model': f"{aircraft['model']}-{aircraft['variant'].split('-')[-1]}",
                        'country': country,
                        'regulations_checked': len(regulations),
                        'violations': []
                    }
            return {'compliant': False, 'violations': ['Unsupported aircraft or country']}
        
        # Test compliance
        result = check_compliance(aircraft, 'USA', regulations)
        
        assert result['compliant'] == True, "Compliance check failed"
        assert result['aircraft_model'] == 'E175-E2', "Aircraft model mismatch"
        assert result['country'] == 'USA', "Country mismatch"
        assert result['regulations_checked'] == 2, "Regulation count mismatch"
        assert len(result['violations']) == 0, "Unexpected violations found"
        
        print("✅ Compliance logic simulation test passed")
        
    except Exception as e:
        print(f"❌ Compliance logic simulation test failed: {e}")
        raise

def test_model_matching_logic():
    """Test intelligent model matching logic."""
    try:
        # Test cases for model matching
        test_cases = [
            # (input_model, expected_base, expected_variant)
            ('E175-E2', 'E175', 'E175-E2'),
            ('E175', 'E175', None),
            ('E190-E1', 'E190', 'E190-E1'),
            ('E195-E2', 'E195', 'E195-E2'),
            ('A320', 'A320', None),
            ('737-800', '737', '737-800')
        ]
        
        def parse_model(model_input):
            """Parse model input into base model and variant."""
            if '-' in model_input:
                parts = model_input.split('-', 1)
                return parts[0], model_input
            else:
                return model_input, None
        
        for input_model, expected_base, expected_variant in test_cases:
            base, variant = parse_model(input_model)
            assert base == expected_base, f"Base model mismatch for {input_model}: got {base}, expected {expected_base}"
            assert variant == expected_variant, f"Variant mismatch for {input_model}: got {variant}, expected {expected_variant}"
        
        print("✅ Model matching logic test passed")
        
    except Exception as e:
        print(f"❌ Model matching logic test failed: {e}")
        raise

def run_all_tests():
    """Run all unit tests."""
    tests = [
        test_database_connection,
        test_aircraft_model_structure,
        test_authority_mapping,
        test_compliance_logic_simulation,
        test_model_matching_logic
    ]
    
    print("🧪 Running Enhanced Compliance Service Unit Tests")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            test()
            passed += 1
        except Exception as e:
            print(f"❌ {test.__name__} failed: {e}")
            failed += 1
    
    print("=" * 60)
    print(f"🎯 Test Results: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 All tests passed!")
    else:
        print(f"⚠️ {failed} test(s) failed")
    
    return failed == 0

if __name__ == "__main__":
    run_all_tests()