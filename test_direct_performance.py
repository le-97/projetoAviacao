"""
Direct performance test of compliance service functions.
"""

import asyncio
import time
from src.services.compliance_service import ComplianceService, ValidationError


async def test_compliance_performance():
    """Test compliance service performance directly."""
    service = ComplianceService()
    
    # Test cases
    test_cases = [
        ("E190", "USA"),
        ("E195", "BRAZIL"),
        ("E190", "EUROPE"),
        ("E195", "USA"),
    ]
    
    print("🔧 Testing ComplianceService directly...")
    
    # Single request test
    start_time = time.time()
    try:
        result = await service.check_compliance("E190", "USA")
        end_time = time.time()
        print(f"✅ Single request: {(end_time - start_time)*1000:.2f}ms")
        print(f"   Result: {result.status}, Pending: {len(result.pending_requirements)}")
    except Exception as e:
        print(f"❌ Single request failed: {e}")
        return
    
    # Multiple requests test
    print("\n🚀 Testing 20 sequential requests...")
    times = []
    start_time = time.time()
    
    for i in range(20):
        model, country = test_cases[i % len(test_cases)]
        req_start = time.time()
        try:
            result = await service.check_compliance(model, country)
            req_end = time.time()
            times.append(req_end - req_start)
        except Exception as e:
            print(f"❌ Request {i+1} failed: {e}")
    
    total_time = time.time() - start_time
    
    if times:
        avg_time = sum(times) / len(times)
        max_time = max(times)
        min_time = min(times)
        p95_time = sorted(times)[int(0.95 * len(times))]
        
        print(f"📊 Results for {len(times)} requests:")
        print(f"   Total time: {total_time:.2f}s")
        print(f"   Throughput: {len(times)/total_time:.2f} req/s")
        print(f"   Average: {avg_time*1000:.2f}ms")
        print(f"   P95: {p95_time*1000:.2f}ms")
        print(f"   Min: {min_time*1000:.2f}ms")
        print(f"   Max: {max_time*1000:.2f}ms")
        
        # Performance analysis
        print(f"\n📈 Performance Analysis:")
        if avg_time < 0.050:  # 50ms
            print("   🟢 Excellent performance (<50ms avg)")
        elif avg_time < 0.100:  # 100ms
            print("   🟡 Good performance (50-100ms avg)")
        elif avg_time < 0.200:  # 200ms
            print("   🟠 Acceptable performance (100-200ms avg)")
        else:
            print("   🔴 Poor performance (>200ms avg)")
        
        # Cache potential analysis
        file_load_overhead = 0.010  # Estimated 10ms for JSON loading
        cache_benefit = file_load_overhead / avg_time * 100
        print(f"   💾 Estimated cache benefit: {cache_benefit:.1f}% improvement")


if __name__ == "__main__":
    asyncio.run(test_compliance_performance())