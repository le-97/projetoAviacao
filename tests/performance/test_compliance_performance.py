"""
Performance tests for the compliance microservice.

Tests both cached and non-cached scenarios to measure
the impact of Redis implementation.
"""

import pytest
import asyncio
import httpx
import time
from concurrent.futures import ThreadPoolExecutor
from typing import List, Dict, Any


class PerformanceTestResults:
    """Container for performance test results."""
    
    def __init__(self):
        self.response_times: List[float] = []
        self.successful_requests = 0
        self.failed_requests = 0
        self.total_requests = 0
        
    def add_result(self, response_time: float, success: bool):
        """Add a test result."""
        self.response_times.append(response_time)
        self.total_requests += 1
        if success:
            self.successful_requests += 1
        else:
            self.failed_requests += 1
    
    @property
    def success_rate(self) -> float:
        """Calculate success rate percentage."""
        if self.total_requests == 0:
            return 0.0
        return (self.successful_requests / self.total_requests) * 100
    
    @property
    def avg_response_time(self) -> float:
        """Calculate average response time."""
        if not self.response_times:
            return 0.0
        return sum(self.response_times) / len(self.response_times)
    
    @property
    def p95_response_time(self) -> float:
        """Calculate 95th percentile response time."""
        if not self.response_times:
            return 0.0
        sorted_times = sorted(self.response_times)
        index = int(0.95 * len(sorted_times))
        return sorted_times[index]
    
    @property
    def p99_response_time(self) -> float:
        """Calculate 99th percentile response time."""
        if not self.response_times:
            return 0.0
        sorted_times = sorted(self.response_times)
        index = int(0.99 * len(sorted_times))
        return sorted_times[index]
    
    @property
    def min_response_time(self) -> float:
        """Get minimum response time."""
        return min(self.response_times) if self.response_times else 0.0
    
    @property
    def max_response_time(self) -> float:
        """Get maximum response time."""
        return max(self.response_times) if self.response_times else 0.0


class CompliancePerformanceTester:
    """Performance tester for compliance endpoints."""
    
    def __init__(self, base_url: str = "http://127.0.0.1:8001"):
        self.base_url = base_url
        self.client = httpx.AsyncClient(timeout=30.0)
    
    async def test_single_request(self, model: str, country: str) -> tuple[float, bool]:
        """Test a single compliance request."""
        start_time = time.time()
        try:
            response = await self.client.get(
                f"{self.base_url}/check-compliance",
                params={"model": model, "country": country}
            )
            end_time = time.time()
            success = response.status_code == 200
            return end_time - start_time, success
        except Exception as e:
            end_time = time.time()
            print(f"Request failed: {e}")
            return end_time - start_time, False
    
    async def test_concurrent_requests(
        self, 
        num_requests: int, 
        num_concurrent: int,
        test_cases: List[tuple[str, str]]
    ) -> PerformanceTestResults:
        """Test concurrent requests."""
        results = PerformanceTestResults()
        
        # Create semaphore to limit concurrency
        semaphore = asyncio.Semaphore(num_concurrent)
        
        async def limited_request(model: str, country: str):
            async with semaphore:
                return await self.test_single_request(model, country)
        
        # Create tasks
        tasks = []
        for i in range(num_requests):
            model, country = test_cases[i % len(test_cases)]
            task = limited_request(model, country)
            tasks.append(task)
        
        # Execute all tasks
        print(f"Executing {num_requests} requests with {num_concurrent} concurrent...")
        start_time = time.time()
        task_results = await asyncio.gather(*tasks)
        total_time = time.time() - start_time
        
        # Process results
        for response_time, success in task_results:
            results.add_result(response_time, success)
        
        print(f"Completed in {total_time:.2f}s")
        print(f"Throughput: {num_requests/total_time:.2f} req/s")
        
        return results
    
    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()


@pytest.mark.asyncio
async def test_performance_baseline():
    """Test baseline performance without cache."""
    tester = CompliancePerformanceTester()
    
    # Test cases with different model/country combinations
    test_cases = [
        ("E190", "USA"),
        ("E195", "BRAZIL"),
        ("E190", "EUROPE"),
        ("E195", "USA"),
    ]
    
    try:
        # Warm up
        print("🔥 Warming up...")
        for model, country in test_cases:
            await tester.test_single_request(model, country)
        
        # Single request test
        print("\n📊 Single Request Test:")
        single_time, single_success = await tester.test_single_request("E190", "USA")
        print(f"Single request: {single_time*1000:.2f}ms, Success: {single_success}")
        
        # Concurrent test - Light load
        print("\n🚀 Light Load Test (10 requests, 2 concurrent):")
        light_results = await tester.test_concurrent_requests(10, 2, test_cases)
        print_results("Light Load", light_results)
        
        # Concurrent test - Medium load
        print("\n🔥 Medium Load Test (50 requests, 5 concurrent):")
        medium_results = await tester.test_concurrent_requests(50, 5, test_cases)
        print_results("Medium Load", medium_results)
        
        # Concurrent test - Heavy load
        print("\n⚡ Heavy Load Test (100 requests, 10 concurrent):")
        heavy_results = await tester.test_concurrent_requests(100, 10, test_cases)
        print_results("Heavy Load", heavy_results)
        
        # Assertions for performance targets
        assert light_results.success_rate >= 95, f"Light load success rate too low: {light_results.success_rate}%"
        assert medium_results.success_rate >= 90, f"Medium load success rate too low: {medium_results.success_rate}%"
        assert heavy_results.success_rate >= 85, f"Heavy load success rate too low: {heavy_results.success_rate}%"
        
        # Performance targets (baseline without cache)
        assert light_results.p95_response_time < 2.0, f"Light load P95 too high: {light_results.p95_response_time:.3f}s"
        assert medium_results.p95_response_time < 3.0, f"Medium load P95 too high: {medium_results.p95_response_time:.3f}s"
        
    finally:
        await tester.close()


def print_results(test_name: str, results: PerformanceTestResults):
    """Print formatted test results."""
    print(f"📈 {test_name} Results:")
    print(f"  Total Requests: {results.total_requests}")
    print(f"  Success Rate: {results.success_rate:.1f}%")
    print(f"  Average Response Time: {results.avg_response_time*1000:.2f}ms")
    print(f"  P95 Response Time: {results.p95_response_time*1000:.2f}ms")
    print(f"  P99 Response Time: {results.p99_response_time*1000:.2f}ms")
    print(f"  Min Response Time: {results.min_response_time*1000:.2f}ms")
    print(f"  Max Response Time: {results.max_response_time*1000:.2f}ms")


if __name__ == "__main__":
    # Run standalone test
    asyncio.run(test_performance_baseline())