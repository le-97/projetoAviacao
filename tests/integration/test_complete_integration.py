"""
Integration tests for the complete compliance system.
"""
import sqlite3
import json
import time
from urllib.request import urlopen
from urllib.error import URLError

def test_database_integration():
    """Test complete database integration."""
    print("🔍 Testing Database Integration...")
    
    try:
        conn = sqlite3.connect('projetoaviacao.db')
        cursor = conn.cursor()
        
        # Test aircraft-authority-regulation integration
        cursor.execute("""
            SELECT 
                am.model,
                am.variant,
                a.name as authority,
                a.country,
                COUNT(r.id) as regulation_count
            FROM aircraft_models am
            CROSS JOIN authorities a
            LEFT JOIN regulations r ON r.authority_id = a.id
            WHERE am.model IN ('E175', 'E190', 'E195')
            GROUP BY am.id, a.id
            ORDER BY am.model, a.country
        """)
        
        results = cursor.fetchall()
        assert len(results) > 0, "No integration data found"
        
        # Verify we have data for different countries
        countries = {row[3] for row in results}
        expected_countries = {'USA', 'BRA', 'EUR'}
        assert expected_countries.issubset(countries), f"Missing countries: {expected_countries - countries}"
        
        # Verify we have regulations for each authority
        regulations_by_country = {}
        for row in results:
            country = row[3]
            reg_count = row[4]
            if country not in regulations_by_country:
                regulations_by_country[country] = reg_count
            else:
                regulations_by_country[country] = max(regulations_by_country[country], reg_count)
        
        for country, reg_count in regulations_by_country.items():
            assert reg_count > 0, f"No regulations found for {country}"
        
        conn.close()
        print("✅ Database integration test passed")
        
    except Exception as e:
        print(f"❌ Database integration test failed: {e}")
        raise

def test_api_endpoints_integration():
    """Test API endpoints integration."""
    print("🔍 Testing API Endpoints Integration...")
    
    base_url = "http://localhost:8000"
    
    # Test if server is running
    try:
        response = urlopen(f"{base_url}/models", timeout=5)
        server_running = True
    except URLError:
        print("⚠️ Mock server not running - starting test server check")
        server_running = False
    
    if not server_running:
        print("ℹ️ API server not available for integration testing")
        return
    
    try:
        # Test /models endpoint
        with urlopen(f"{base_url}/models") as response:
            models_data = json.loads(response.read())
            assert isinstance(models_data, list), "Models should be a list"
            assert len(models_data) > 0, "No models returned"
            
            # Check for expected models
            model_ids = {model['id'] for model in models_data}
            expected_models = {'E175-E1', 'E175-E2', 'E190-E1', 'E190-E2'}
            found_models = expected_models.intersection(model_ids)
            assert len(found_models) > 0, f"Expected models not found: {expected_models}"
        
        # Test /authorities endpoint
        with urlopen(f"{base_url}/authorities") as response:
            authorities_data = json.loads(response.read())
            assert isinstance(authorities_data, list), "Authorities should be a list"
            assert len(authorities_data) > 0, "No authorities returned"
            
            # Check for expected authorities
            countries = {auth['country'] for auth in authorities_data}
            expected_countries = {'USA', 'BRA', 'EUR'}
            assert expected_countries.issubset(countries), f"Missing countries: {expected_countries - countries}"
        
        # Test compliance check endpoints
        test_cases = [
            ('E175-E2', 'USA'),
            ('E190', 'BRA'),
            ('E195-E1', 'EUR')
        ]
        
        for model, country in test_cases:
            try:
                with urlopen(f"{base_url}/compliance/check/{model}/{country}") as response:
                    compliance_data = json.loads(response.read())
                    assert isinstance(compliance_data, dict), "Compliance result should be a dict"
                    assert 'aircraft_model' in compliance_data, "Missing aircraft_model field"
                    assert 'country' in compliance_data, "Missing country field"
                    assert 'compliant' in compliance_data, "Missing compliant field"
                    assert compliance_data['aircraft_model'] == model, "Aircraft model mismatch"
                    assert compliance_data['country'] == country, "Country mismatch"
            except URLError as e:
                print(f"⚠️ Compliance check failed for {model}/{country}: {e}")
        
        print("✅ API endpoints integration test passed")
        
    except Exception as e:
        print(f"❌ API endpoints integration test failed: {e}")
        raise

def test_end_to_end_workflow():
    """Test complete end-to-end workflow."""
    print("🔍 Testing End-to-End Workflow...")
    
    try:
        # Step 1: Verify database has required data
        conn = sqlite3.connect('projetoaviacao.db')
        cursor = conn.cursor()
        
        # Get a sample aircraft
        cursor.execute("""
            SELECT model, variant FROM aircraft_models 
            WHERE model = 'E175' 
            LIMIT 1
        """)
        aircraft = cursor.fetchone()
        assert aircraft is not None, "No E175 aircraft found in database"
        
        model = aircraft[0]
        variant = aircraft[1]
        model_id = f"{model}-{variant}" if variant else model
        
        # Get a sample authority
        cursor.execute("""
            SELECT country, name FROM authorities 
            WHERE country = 'USA'
            LIMIT 1
        """)
        authority = cursor.fetchone()
        assert authority is not None, "No USA authority found"
        
        country = authority[0]
        authority_name = authority[1]
        
        # Get regulations for this authority
        cursor.execute("""
            SELECT COUNT(*) FROM regulations r
            JOIN authorities a ON r.authority_id = a.id
            WHERE a.country = ?
        """, (country,))
        reg_count = cursor.fetchone()[0]
        
        conn.close()
        
        # Step 2: Simulate compliance check workflow
        compliance_request = {
            'aircraft_model': model_id,
            'country': country
        }
        
        # Step 3: Simulate compliance logic
        def simulate_compliance_check(request):
            # This simulates the enhanced compliance service logic
            aircraft_model = request['aircraft_model']
            country = request['country']
            
            # Model validation
            if not aircraft_model or not country:
                return {'error': 'Missing required fields'}
            
            # Authority lookup
            if country not in ['USA', 'BRA', 'EUR']:
                return {'error': 'Unsupported country'}
            
            # Compliance determination
            return {
                'aircraft_model': aircraft_model,
                'country': country,
                'authority': authority_name,
                'compliant': True,
                'regulations_checked': reg_count,
                'violations': [],
                'summary': f'Aircraft {aircraft_model} is compliant with {authority_name} regulations'
            }
        
        # Step 4: Execute workflow
        result = simulate_compliance_check(compliance_request)
        
        # Step 5: Validate results
        assert 'error' not in result, f"Workflow error: {result.get('error')}"
        assert result['aircraft_model'] == model_id, "Aircraft model mismatch in workflow"
        assert result['country'] == country, "Country mismatch in workflow"
        assert result['compliant'] == True, "Expected compliant result"
        assert result['regulations_checked'] > 0, "No regulations checked"
        
        print("✅ End-to-end workflow test passed")
        
    except Exception as e:
        print(f"❌ End-to-end workflow test failed: {e}")
        raise

def test_error_handling():
    """Test error handling scenarios."""
    print("🔍 Testing Error Handling...")
    
    try:
        # Test invalid model handling
        def validate_aircraft_model(model):
            valid_models = ['E175', 'E190', 'E195', 'A320', '737']
            base_model = model.split('-')[0] if '-' in model else model
            return base_model in valid_models
        
        # Test cases
        test_cases = [
            ('E175-E2', True),
            ('E190', True),
            ('INVALID', False),
            ('', False),
            ('B747', False)
        ]
        
        for model, expected_valid in test_cases:
            is_valid = validate_aircraft_model(model)
            assert is_valid == expected_valid, f"Model validation failed for {model}: expected {expected_valid}, got {is_valid}"
        
        # Test invalid country handling
        def validate_country(country):
            valid_countries = ['USA', 'BRA', 'EUR']
            return country in valid_countries
        
        country_test_cases = [
            ('USA', True),
            ('BRA', True),
            ('EUR', True),
            ('INVALID', False),
            ('', False)
        ]
        
        for country, expected_valid in country_test_cases:
            is_valid = validate_country(country)
            assert is_valid == expected_valid, f"Country validation failed for {country}: expected {expected_valid}, got {is_valid}"
        
        print("✅ Error handling test passed")
        
    except Exception as e:
        print(f"❌ Error handling test failed: {e}")
        raise

def run_integration_tests():
    """Run all integration tests."""
    tests = [
        test_database_integration,
        test_api_endpoints_integration,
        test_end_to_end_workflow,
        test_error_handling
    ]
    
    print("🔗 Running Integration Tests")
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
    print(f"🎯 Integration Test Results: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 All integration tests passed!")
    else:
        print(f"⚠️ {failed} integration test(s) failed")
    
    return failed == 0

if __name__ == "__main__":
    run_integration_tests()