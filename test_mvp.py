#!/usr/bin/env python3
"""
Script para testar o MVP da Aviation Compliance API
"""
import asyncio
import httpx
import sys

BASE_URL = "http://127.0.0.1:8000"

async def test_mvp():
    """Testa todos os endpoints do MVP"""
    print("🚁 Testando Aviation Compliance MVP")
    print("=" * 50)
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        tests = [
            ("GET", "/", "Root endpoint"),
            ("GET", "/health", "Health check"),
            ("GET", "/compliance/models", "Available models"),
            ("GET", "/compliance/authorities", "Regulatory authorities"),
            ("GET", "/compliance/check/E175/USA", "Compliance check - E175/USA"),
            ("GET", "/compliance/check/E190/BRAZIL", "Compliance check - E190/BRAZIL"),
            ("GET", "/analytics/simple-metrics", "Simple analytics"),
        ]
        
        success_count = 0
        total_count = len(tests)
        
        for method, path, description in tests:
            try:
                print(f"\n🧪 Testing: {description}")
                print(f"   {method} {path}")
                response = await client.request(method, f"{BASE_URL}{path}")
                
                if response.status_code == 200:
                    print(f"   ✅ Success: {response.status_code}")
                    # Print first 100 chars of response
                    response_text = response.text
                    if len(response_text) > 100:
                        response_text = response_text[:100] + "..."
                    print(f"   📄 Response: {response_text}")
                    success_count += 1
                else:
                    print(f"   ❌ Failed: {response.status_code}")
                    print(f"   📄 Response: {response.text}")
                    
            except Exception as e:
                print(f"   💥 Error: {str(e)}")
        
        # Test POST endpoint
        try:
            print(f"\n🧪 Testing: POST compliance check")
            post_data = {"aircraft_model": "E195", "country": "EUROPE"}
            response = await client.post(f"{BASE_URL}/compliance/check", json=post_data)
            
            if response.status_code == 200:
                print(f"   ✅ Success: {response.status_code}")
                success_count += 1
            else:
                print(f"   ❌ Failed: {response.status_code}")
            total_count += 1
            
        except Exception as e:
            print(f"   💥 Error: {str(e)}")
            total_count += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {success_count}/{total_count} passed")
    
    if success_count == total_count:
        print("🎉 MVP is working perfectly!")
        return True
    else:
        print("⚠️  Some tests failed")
        return False

if __name__ == "__main__":
    print("📝 Para testar o MVP:")
    print("1. Execute: python main_mvp.py")
    print("2. Em outro terminal: python test_mvp.py")
    print()
    
    try:
        result = asyncio.run(test_mvp())
        sys.exit(0 if result else 1)
    except KeyboardInterrupt:
        print("\n⏹️  Teste interrompido pelo usuário")
        sys.exit(1)
    except Exception as e:
        print(f"💥 Erro no teste: {e}")
        sys.exit(1)