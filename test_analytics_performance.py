"""
Teste de performance específico para endpoints de Analytics e Metrics.
"""
import requests
import time
import statistics  
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Dict, List


class AnalyticsPerformanceTester:
    """Tester de performance para endpoints de analytics."""
    
    def __init__(self, base_url: str = "http://127.0.0.1:8001"):
        self.base_url = base_url
        self.session = requests.Session()
        
    def test_endpoint(self, endpoint: str, params: Dict = None) -> Dict:
        """Testa performance de um endpoint específico."""
        url = f"{self.base_url}{endpoint}"
        
        start_time = time.time()
        try:
            response = self.session.get(url, params=params, timeout=10)
            end_time = time.time()
            
            return {
                "endpoint": endpoint,
                "success": response.status_code == 200,
                "status_code": response.status_code,
                "response_time": end_time - start_time,
                "response_size": len(response.content) if response.content else 0,
                "error": None
            }
        except Exception as e:
            end_time = time.time()
            return {
                "endpoint": endpoint, 
                "success": False,
                "status_code": 0,
                "response_time": end_time - start_time,
                "response_size": 0,
                "error": str(e)
            }
    
    def concurrent_test(self, endpoint: str, num_requests: int, max_workers: int = 5) -> List[Dict]:
        """Testa endpoint com múltiplas requisições concorrentes."""
        results = []
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = [executor.submit(self.test_endpoint, endpoint) for _ in range(num_requests)]
            
            for future in as_completed(futures):
                results.append(future.result())
        
        return results
    
    def analyze_results(self, results: List[Dict]) -> Dict:
        """Analisa resultados dos testes."""
        successful = [r for r in results if r["success"]]
        failed = [r for r in results if not r["success"]]
        
        if not successful:
            return {
                "total_requests": len(results),
                "successful": 0,
                "failed": len(failed),
                "success_rate": 0,
                "avg_response_time": 0,
                "min_response_time": 0,
                "max_response_time": 0,
                "p95_response_time": 0,
                "p99_response_time": 0
            }
        
        response_times = [r["response_time"] for r in successful]
        
        return {
            "total_requests": len(results),
            "successful": len(successful),
            "failed": len(failed),
            "success_rate": (len(successful) / len(results)) * 100,
            "avg_response_time": statistics.mean(response_times),
            "min_response_time": min(response_times),
            "max_response_time": max(response_times),
            "p95_response_time": statistics.quantiles(response_times, n=20)[18] if len(response_times) >= 20 else max(response_times),
            "p99_response_time": statistics.quantiles(response_times, n=100)[98] if len(response_times) >= 100 else max(response_times),
            "avg_response_size": statistics.mean([r["response_size"] for r in successful])
        }


def test_analytics_endpoints():
    """Testa todos os endpoints de analytics e metrics."""
    print("🚀 Iniciando Teste de Performance - Analytics & Metrics")
    print("=" * 70)
    
    tester = AnalyticsPerformanceTester()
    
    # Endpoints para testar
    endpoints = [
        "/analytics/fleet-metrics",
        "/analytics/compliance-trends", 
        "/analytics/alerts",
        "/analytics/performance-metrics",
        "/analytics/requirements-summary",
        "/metrics/",
        "/metrics/health"
    ]
    
    # Teste de endpoint individual (warm-up)
    print("🔥 Warm-up: Testando cada endpoint individualmente...")
    for endpoint in endpoints:
        result = tester.test_endpoint(endpoint)
        status = "✅" if result["success"] else "❌"
        print(f"  {status} {endpoint}: {result['response_time']*1000:.2f}ms")
    
    print("\n📊 Testes de Performance por Endpoint:")
    print("-" * 70)
    
    # Teste cada endpoint com carga
    all_results = {}
    
    for endpoint in endpoints:
        print(f"\n🔍 Testando {endpoint}...")
        
        # Teste com diferentes cargas
        light_results = tester.concurrent_test(endpoint, num_requests=10, max_workers=2)
        medium_results = tester.concurrent_test(endpoint, num_requests=25, max_workers=5)  
        
        light_analysis = tester.analyze_results(light_results)
        medium_analysis = tester.analyze_results(medium_results)
        
        all_results[endpoint] = {
            "light": light_analysis,
            "medium": medium_analysis
        }
        
        print(f"  📈 Carga Leve (10 req, 2 workers):")
        print(f"    • Taxa de Sucesso: {light_analysis['success_rate']:.1f}%")
        print(f"    • Tempo Médio: {light_analysis['avg_response_time']*1000:.2f}ms")
        print(f"    • P95: {light_analysis['p95_response_time']*1000:.2f}ms")
        
        print(f"  📈 Carga Média (25 req, 5 workers):")
        print(f"    • Taxa de Sucesso: {medium_analysis['success_rate']:.1f}%")
        print(f"    • Tempo Médio: {medium_analysis['avg_response_time']*1000:.2f}ms")
        print(f"    • P95: {medium_analysis['p95_response_time']*1000:.2f}ms")
    
    # Resumo geral
    print("\n" + "=" * 70)
    print("📋 RESUMO GERAL DE PERFORMANCE")
    print("=" * 70)
    
    # Endpoint mais rápido e mais lento
    medium_avg_times = {ep: data["medium"]["avg_response_time"] for ep, data in all_results.items() if data["medium"]["successful"] > 0}
    
    if medium_avg_times:
        fastest_endpoint = min(medium_avg_times, key=medium_avg_times.get)
        slowest_endpoint = max(medium_avg_times, key=medium_avg_times.get)
        
        print(f"🏆 Endpoint Mais Rápido: {fastest_endpoint} ({medium_avg_times[fastest_endpoint]*1000:.2f}ms)")
        print(f"🐌 Endpoint Mais Lento: {slowest_endpoint} ({medium_avg_times[slowest_endpoint]*1000:.2f}ms)")
    
    # Análise de problemas
    print("\n🔍 ANÁLISE DE PROBLEMAS:")
    
    problematic_endpoints = []
    for endpoint, data in all_results.items():
        medium = data["medium"]
        
        # Critérios de problema
        if medium["success_rate"] < 95:
            problematic_endpoints.append(f"{endpoint} - Taxa de sucesso baixa: {medium['success_rate']:.1f}%")
        
        if medium["avg_response_time"] > 2.0:  # > 2 segundos
            problematic_endpoints.append(f"{endpoint} - Tempo de resposta alto: {medium['avg_response_time']*1000:.2f}ms")
        
        if medium["p95_response_time"] > 5.0:  # P95 > 5 segundos  
            problematic_endpoints.append(f"{endpoint} - P95 muito alto: {medium['p95_response_time']*1000:.2f}ms")
    
    if problematic_endpoints:
        print("❌ Problemas encontrados:")
        for problem in problematic_endpoints:
            print(f"  • {problem}")
    else:
        print("✅ Todos os endpoints estão dentro dos critérios aceitáveis!")
    
    # Recomendações
    print("\n💡 RECOMENDAÇÕES:")
    print("• Endpoints com tempo > 1s: Considerar cache/otimização de queries")
    print("• Taxa de sucesso < 95%: Investigar causas de falha")
    print("• P95 > 2s: Analisar gargalos de performance")
    print("• Implementar cache Redis para endpoints de analytics")
    print("• Adicionar paginação para endpoints com grandes datasets")
    
    return all_results


if __name__ == "__main__":
    # Verificar se servidor está rodando
    try:
        response = requests.get("http://127.0.0.1:8001/health", timeout=5)
        if response.status_code == 200:
            print("✅ Servidor detectado. Iniciando testes...")
            test_analytics_endpoints()
        else:
            print("❌ Servidor não está respondendo corretamente")
    except requests.exceptions.RequestException:
        print("❌ Servidor não está executando em http://127.0.0.1:8001")
        print("   Inicie o servidor com: uvicorn src.main:app --port 8001")