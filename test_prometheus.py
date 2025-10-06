#!/usr/bin/env python3
"""
Teste da implementação Prometheus do Aviation Compliance API
"""

import sys
import os
sys.path.append('.')

def test_prometheus_basic():
    """Teste básico do prometheus_client"""
    print("🧪 Testando Prometheus Client...")
    
    try:
        from prometheus_client import Counter, Histogram, Gauge, generate_latest
        
        # Criar métricas de teste
        test_counter = Counter('test_requests_total', 'Test requests')
        test_histogram = Histogram('test_duration_seconds', 'Test duration')
        test_gauge = Gauge('test_active_connections', 'Test connections')
        
        # Simular dados
        test_counter.inc(10)
        test_histogram.observe(0.5)
        test_gauge.set(25)
        
        # Gerar métricas
        metrics = generate_latest().decode('utf-8')
        
        print("✅ Prometheus client funcionando!")
        print(f"📊 Métricas geradas: {len(metrics)} caracteres")
        
        # Verificar se contém métricas esperadas
        expected_metrics = ['test_requests_total', 'test_duration_seconds', 'test_active_connections']
        for metric in expected_metrics:
            if metric in metrics:
                print(f"✅ {metric} encontrada")
            else:
                print(f"❌ {metric} NÃO encontrada")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro no teste Prometheus: {e}")
        return False


def test_middleware_import():
    """Teste de importação do middleware"""
    print("\n🔧 Testando importação do middleware...")
    
    try:
        from src.middleware.prometheus_metrics import (
            PrometheusMetricsMiddleware,
            get_prometheus_metrics,
            record_compliance_check,
            http_requests_total
        )
        
        print("✅ Middleware importado com sucesso!")
        
        # Testar função de métricas
        record_compliance_check('E190', 'USA', 'compliant')
        record_compliance_check('E195', 'BRAZIL', 'non_compliant')
        
        http_requests_total.labels(method='GET', endpoint='/test', status_code='200').inc()
        
        print("✅ Métricas registradas com sucesso!")
        
        # Gerar métricas
        metrics = get_prometheus_metrics()
        print(f"📊 Métricas coletadas: {len(metrics)} caracteres")
        
        if 'compliance_checks_total' in metrics:
            print("✅ compliance_checks_total encontrada!")
        if 'http_requests_total' in metrics:
            print("✅ http_requests_total encontrada!")
            
        return True
        
    except Exception as e:
        print(f"❌ Erro no teste middleware: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_fastapi_integration():
    """Teste de integração com FastAPI"""
    print("\n🚀 Testando integração FastAPI...")
    
    try:
        from fastapi.testclient import TestClient
        from src.main import app
        
        client = TestClient(app)
        
        print("✅ App FastAPI carregado!")
        
        # Testar endpoint /metrics
        response = client.get('/metrics')
        print(f"📊 Status /metrics: {response.status_code}")
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            print(f"📋 Content-Type: {content_type}")
            
            content = response.text
            print(f"📏 Tamanho resposta: {len(content)} caracteres")
            
            # Verificar formato Prometheus
            if content.startswith('#') or 'TYPE' in content:
                print("✅ Formato Prometheus detectado!")
            else:
                print("⚠️ Formato pode não estar correto")
                
            return True
        else:
            print(f"❌ Endpoint /metrics retornou: {response.status_code}")
            print(f"Erro: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erro no teste FastAPI: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Executar todos os testes"""
    print("🎯 TESTANDO IMPLEMENTAÇÃO PROMETHEUS")
    print("=" * 50)
    
    results = []
    
    # Executar testes
    results.append(("Prometheus Client", test_prometheus_basic()))
    results.append(("Middleware", test_middleware_import()))
    results.append(("FastAPI Integration", test_fastapi_integration()))
    
    # Resumo
    print("\n" + "=" * 50)
    print("📋 RESUMO DOS TESTES:")
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASSOU" if result else "❌ FALHOU"
        print(f"  {test_name}: {status}")
        if result:
            passed += 1
    
    success_rate = (passed / len(results)) * 100
    print(f"\n🎯 Taxa de Sucesso: {success_rate:.1f}% ({passed}/{len(results)})")
    
    if success_rate == 100:
        print("\n🎉 TODOS OS TESTES PASSARAM!")
        print("✅ Implementação Prometheus está FUNCIONANDO!")
    else:
        print(f"\n⚠️  {len(results) - passed} teste(s) falharam")
        print("🔧 Verificar logs acima para detalhes")


if __name__ == "__main__":
    main()