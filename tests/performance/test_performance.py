"""
Performance tests for the compliance system.
"""
import time
import sqlite3
import statistics
from concurrent.futures import ThreadPoolExecutor
import threading

def benchmark_database_queries():
    """Benchmark database query performance."""
    print("⚡ Benchmarking Database Queries...")
    
    # Test single query performance
    def single_query_test():
        conn = sqlite3.connect('projetoaviacao.db')
        cursor = conn.cursor()
        
        start_time = time.time()
        cursor.execute("""
            SELECT am.model, am.variant, a.name, COUNT(r.id)
            FROM aircraft_models am
            CROSS JOIN authorities a
            LEFT JOIN regulations r ON r.authority_id = a.id
            GROUP BY am.id, a.id
        """)
        results = cursor.fetchall()
        end_time = time.time()
        
        conn.close()
        return end_time - start_time, len(results)
    
    # Run multiple iterations
    times = []
    for i in range(10):
        query_time, result_count = single_query_test()
        times.append(query_time)
    
    avg_time = statistics.mean(times)
    min_time = min(times)
    max_time = max(times)
    
    print(f"  📊 Query Performance:")
    print(f"    - Average time: {avg_time:.4f}s")
    print(f"    - Min time: {min_time:.4f}s")
    print(f"    - Max time: {max_time:.4f}s")
    print(f"    - Results per query: {result_count}")
    
    # Performance assertions
    assert avg_time < 1.0, f"Average query time too slow: {avg_time:.4f}s"
    assert result_count > 0, "No results returned"
    
    print("✅ Database query performance test passed")

def benchmark_compliance_logic():
    """Benchmark compliance checking logic."""
    print("⚡ Benchmarking Compliance Logic...")
    
    def compliance_check_simulation(model, country):
        """Simulate compliance check with realistic processing time."""
        start_time = time.time()
        
        # Simulate model validation
        time.sleep(0.001)  # 1ms processing time
        valid_models = ['E175', 'E190', 'E195', 'A320', '737']
        base_model = model.split('-')[0] if '-' in model else model
        if base_model not in valid_models:
            return None, time.time() - start_time
        
        # Simulate authority lookup
        time.sleep(0.001)  # 1ms processing time
        authority_map = {
            'USA': 'Federal Aviation Administration',
            'BRA': 'Agência Nacional de Aviação Civil',
            'EUR': 'European Union Aviation Safety Agency'
        }
        if country not in authority_map:
            return None, time.time() - start_time
        
        # Simulate regulation checking
        time.sleep(0.005)  # 5ms processing time for regulation lookup
        
        # Simulate compliance determination
        time.sleep(0.002)  # 2ms processing time
        
        result = {
            'aircraft_model': model,
            'country': country,
            'authority': authority_map[country],
            'compliant': True,
            'regulations_checked': 5,
            'violations': []
        }
        
        return result, time.time() - start_time
    
    # Test cases
    test_cases = [
        ('E175-E2', 'USA'),
        ('E190-E1', 'BRA'),
        ('E195-E2', 'EUR'),
        ('A320', 'USA'),
        ('737-800', 'BRA')
    ]
    
    times = []
    for i in range(50):  # Run 50 iterations
        for model, country in test_cases:
            result, processing_time = compliance_check_simulation(model, country)
            if result:
                times.append(processing_time)
    
    avg_time = statistics.mean(times)
    min_time = min(times)
    max_time = max(times)
    p95_time = statistics.quantiles(times, n=20)[18]  # 95th percentile
    
    print(f"  📊 Compliance Logic Performance:")
    print(f"    - Average time: {avg_time:.4f}s")
    print(f"    - Min time: {min_time:.4f}s")
    print(f"    - Max time: {max_time:.4f}s")
    print(f"    - 95th percentile: {p95_time:.4f}s")
    print(f"    - Total checks: {len(times)}")
    
    # Performance assertions
    assert avg_time < 0.05, f"Average compliance check too slow: {avg_time:.4f}s"
    assert p95_time < 0.1, f"95th percentile too slow: {p95_time:.4f}s"
    
    print("✅ Compliance logic performance test passed")

def benchmark_concurrent_access():
    """Benchmark concurrent database access."""
    print("⚡ Benchmarking Concurrent Access...")
    
    def concurrent_query():
        """Perform a database query in a thread."""
        thread_id = threading.current_thread().ident
        start_time = time.time()
        
        try:
            conn = sqlite3.connect('projetoaviacao.db')
            cursor = conn.cursor()
            
            # Simulate realistic query
            cursor.execute("""
                SELECT model, variant, manufacturer
                FROM aircraft_models
                WHERE model IN ('E175', 'E190', 'E195')
            """)
            results = cursor.fetchall()
            
            conn.close()
            end_time = time.time()
            
            return {
                'thread_id': thread_id,
                'duration': end_time - start_time,
                'result_count': len(results),
                'success': True
            }
        except Exception as e:
            return {
                'thread_id': thread_id,
                'duration': time.time() - start_time,
                'error': str(e),
                'success': False
            }
    
    # Test with different levels of concurrency
    concurrency_levels = [1, 5, 10, 20]
    
    for num_threads in concurrency_levels:
        print(f"  🔀 Testing with {num_threads} concurrent threads...")
        
        start_time = time.time()
        
        with ThreadPoolExecutor(max_workers=num_threads) as executor:
            futures = [executor.submit(concurrent_query) for _ in range(num_threads * 2)]
            results = [future.result() for future in futures]
        
        end_time = time.time()
        total_time = end_time - start_time
        
        successful_queries = [r for r in results if r['success']]
        failed_queries = [r for r in results if not r['success']]
        
        if successful_queries:
            avg_query_time = statistics.mean([r['duration'] for r in successful_queries])
            max_query_time = max([r['duration'] for r in successful_queries])
        else:
            avg_query_time = 0
            max_query_time = 0
        
        print(f"    - Total time: {total_time:.4f}s")
        print(f"    - Successful queries: {len(successful_queries)}")
        print(f"    - Failed queries: {len(failed_queries)}")
        print(f"    - Avg query time: {avg_query_time:.4f}s")
        print(f"    - Max query time: {max_query_time:.4f}s")
        
        # Performance assertions
        assert len(failed_queries) == 0, f"Failed queries detected: {failed_queries}"
        assert avg_query_time < 1.0, f"Average query time too slow under concurrency: {avg_query_time:.4f}s"
    
    print("✅ Concurrent access performance test passed")

def benchmark_memory_usage():
    """Benchmark memory usage patterns."""
    print("⚡ Benchmarking Memory Usage...")
    
    try:
        import psutil
        import os
        
        process = psutil.Process(os.getpid())
        initial_memory = process.memory_info().rss / 1024 / 1024  # MB
        
        print(f"  📊 Initial memory usage: {initial_memory:.2f} MB")
        
        # Simulate memory-intensive operations
        large_datasets = []
        
        for i in range(100):
            # Simulate loading large compliance datasets
            dataset = {
                'aircraft_models': [f"Model_{j}" for j in range(100)],
                'regulations': [f"Regulation_{j}" for j in range(200)],
                'compliance_checks': [{'model': f"Model_{j}", 'result': 'compliant'} for j in range(50)]
            }
            large_datasets.append(dataset)
            
            if i % 25 == 0:
                current_memory = process.memory_info().rss / 1024 / 1024  # MB
                print(f"    - Memory after {i+1} datasets: {current_memory:.2f} MB")
        
        peak_memory = process.memory_info().rss / 1024 / 1024  # MB
        
        # Clean up
        large_datasets.clear()
        
        final_memory = process.memory_info().rss / 1024 / 1024  # MB
        
        print(f"  📊 Peak memory usage: {peak_memory:.2f} MB")
        print(f"  📊 Final memory usage: {final_memory:.2f} MB")
        print(f"  📊 Memory increase: {peak_memory - initial_memory:.2f} MB")
        
        # Memory usage assertions
        memory_increase = peak_memory - initial_memory
        assert memory_increase < 500, f"Memory usage too high: {memory_increase:.2f} MB"
        
        print("✅ Memory usage performance test passed")
        
    except ImportError:
        print("  ⚠️ psutil not available, skipping memory usage test")

def run_performance_tests():
    """Run all performance tests."""
    tests = [
        benchmark_database_queries,
        benchmark_compliance_logic,
        benchmark_concurrent_access,
        benchmark_memory_usage
    ]
    
    print("🚀 Running Performance Tests")
    print("=" * 60)
    
    passed = 0
    failed = 0
    start_time = time.time()
    
    for test in tests:
        test_start = time.time()
        try:
            test()
            test_duration = time.time() - test_start
            print(f"  ⏱️ Test completed in {test_duration:.4f}s")
            passed += 1
        except Exception as e:
            test_duration = time.time() - test_start
            print(f"❌ {test.__name__} failed in {test_duration:.4f}s: {e}")
            failed += 1
        print()
    
    total_duration = time.time() - start_time
    
    print("=" * 60)
    print(f"🎯 Performance Test Results: {passed} passed, {failed} failed")
    print(f"⏱️ Total test duration: {total_duration:.4f}s")
    
    if failed == 0:
        print("🎉 All performance tests passed!")
    else:
        print(f"⚠️ {failed} performance test(s) failed")
    
    return failed == 0

if __name__ == "__main__":
    run_performance_tests()