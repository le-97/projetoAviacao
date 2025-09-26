#!/usr/bin/env python3
"""
Script de teste automatizado para o sistema de conformidade aeronáutica
Testa conectividade frontend-backend e funcionalidades AI
"""

import requests
import json
import time
import sys
from typing import Dict, Any

class ComplianceTestSuite:
    def __init__(self, backend_url: str = "http://localhost:8000", frontend_url: str = "http://localhost:5173"):
        self.backend_url = backend_url
        self.frontend_url = frontend_url
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log dos resultados dos testes"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": time.time()
        }
        self.test_results.append(result)
        
        status = "✅ PASSOU" if success else "❌ FALHOU"
        print(f"{status} | {test_name}")
        if details:
            print(f"   📝 {details}")

    def test_backend_health(self) -> bool:
        """Testa health check do backend"""
        try:
            response = requests.get(f"{self.backend_url}/health", timeout=5)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {data.get('status', 'unknown')}"
            else:
                details = f"HTTP {response.status_code}"
                
            self.log_test("Backend Health Check", success, details)
            return success
        except Exception as e:
            self.log_test("Backend Health Check", False, str(e))
            return False

    def test_ai_analysis_endpoint(self) -> bool:
        """Testa endpoint de análise AI"""
        test_cases = [
            ("e190", "US"),
            ("phenom300", "EU"),
            ("kc390", "CA"),
            ("e195", "AR")
        ]
        
        all_passed = True
        
        for aircraft, country in test_cases:
            try:
                response = requests.get(
                    f"{self.backend_url}/compliance/ai-analysis/{aircraft}/{country}",
                    timeout=10
                )
                success = response.status_code == 200
                
                if success:
                    data = response.json()
                    ai_enhanced = data.get('aiEnhanced', False)
                    confidence = data.get('aiAnalysis', {}).get('classification', {}).get('confidence', 0)
                    details = f"AI Enhanced: {ai_enhanced}, Confidence: {confidence:.2f}"
                else:
                    details = f"HTTP {response.status_code}"
                    
                self.log_test(f"AI Analysis {aircraft} -> {country}", success, details)
                all_passed = all_passed and success
                
            except Exception as e:
                self.log_test(f"AI Analysis {aircraft} -> {country}", False, str(e))
                all_passed = False
                
        return all_passed

    def test_compliance_validation(self) -> bool:
        """Testa endpoint de validação tradicional"""
        try:
            payload = {
                "aircraftModel": "e190",
                "country": "US"
            }
            
            response = requests.post(
                f"{self.backend_url}/compliance/validate",
                json=payload,
                timeout=10
            )
            
            success = response.status_code == 200
            
            if success:
                data = response.json()
                compliant = data.get('compliant', False)
                confidence = data.get('confidence', 0)
                details = f"Compliant: {compliant}, Confidence: {confidence:.2f}"
            else:
                details = f"HTTP {response.status_code}"
                
            self.log_test("Traditional Compliance Validation", success, details)
            return success
            
        except Exception as e:
            self.log_test("Traditional Compliance Validation", False, str(e))
            return False

    def test_frontend_accessibility(self) -> bool:
        """Testa se o frontend está acessível"""
        try:
            response = requests.get(self.frontend_url, timeout=5)
            success = response.status_code == 200
            
            details = f"HTTP {response.status_code}"
            if success and "React" in response.text:
                details += " | React app detected"
                
            self.log_test("Frontend Accessibility", success, details)
            return success
            
        except Exception as e:
            self.log_test("Frontend Accessibility", False, str(e))
            return False

    def test_cors_configuration(self) -> bool:
        """Testa configuração CORS entre frontend e backend"""
        try:
            response = requests.options(
                f"{self.backend_url}/compliance/ai-analysis/e190/US",
                headers={
                    'Origin': self.frontend_url,
                    'Access-Control-Request-Method': 'GET'
                },
                timeout=5
            )
            
            success = response.status_code == 200
            cors_header = response.headers.get('Access-Control-Allow-Origin', '')
            
            details = f"CORS Origin: {cors_header}"
            
            self.log_test("CORS Configuration", success, details)
            return success
            
        except Exception as e:
            self.log_test("CORS Configuration", False, str(e))
            return False

    def run_comprehensive_test(self) -> Dict[str, Any]:
        """Executa suite completa de testes"""
        print("🚀 Iniciando Testes do Sistema de Conformidade Aeronáutica")
        print("=" * 60)
        
        # Testes individuais
        tests = [
            ("Backend Health", self.test_backend_health),
            ("Frontend Access", self.test_frontend_accessibility),
            ("CORS Setup", self.test_cors_configuration),
            ("AI Analysis", self.test_ai_analysis_endpoint),
            ("Traditional Validation", self.test_compliance_validation)
        ]
        
        total_tests = len(tests)
        passed_tests = 0
        
        for test_name, test_func in tests:
            print(f"\n🔍 Executando: {test_name}")
            if test_func():
                passed_tests += 1
                
        # Sumário final
        print("\n" + "=" * 60)
        print("📊 RELATÓRIO FINAL")
        print("=" * 60)
        
        success_rate = (passed_tests / total_tests) * 100
        print(f"✅ Testes Aprovados: {passed_tests}/{total_tests} ({success_rate:.1f}%)")
        
        if success_rate == 100:
            print("🎉 TODOS OS TESTES PASSARAM! Sistema pronto para produção.")
        elif success_rate >= 80:
            print("⚠️  Sistema funcional, mas com algumas questões menores.")
        else:
            print("❌ Sistema requer correções antes da produção.")
            
        # Próximos passos
        print("\n📋 PRÓXIMOS PASSOS:")
        if success_rate == 100:
            print("1. ✅ Deploy para Azure Container Apps")
            print("2. ✅ Configurar monitoramento de produção")
            print("3. ✅ Implementar testes de carga")
        else:
            print("1. 🔧 Corrigir testes que falharam")
            print("2. 🔄 Re-executar suite de testes")
            print("3. 📈 Validar performance após correções")
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "success_rate": success_rate,
            "ready_for_production": success_rate == 100,
            "test_results": self.test_results
        }

if __name__ == "__main__":
    # Permite customização via argumentos
    backend_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    frontend_url = sys.argv[2] if len(sys.argv) > 2 else "http://localhost:5173"
    
    tester = ComplianceTestSuite(backend_url, frontend_url)
    results = tester.run_comprehensive_test()
    
    # Salva resultados
    with open("test_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Resultados salvos em: test_results.json")
    
    # Exit code baseado no sucesso
    sys.exit(0 if results["ready_for_production"] else 1)