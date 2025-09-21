"""
Script de teste para o servidor MCP de aviação
Versão simplificada para prova de conceito
"""

import asyncio
import json
from datetime import datetime
from typing import Dict, Any, List
import logging

# Simulação de modelos leves para POC
class MockHuggingFaceModels:
    """Simulação de modelos do Hugging Face para teste"""
    
    @staticmethod
    def classify_compliance(context: str) -> Dict[str, Any]:
        """Simula classificação de conformidade"""
        # Lógica simples baseada em palavras-chave
        if "FAA" in context and "certificate" in context.lower():
            return {"label": "COMPLIANT", "score": 0.85}
        elif "EASA" in context and "pending" in context.lower():
            return {"label": "PENDING", "score": 0.70}
        else:
            return {"label": "NON_COMPLIANT", "score": 0.60}
    
    @staticmethod
    def extract_entities(text: str) -> List[Dict[str, Any]]:
        """Simula extração de entidades"""
        entities = []
        
        # Detectar modelos de aeronave
        aircraft_models = ["E190", "E195", "Phenom 300", "Legacy 500", "KC-390"]
        for model in aircraft_models:
            if model.lower() in text.lower():
                entities.append({
                    "entity": "AIRCRAFT",
                    "word": model,
                    "score": 0.9
                })
        
        # Detectar autoridades
        authorities = ["FAA", "EASA", "ANAC", "Transport Canada"]
        for authority in authorities:
            if authority in text:
                entities.append({
                    "entity": "AUTHORITY",
                    "word": authority,
                    "score": 0.95
                })
        
        return entities
    
    @staticmethod
    def generate_insights(prompt: str) -> str:
        """Simula geração de insights"""
        insights = [
            "Consider bilateral aviation safety agreements",
            "Review noise certification requirements",
            "Validate emission compliance standards",
            "Check for recent regulatory updates",
            "Ensure maintenance program approval"
        ]
        
        # Retorna insight baseado no contexto
        if "noise" in prompt.lower():
            return "Aircraft noise levels must comply with ICAO Annex 16 standards"
        elif "emission" in prompt.lower():
            return "Emission standards require CAEP compliance certification"
        elif "military" in prompt.lower():
            return "Military aircraft require additional ITAR compliance for international operations"
        else:
            return insights[len(prompt) % len(insights)]
    
    @staticmethod
    def calculate_similarity(text1: str, text2: str) -> float:
        """Simula cálculo de similaridade"""
        # Similaridade simples baseada em palavras comuns
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union) if union else 0.0

class LightweightAviationAnalyzer:
    """Analisador leve para prova de conceito"""
    
    def __init__(self):
        self.models = MockHuggingFaceModels()
        self.aircraft_db = self._load_aircraft_database()
        self.regulation_db = self._load_regulation_database()
        
        # Configurar logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
    
    def _load_aircraft_database(self) -> Dict[str, Any]:
        """Base de dados simplificada de aeronaves"""
        return {
            'e190': {
                'name': 'Embraer E190',
                'category': 'commercial',
                'mtow': 56000,
                'capacity': 114,
                'noise_level': 85.7,
                'certifications': ['ANAC', 'FAA', 'EASA'],
                'compliance_factors': {
                    'noise_compliant': True,
                    'emission_compliant': True,
                    'size_category': 'regional'
                }
            },
            'e195': {
                'name': 'Embraer E195',
                'category': 'commercial',
                'mtow': 61900,
                'capacity': 146,
                'noise_level': 87.2,
                'certifications': ['ANAC', 'FAA', 'EASA'],
                'compliance_factors': {
                    'noise_compliant': True,
                    'emission_compliant': True,
                    'size_category': 'regional'
                }
            },
            'phenom300': {
                'name': 'Phenom 300',
                'category': 'business',
                'mtow': 8150,
                'capacity': 11,
                'noise_level': 78.5,
                'certifications': ['ANAC', 'FAA', 'EASA'],
                'compliance_factors': {
                    'noise_compliant': True,
                    'emission_compliant': True,
                    'size_category': 'light_jet'
                }
            },
            'kc390': {
                'name': 'KC-390 Millennium',
                'category': 'military',
                'mtow': 87000,
                'capacity': 80,
                'noise_level': 92.5,
                'certifications': ['ANAC', 'FAA'],
                'compliance_factors': {
                    'noise_compliant': False,
                    'emission_compliant': False,
                    'size_category': 'transport',
                    'itar_required': True
                }
            }
        }
    
    def _load_regulation_database(self) -> Dict[str, Any]:
        """Base de dados simplificada de regulamentações"""
        return {
            'US': {
                'authority': 'FAA',
                'requirements': [
                    'Type Certificate',
                    'Airworthiness Certificate',
                    'Aircraft Registration',
                    'Noise Certificate'
                ],
                'special_rules': {
                    'noise_limit': 90.0,
                    'emission_required': True,
                    'military_itar': True
                },
                'bilateral_agreements': ['BASA']
            },
            'EU': {
                'authority': 'EASA',
                'requirements': [
                    'EASA Type Certificate',
                    'Certificate of Airworthiness',
                    'Noise Certificate',
                    'Emission Certificate'
                ],
                'special_rules': {
                    'noise_limit': 87.0,
                    'emission_required': True,
                    'environmental_strict': True
                },
                'bilateral_agreements': ['BASA']
            },
            'UK': {
                'authority': 'CAA',
                'requirements': [
                    'UK Type Certificate',
                    'Certificate of Airworthiness',
                    'Brexit Documentation'
                ],
                'special_rules': {
                    'post_brexit': True,
                    'additional_docs': True
                },
                'bilateral_agreements': []
            },
            'CA': {
                'authority': 'Transport Canada',
                'requirements': [
                    'Type Certificate',
                    'Certificate of Airworthiness'
                ],
                'special_rules': {
                    'noise_limit': 89.0,
                    'cold_weather_ops': True
                },
                'bilateral_agreements': ['BASA']
            }
        }
    
    async def analyze_with_ai_simulation(self, aircraft: str, country: str) -> Dict[str, Any]:
        """Análise usando simulação de IA"""
        
        self.logger.info(f"🤖 Iniciando análise AI simulada: {aircraft} -> {country}")
        
        # Obter dados das bases
        aircraft_data = self.aircraft_db.get(aircraft.lower())
        regulation_data = self.regulation_db.get(country.upper())
        
        if not aircraft_data or not regulation_data:
            return await self._handle_missing_data(aircraft, country)
        
        # Preparar contexto para "análise AI"
        context = self._create_analysis_context(aircraft_data, regulation_data)
        
        # Simular processamento AI
        await asyncio.sleep(0.5)  # Simular tempo de processamento
        
        # Executar "modelos AI"
        ai_results = await self._run_ai_simulation(context, aircraft_data, regulation_data)
        
        # Gerar resultado final
        result = self._compile_results(aircraft, country, aircraft_data, regulation_data, ai_results)
        
        self.logger.info(f"✅ Análise AI concluída com sucesso!")
        return result
    
    def _create_analysis_context(self, aircraft_data: Dict, regulation_data: Dict) -> str:
        """Cria contexto para análise AI"""
        return f"""
        Aircraft: {aircraft_data['name']}
        Category: {aircraft_data['category']}
        MTOW: {aircraft_data['mtow']} kg
        Noise Level: {aircraft_data['noise_level']} EPNdB
        Existing Certifications: {', '.join(aircraft_data['certifications'])}
        
        Target Authority: {regulation_data['authority']}
        Requirements: {', '.join(regulation_data['requirements'])}
        Special Rules: {regulation_data.get('special_rules', {})}
        """
    
    async def _run_ai_simulation(self, context: str, aircraft_data: Dict, regulation_data: Dict) -> Dict[str, Any]:
        """Simula execução de modelos AI"""
        
        results = {}
        
        # 1. Classificação de conformidade
        classification = self.models.classify_compliance(context)
        results['classification'] = classification
        
        # 2. Extração de entidades
        entities = self.models.extract_entities(context)
        results['entities'] = entities
        
        # 3. Geração de insights
        insight = self.models.generate_insights(context)
        results['insight'] = insight
        
        # 4. Análise de similaridade com casos conhecidos
        reference_cases = [
            "Commercial regional jet with international certifications",
            "Business jet with worldwide operations approval",
            "Military transport aircraft with civilian operations"
        ]
        
        similarities = []
        for case in reference_cases:
            similarity = self.models.calculate_similarity(context, case)
            similarities.append({'case': case, 'similarity': similarity})
        
        results['similarities'] = similarities
        
        # 5. Análise específica de conformidade
        compliance_analysis = self._analyze_specific_compliance(aircraft_data, regulation_data)
        results['compliance_details'] = compliance_analysis
        
        return results
    
    def _analyze_specific_compliance(self, aircraft_data: Dict, regulation_data: Dict) -> Dict[str, Any]:
        """Análise específica de conformidade"""
        
        analysis = {
            'certification_status': 'unknown',
            'risk_factors': [],
            'compliance_gaps': [],
            'recommendations': []
        }
        
        target_authority = regulation_data['authority']
        existing_certs = aircraft_data['certifications']
        
        # Verificar certificação existente
        if target_authority in existing_certs:
            analysis['certification_status'] = 'certified'
        elif any(cert in ['FAA', 'EASA'] for cert in existing_certs):
            analysis['certification_status'] = 'validation_required'
        else:
            analysis['certification_status'] = 'new_certification_required'
        
        # Identificar fatores de risco
        special_rules = regulation_data.get('special_rules', {})
        compliance_factors = aircraft_data.get('compliance_factors', {})
        
        # Verificar ruído
        if 'noise_limit' in special_rules:
            if aircraft_data['noise_level'] > special_rules['noise_limit']:
                analysis['risk_factors'].append('Noise level exceeds regulatory limit')
                analysis['compliance_gaps'].append('Additional noise mitigation required')
        
        # Verificar emissões
        if special_rules.get('emission_required') and not compliance_factors.get('emission_compliant'):
            analysis['risk_factors'].append('Emission certification may be required')
        
        # Verificar ITAR (para militares nos EUA)
        if special_rules.get('military_itar') and aircraft_data['category'] == 'military':
            analysis['risk_factors'].append('ITAR compliance required for military aircraft')
            analysis['compliance_gaps'].append('Military export license needed')
        
        # Verificar Brexit (Reino Unido)
        if special_rules.get('post_brexit'):
            analysis['risk_factors'].append('Post-Brexit documentation required')
            analysis['compliance_gaps'].append('Additional UK-specific paperwork')
        
        # Gerar recomendações
        if analysis['certification_status'] == 'certified':
            analysis['recommendations'].append('Monitor for regulatory changes')
        elif analysis['certification_status'] == 'validation_required':
            analysis['recommendations'].append('Initiate certificate validation process')
            analysis['recommendations'].append('Prepare supplemental documentation')
        else:
            analysis['recommendations'].append('Begin full certification process')
            analysis['recommendations'].append('Engage with regulatory authority early')
        
        return analysis
    
    def _compile_results(self, aircraft: str, country: str, aircraft_data: Dict, 
                        regulation_data: Dict, ai_results: Dict) -> Dict[str, Any]:
        """Compila resultados finais"""
        
        # Determinar status geral
        classification = ai_results.get('classification', {})
        compliance_details = ai_results.get('compliance_details', {})
        
        cert_status = compliance_details.get('certification_status', 'unknown')
        if cert_status == 'certified':
            overall_status = 'compliant'
            completion_percentage = 95
        elif cert_status == 'validation_required':
            overall_status = 'pending'
            completion_percentage = 70
        else:
            overall_status = 'non-compliant'
            completion_percentage = 30
        
        # Calcular nível de risco
        risk_factors = compliance_details.get('risk_factors', [])
        if len(risk_factors) == 0:
            risk_level = 'low'
        elif len(risk_factors) <= 2:
            risk_level = 'medium'
        else:
            risk_level = 'high'
        
        # Estimar tempo de conclusão
        estimated_days = None
        if overall_status == 'pending':
            estimated_days = 45 + len(risk_factors) * 15
        elif overall_status == 'non-compliant':
            estimated_days = 90 + len(risk_factors) * 20
        
        # Compilar resultado final
        result = {
            'aircraft': aircraft_data['name'],
            'originCountry': 'Brasil (ANAC)',
            'targetCountry': f"{regulation_data['authority']} ({country})",
            'regulations': [
                {
                    'authority': 'ANAC (Brasil)',
                    'status': 'compliant',
                    'completionPercentage': 100,
                    'requirements': [
                        'Certificado de Aeronavegabilidade (CA)',
                        'Registro Nacional de Aeronaves (RNA)',
                        'Certificado de Matrícula (CM)'
                    ]
                },
                {
                    'authority': regulation_data['authority'],
                    'status': overall_status,
                    'completionPercentage': completion_percentage,
                    'requirements': regulation_data['requirements'],
                    'pendingItems': compliance_details.get('compliance_gaps') if overall_status != 'compliant' else None
                }
            ],
            'overallStatus': overall_status,
            'riskLevel': risk_level,
            'estimatedCompletionDays': estimated_days,
            'generatedAt': datetime.now().isoformat(),
            'aiEnhanced': True,
            'aiAnalysis': {
                'classification': classification,
                'entities': ai_results.get('entities', []),
                'insight': ai_results.get('insight', ''),
                'similarities': ai_results.get('similarities', []),
                'riskFactors': risk_factors,
                'recommendations': compliance_details.get('recommendations', [])
            }
        }
        
        return result
    
    async def _handle_missing_data(self, aircraft: str, country: str) -> Dict[str, Any]:
        """Lida com dados faltantes"""
        return {
            'aircraft': aircraft,
            'originCountry': 'Brasil (ANAC)',
            'targetCountry': country,
            'regulations': [],
            'overallStatus': 'pending',
            'riskLevel': 'medium',
            'estimatedCompletionDays': 60,
            'generatedAt': datetime.now().isoformat(),
            'aiEnhanced': False,
            'error': 'Insufficient data for AI analysis'
        }

# Função de teste principal
async def test_ai_compliance_analysis():
    """Testa a análise de conformidade com IA simulada"""
    
    analyzer = LightweightAviationAnalyzer()
    
    # Casos de teste
    test_cases = [
        ('e190', 'US'),
        ('phenom300', 'EU'),
        ('kc390', 'US'),
        ('e195', 'UK'),
        ('phenom300', 'CA')
    ]
    
    print("🛩️  TESTE DE ANÁLISE DE CONFORMIDADE COM IA SIMULADA")
    print("=" * 60)
    
    for aircraft, country in test_cases:
        print(f"\n🔍 Testando: {aircraft.upper()} → {country}")
        print("-" * 40)
        
        try:
            result = await analyzer.analyze_with_ai_simulation(aircraft, country)
            
            print(f"✈️  Aeronave: {result['aircraft']}")
            print(f"🌍 Destino: {result['targetCountry']}")
            print(f"📊 Status: {result['overallStatus'].upper()}")
            print(f"⚠️  Risco: {result['riskLevel'].upper()}")
            
            if result.get('aiEnhanced'):
                ai_analysis = result.get('aiAnalysis', {})
                print(f"🤖 IA Insight: {ai_analysis.get('insight', 'N/A')[:80]}...")
                print(f"🔢 Entidades: {len(ai_analysis.get('entities', []))}")
                print(f"🎯 Fatores de Risco: {len(ai_analysis.get('riskFactors', []))}")
            
            if result.get('estimatedCompletionDays'):
                print(f"⏱️  Estimativa: {result['estimatedCompletionDays']} dias")
            
        except Exception as e:
            print(f"❌ Erro: {e}")
    
    print("\n" + "=" * 60)
    print("✅ Teste concluído!")

# Exemplo de integração com o serviço existente
class EnhancedComplianceService:
    """Serviço aprimorado que pode ser integrado ao sistema existente"""
    
    def __init__(self):
        self.ai_analyzer = LightweightAviationAnalyzer()
        self.fallback_enabled = True
    
    async def validate_compliance(self, aircraft: str, country: str) -> Dict[str, Any]:
        """Método principal para validação com IA"""
        
        try:
            # Tentar análise com IA
            result = await self.ai_analyzer.analyze_with_ai_simulation(aircraft, country)
            return result
            
        except Exception as e:
            print(f"⚠️ Análise AI falhou: {e}")
            
            if self.fallback_enabled:
                # Fallback para análise tradicional
                return self._fallback_analysis(aircraft, country)
            else:
                raise
    
    def _fallback_analysis(self, aircraft: str, country: str) -> Dict[str, Any]:
        """Análise de fallback sem IA"""
        return {
            'aircraft': aircraft,
            'originCountry': 'Brasil (ANAC)',
            'targetCountry': country,
            'overallStatus': 'pending',
            'riskLevel': 'medium',
            'estimatedCompletionDays': 60,
            'generatedAt': datetime.now().isoformat(),
            'aiEnhanced': False,
            'fallbackUsed': True
        }

if __name__ == "__main__":
    # Executar teste
    asyncio.run(test_ai_compliance_analysis())