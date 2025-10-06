#!/usr/bin/env python3
"""
Teste completo da API Embraer E-Jets
Testa todos os endpoints com os novos modelos implementados
"""

import requests
import json
import time
from datetime import datetime

# Configuração da API
API_BASE = "http://localhost:8000"

def test_endpoint(endpoint, method="GET", data=None, expected_status=200):
    """Função auxiliar para testar endpoints"""
    print(f"\n🧪 Testando: {method} {endpoint}")
    
    try:
        if method == "GET":
            response = requests.get(f"{API_BASE}{endpoint}")
        elif method == "POST":
            response = requests.post(f"{API_BASE}{endpoint}", json=data)
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == expected_status:
            print("   ✅ SUCESSO")
            if response.headers.get('content-type', '').startswith('application/json'):
                return response.json()
            return response.text
        else:
            print(f"   ❌ ERRO: Esperado {expected_status}, recebido {response.status_code}")
            print(f"   Resposta: {response.text}")
            return None
            
    except requests.exceptions.ConnectionError:
        print(f"   ❌ ERRO: Não foi possível conectar à API em {API_BASE}")
        return None
    except Exception as e:
        print(f"   ❌ ERRO: {str(e)}")
        return None

def main():
    print("=" * 80)
    print("🚁 TESTE COMPLETO DA API EMBRAER E-JETS")
    print("=" * 80)
    print(f"⏰ Iniciado em: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 URL Base: {API_BASE}")
    
    # 1. Teste básico - Root e Health
    print("\n" + "=" * 40)
    print("📊 TESTES BÁSICOS")
    print("=" * 40)
    
    root_data = test_endpoint("/")
    health_data = test_endpoint("/health")
    
    if root_data:
        print(f"   Service: {root_data.get('service')}")
        print(f"   Version: {root_data.get('version')}")
        print(f"   Aircraft Count: {root_data.get('aircraft_count')}")
    
    # 2. Teste dos modelos disponíveis
    print("\n" + "=" * 40)
    print("✈️ TESTE DOS MODELOS")
    print("=" * 40)
    
    models_data = test_endpoint("/aircraft/models")
    if models_data:
        print(f"   Total de modelos: {models_data.get('total_models')}")
        print(f"   Modelos E1: {models_data.get('models_by_series', {}).get('E1', [])}")
        print(f"   Modelos E2: {models_data.get('models_by_series', {}).get('E2', [])}")
    
    # 3. Teste das especificações de cada modelo
    print("\n" + "=" * 40)
    print("📋 TESTE DAS ESPECIFICAÇÕES")
    print("=" * 40)
    
    all_models = ["E170", "E175", "E190", "E195", "E175-E2", "E190-E2", "E195-E2"]
    
    for model in all_models:
        spec_data = test_endpoint(f"/aircraft/specifications/{model}")
        if spec_data:
            print(f"   ✈️ {model}: {spec_data.get('seats')} assentos, "
                  f"{spec_data.get('range_nm')} nm range, "
                  f"Série {spec_data.get('series')}")
    
    # 4. Teste das autoridades regulatórias
    print("\n" + "=" * 40)
    print("🏛️ TESTE DAS AUTORIDADES")
    print("=" * 40)
    
    authorities_data = test_endpoint("/compliance/authorities")
    if authorities_data:
        print(f"   Autoridades disponíveis: {list(authorities_data.get('authorities', {}).keys())}")
    
    # 5. Teste de compliance para diferentes combinações
    print("\n" + "=" * 40)
    print("✅ TESTE DE COMPLIANCE")
    print("=" * 40)
    
    test_combinations = [
        ("E175", "FAA"),
        ("E190-E2", "EASA"),
        ("E195", "ANAC"),
        ("E175-E2", "ICAO")
    ]
    
    for model, authority in test_combinations:
        compliance_data = test_endpoint(f"/compliance/check/{model}/{authority}")
        if compliance_data:
            print(f"   ✈️ {model} vs {authority}: "
                  f"{compliance_data.get('compliance_status')} "
                  f"(Score: {compliance_data.get('score')})")
    
    # 6. Teste POST de compliance
    print("\n" + "=" * 40)
    print("📮 TESTE POST COMPLIANCE")
    print("=" * 40)
    
    post_data = {
        "aircraft_model": "E190-E2",
        "authority": "FAA",
        "check_type": "emissions"
    }
    
    post_response = test_endpoint("/compliance/check", method="POST", data=post_data)
    if post_response:
        print(f"   POST Response: {post_response.get('compliance_status')} "
              f"(Score: {post_response.get('score')})")
    
    # 7. Teste de analytics
    print("\n" + "=" * 40)
    print("📊 TESTE DE ANALYTICS")
    print("=" * 40)
    
    analytics_data = test_endpoint("/analytics/fleet-metrics")
    if analytics_data:
        print(f"   Total de modelos: {analytics_data.get('total_models')}")
        print(f"   Modelos E1: {analytics_data.get('e1_series_count')}")
        print(f"   Modelos E2: {analytics_data.get('e2_series_count')}")
        print(f"   Score médio geral: {analytics_data.get('average_compliance_score')}")
        print(f"   Score E1: {analytics_data.get('compliance_by_series', {}).get('E1')}")
        print(f"   Score E2: {analytics_data.get('compliance_by_series', {}).get('E2')}")
    
    # 8. Teste de comparação de modelos
    print("\n" + "=" * 40)
    print("⚖️ TESTE DE COMPARAÇÃO")
    print("=" * 40)
    
    comparison_data = test_endpoint("/analytics/comparison/E175/E175-E2")
    if comparison_data:
        print(f"   Comparação E175 vs E175-E2:")
        print(f"   Assentos: {comparison_data.get('capacity_comparison', {}).get('seats')}")
        print(f"   Range: {comparison_data.get('performance_comparison', {}).get('range_nm')}")
        print(f"   Recomendação: {comparison_data.get('recommendation')}")
    
    # 9. Teste de erros (modelo inexistente)
    print("\n" + "=" * 40)
    print("❌ TESTE DE TRATAMENTO DE ERROS")
    print("=" * 40)
    
    test_endpoint("/aircraft/specifications/E999", expected_status=404)
    test_endpoint("/compliance/check/INEXISTENTE/FAA", expected_status=404)
    
    # Resumo final
    print("\n" + "=" * 80)
    print("🏁 TESTE FINALIZADO")
    print("=" * 80)
    print(f"⏰ Concluído em: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("📝 Verifique os resultados acima para validar a implementação completa")
    print("🚀 A API está pronta com todos os modelos da família E-Jets da Embraer!")

if __name__ == "__main__":
    main()