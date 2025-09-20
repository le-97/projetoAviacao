#!/usr/bin/env python3
"""Test the mock API endpoints."""

import urllib.request
import json

def test_api_endpoint(url, description):
    """Test an API endpoint."""
    print(f"\n🔍 Testing {description}")
    print(f"URL: {url}")
    
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read())
            print(f"✅ Status: {response.status}")
            print(f"📄 Response: {json.dumps(data, indent=2)[:500]}...")
            return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Test all endpoints."""
    print("🚀 Testing Mock Compliance API")
    
    base_url = "http://localhost:8000"
    
    # Test endpoints
    endpoints = [
        ("/models", "Aircraft Models"),
        ("/authorities", "Aviation Authorities"), 
        ("/compliance/check/E175-E2/USA", "E175-E2 compliance in USA"),
        ("/compliance/check/E190/BRA", "E190 compliance in Brazil"),
        ("/compliance/check/A320/EUR", "A320 compliance in Europe")
    ]
    
    success_count = 0
    for endpoint, description in endpoints:
        if test_api_endpoint(f"{base_url}{endpoint}", description):
            success_count += 1
    
    print(f"\n🎉 Test Results: {success_count}/{len(endpoints)} endpoints working")
    
    if success_count == len(endpoints):
        print("✅ All endpoints are working correctly!")
        print("🔗 Mock API is ready for frontend integration")
    else:
        print("⚠️ Some endpoints have issues")

if __name__ == "__main__":
    main()