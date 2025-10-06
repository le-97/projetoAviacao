#!/usr/bin/env python3
"""
Test script for Aviation Compliance API endpoints
Validates functionality and response formats for Apidog MCP analysis
"""

import asyncio
import httpx
import json
from typing import Dict, Any

# Base URL for the API
BASE_URL = "http://127.0.0.1:8000"

async def test_endpoint(client: httpx.AsyncClient, method: str, path: str, description: str) -> Dict[str, Any]:
    """Test a single endpoint and return results"""
    try:
        if method.upper() == "GET":
            response = await client.get(f"{BASE_URL}{path}")
        elif method.upper() == "DELETE":
            response = await client.delete(f"{BASE_URL}{path}")
        else:
            response = await client.request(method, f"{BASE_URL}{path}")
        
        return {
            "endpoint": f"{method.upper()} {path}",
            "description": description,
            "status_code": response.status_code,
            "success": 200 <= response.status_code < 300,
            "response_time_ms": response.elapsed.total_seconds() * 1000,
            "content_type": response.headers.get("content-type", ""),
            "response_size": len(response.content),
            "has_json": "application/json" in response.headers.get("content-type", ""),
            "response_preview": str(response.text[:200]) + "..." if len(response.text) > 200 else response.text
        }
    except Exception as e:
        return {
            "endpoint": f"{method.upper()} {path}",
            "description": description,
            "status_code": None,
            "success": False,
            "error": str(e),
            "response_time_ms": None,
            "content_type": None,
            "response_size": None,
            "has_json": False,
            "response_preview": None
        }

async def main():
    """Main test function"""
    print("🚁 Aviation Compliance API - Endpoint Testing")
    print("=" * 60)
    
    # Test endpoints based on our analysis
    test_cases = [
        # Health Endpoints
        ("GET", "/", "Root health check"),
        ("GET", "/health", "Detailed health status"),
        
        # Compliance Endpoints (documented)
        ("GET", "/compliance/check/E175/USA", "Check compliance for E175 in USA"),
        ("GET", "/compliance/models", "Get available aircraft models"),
        ("GET", "/compliance/authorities", "Get regulatory authorities"),
        ("GET", "/compliance/aircraft", "Get aircraft information"),
        
        # Analytics Endpoints (documented)
        ("GET", "/analytics/fleet-metrics", "Fleet performance metrics"),
        ("GET", "/analytics/compliance-trends", "Compliance trend analysis"),
        ("GET", "/analytics/alerts", "Current compliance alerts"),
        
        # Metrics Endpoints
        ("GET", "/metrics", "System metrics"),
        ("GET", "/metrics/health", "Health metrics"),
        
        # Undocumented Endpoints (discovered in analysis)
        ("GET", "/compliance/", "Compliance root info (undocumented)"),
        ("GET", "/cache/stats", "Cache statistics (undocumented)"),
        ("GET", "/analytics/performance-metrics", "Performance metrics (undocumented)"),
        ("GET", "/analytics/requirements-summary", "Requirements summary (undocumented)"),
    ]
    
    results = []
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        for method, path, description in test_cases:
            print(f"Testing: {method} {path}")
            result = await test_endpoint(client, method, path, description)
            results.append(result)
            
            # Print immediate result
            if result["success"]:
                print(f"  ✅ {result['status_code']} - {result['response_time_ms']:.1f}ms")
            else:
                print(f"  ❌ {result.get('status_code', 'ERROR')} - {result.get('error', 'Failed')}")
            
            # Small delay to avoid overwhelming the server
            await asyncio.sleep(0.1)
    
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    successful = [r for r in results if r["success"]]
    failed = [r for r in results if not r["success"]]
    
    print(f"Total Tests: {len(results)}")
    print(f"Successful: {len(successful)} ✅")
    print(f"Failed: {len(failed)} ❌")
    print(f"Success Rate: {len(successful)/len(results)*100:.1f}%")
    
    if successful:
        avg_response_time = sum(r["response_time_ms"] for r in successful) / len(successful)
        print(f"Average Response Time: {avg_response_time:.1f}ms")
    
    print("\n📋 DETAILED RESULTS:")
    print("-" * 60)
    
    for result in results:
        status = "✅" if result["success"] else "❌"
        print(f"{status} {result['endpoint']}")
        print(f"   Description: {result['description']}")
        if result["success"]:
            print(f"   Status: {result['status_code']} | Time: {result['response_time_ms']:.1f}ms | Size: {result['response_size']} bytes")
            print(f"   Content-Type: {result['content_type']}")
            if result["response_preview"]:
                print(f"   Preview: {result['response_preview']}")
        else:
            print(f"   Error: {result.get('error', 'Unknown error')}")
        print()
    
    # Save results to file
    with open("endpoint_test_results.json", "w") as f:
        json.dump({
            "summary": {
                "total_tests": len(results),
                "successful": len(successful),
                "failed": len(failed),
                "success_rate": len(successful)/len(results)*100,
                "avg_response_time_ms": sum(r["response_time_ms"] for r in successful) / len(successful) if successful else None
            },
            "results": results
        }, f, indent=2)
    
    print(f"📄 Detailed results saved to: endpoint_test_results.json")

if __name__ == "__main__":
    asyncio.run(main())