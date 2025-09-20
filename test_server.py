"""
Simple server test to validate functionality.
"""

import asyncio
import httpx
import sys


async def test_server():
    """Test if server is responding."""
    client = httpx.AsyncClient(timeout=10.0)
    
    try:
        # Test health endpoint
        print("🔍 Testing health endpoint...")
        response = await client.get("http://127.0.0.1:8001/health")
        print(f"Health Status: {response.status_code}")
        if response.status_code == 200:
            print(f"Health Response: {response.json()}")
        
        # Test compliance endpoint
        print("\n🔍 Testing compliance endpoint...")
        response = await client.get(
            "http://127.0.0.1:8001/check-compliance",
            params={"model": "E190", "country": "USA"}
        )
        print(f"Compliance Status: {response.status_code}")
        if response.status_code == 200:
            print(f"Compliance Response: {response.json()}")
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("Make sure the server is running on http://127.0.0.1:8001")
        return False
    
    finally:
        await client.aclose()
    
    return True


if __name__ == "__main__":
    success = asyncio.run(test_server())
    sys.exit(0 if success else 1)