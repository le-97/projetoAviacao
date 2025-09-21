"""
Servidor MCP para Análise de Conformidade Aeronáutica
Integra múltiplos modelos do Hugging Face para análise especializada
"""

import asyncio
import json
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from transformers import pipeline, AutoTokenizer, AutoModel
import torch
from sentence_transformers import SentenceTransformer
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class ComplianceAnalysis:
    aircraft: str
    country: str
    overall_status: str
    confidence_score: float
    requirements: List[Dict[str, Any]]
    risk_assessment: Dict[str, Any]
    recommendations: List[str]
    ai_insights: Dict[str, Any]

class AviationMcpServer:
    """
    Servidor MCP especializado em análise de conformidade aeronáutica
    usando múltiplos modelos do Hugging Face
    """
    
    def __init__(self):
        self.models = {}
        self.aircraft_knowledge = {}
        self.regulation_database = {}
        self._initialize_models()
        self._load_knowledge_base()
    
    def _initialize_models(self):
        """Inicializa os modelos do Hugging Face"""
        try:
            logger.info("Inicializando modelos do Hugging Face...")
            
            # 1. Modelo para classificação de conformidade
            self.models['classifier'] = pipeline(
                "text-classification",
                model="microsoft/DialoGPT-medium",
                return_all_scores=True
            )
            
            # 2. Modelo para geração de relatórios
            self.models['generator'] = pipeline(
                "text2text-generation",
                model="google/flan-t5-base",
                max_length=512
            )
            
            # 3. Modelo para análise de similaridade
            self.models['similarity'] = SentenceTransformer(
                'sentence-transformers/all-MiniLM-L6-v2'
            )
            
            # 4. Modelo para extração de entidades
            self.models['ner'] = pipeline(
                "ner",
                model="dbmdz/bert-large-cased-finetuned-conll03-english",
                aggregation_strategy="simple"
            )
            
            # 5. Tokenizer para análise de texto
            self.models['tokenizer'] = AutoTokenizer.from_pretrained(
                "microsoft/deberta-v3-base"
            )
            
            logger.info("Modelos inicializados com sucesso!")
            
        except Exception as e:
            logger.error(f"Erro ao inicializar modelos: {e}")
            # Fallback para modelos mais leves se houver erro
            self._initialize_fallback_models()
    
    def _initialize_fallback_models(self):
        """Modelos de fallback mais leves"""
        logger.info("Inicializando modelos de fallback...")
        
        self.models['classifier'] = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english"
        )
        
        self.models['similarity'] = SentenceTransformer('all-MiniLM-L6-v2')
    
    def _load_knowledge_base(self):
        """Carrega base de conhecimento sobre aviação"""
        
        # Base de conhecimento de aeronaves
        self.aircraft_knowledge = {
            'e190': {
                'full_name': 'Embraer E190',
                'category': 'regional_commercial',
                'mtow': 56000,
                'passenger_capacity': 114,
                'noise_level': 85.7,
                'emission_class': 'CAEP/8',
                'existing_certifications': ['ANAC', 'FAA', 'EASA'],
                'technical_specs': {
                    'engines': '2x CF34-10E',
                    'range': '4537 km',
                    'ceiling': '12500 m'
                }
            },
            'e195': {
                'full_name': 'Embraer E195',
                'category': 'regional_commercial',
                'mtow': 61900,
                'passenger_capacity': 146,
                'noise_level': 87.2,
                'emission_class': 'CAEP/8',
                'existing_certifications': ['ANAC', 'FAA', 'EASA'],
                'technical_specs': {
                    'engines': '2x CF34-10E',
                    'range': '4260 km',
                    'ceiling': '12500 m'
                }
            },
            'phenom300': {
                'full_name': 'Phenom 300',
                'category': 'business_jet',
                'mtow': 8150,
                'passenger_capacity': 11,
                'noise_level': 78.5,
                'emission_class': 'CAEP/6',
                'existing_certifications': ['ANAC', 'FAA', 'EASA'],
                'technical_specs': {
                    'engines': '2x PW535E',
                    'range': '3334 km',
                    'ceiling': '13716 m'
                }
            }
        }
        
        # Base de conhecimento regulatório
        self.regulation_database = {
            'US': {
                'authority': 'FAA',
                'primary_regulations': ['FAR Part 25', 'FAR Part 21', 'FAR Part 36'],
                'key_requirements': [
                    'Type Certificate (TC)',
                    'Production Certificate (PC)', 
                    'Airworthiness Certificate',
                    'Noise Certificate',
                    'Emission Certificate'
                ],
                'bilateral_agreements': ['BASA'],
                'special_considerations': {
                    'noise_restrictions': True,
                    'emission_limits': True,
                    'military_itar': True
                }
            },
            'EU': {
                'authority': 'EASA',
                'primary_regulations': ['CS-25', 'Part-21', 'ICAO Annex 16'],
                'key_requirements': [
                    'EASA Type Certificate',
                    'Certificate of Airworthiness',
                    'Noise Certificate',
                    'Emission Certificate',
                    'Production Organization Approval'
                ],
                'bilateral_agreements': ['BASA'],
                'special_considerations': {
                    'noise_restrictions': True,
                    'emission_limits': True,
                    'environmental_compliance': True
                }
            }
        }
    
    async def analyze_compliance_with_ai(self, aircraft: str, country: str) -> ComplianceAnalysis:
        """
        Análise de conformidade usando IA multi-modelo
        """
        logger.info(f"Iniciando análise AI para {aircraft} -> {country}")
        
        try:
            # 1. Extrair informações das bases de conhecimento
            aircraft_data = self.aircraft_knowledge.get(aircraft.lower(), {})
            regulation_data = self.regulation_database.get(country.upper(), {})
            
            if not aircraft_data or not regulation_data:
                return self._fallback_analysis(aircraft, country)
            
            # 2. Preparar contexto para análise AI
            analysis_context = self._prepare_ai_context(aircraft_data, regulation_data)
            
            # 3. Executar análise multi-modelo
            ai_results = await self._run_multi_model_analysis(analysis_context)
            
            # 4. Sintetizar resultados
            compliance_analysis = self._synthesize_results(
                aircraft, country, aircraft_data, regulation_data, ai_results
            )
            
            logger.info(f"Análise AI concluída com sucesso")
            return compliance_analysis
            
        except Exception as e:
            logger.error(f"Erro na análise AI: {e}")
            return self._fallback_analysis(aircraft, country)
    
    def _prepare_ai_context(self, aircraft_data: Dict, regulation_data: Dict) -> str:
        """Prepara contexto estruturado para análise AI"""
        
        context = f"""
        AIRCRAFT ANALYSIS REQUEST
        
        Aircraft Specifications:
        - Model: {aircraft_data.get('full_name', 'Unknown')}
        - Category: {aircraft_data.get('category', 'Unknown')}
        - MTOW: {aircraft_data.get('mtow', 0)} kg
        - Passenger Capacity: {aircraft_data.get('passenger_capacity', 0)}
        - Noise Level: {aircraft_data.get('noise_level', 0)} EPNdB
        - Emission Class: {aircraft_data.get('emission_class', 'Unknown')}
        - Existing Certifications: {', '.join(aircraft_data.get('existing_certifications', []))}
        
        Target Regulation Framework:
        - Authority: {regulation_data.get('authority', 'Unknown')}
        - Primary Regulations: {', '.join(regulation_data.get('primary_regulations', []))}
        - Key Requirements: {', '.join(regulation_data.get('key_requirements', []))}
        - Bilateral Agreements: {', '.join(regulation_data.get('bilateral_agreements', []))}
        
        Special Considerations:
        {self._format_special_considerations(regulation_data.get('special_considerations', {}))}
        
        ANALYSIS REQUIRED: Determine compliance status, identify gaps, assess risks, provide recommendations.
        """
        
        return context.strip()
    
    def _format_special_considerations(self, considerations: Dict) -> str:
        """Formata considerações especiais"""
        formatted = []
        for key, value in considerations.items():
            if value:
                formatted.append(f"- {key.replace('_', ' ').title()}: Required")
        return '\n'.join(formatted) if formatted else "- None specified"
    
    async def _run_multi_model_analysis(self, context: str) -> Dict[str, Any]:
        """Executa análise usando múltiplos modelos"""
        
        results = {}
        
        try:
            # 1. Análise de sentimento/classificação para status geral
            if 'classifier' in self.models:
                classification = self.models['classifier'](context[:512])  # Limite de tokens
                results['classification'] = classification
            
            # 2. Extração de entidades relevantes
            if 'ner' in self.models:
                entities = self.models['ner'](context[:512])
                results['entities'] = entities
            
            # 3. Geração de insights usando modelo generativo
            if 'generator' in self.models:
                prompt = f"Analyze aviation compliance: {context[:300]}... Provide compliance assessment:"
                insights = self.models['generator'](prompt, max_length=200)
                results['insights'] = insights
            
            # 4. Análise de similaridade com casos conhecidos
            if 'similarity' in self.models:
                # Comparar com casos de referência
                reference_cases = [
                    "Commercial aircraft with FAA certification operating in US airspace",
                    "Regional jet with EASA certification for European operations",
                    "Business jet with multiple international certifications"
                ]
                
                similarities = []
                context_embedding = self.models['similarity'].encode([context])
                
                for ref_case in reference_cases:
                    ref_embedding = self.models['similarity'].encode([ref_case])
                    similarity = torch.cosine_similarity(
                        torch.tensor(context_embedding),
                        torch.tensor(ref_embedding)
                    ).item()
                    similarities.append({
                        'case': ref_case,
                        'similarity': similarity
                    })
                
                results['similarity_analysis'] = similarities
            
        except Exception as e:
            logger.error(f"Erro na análise multi-modelo: {e}")
            results['error'] = str(e)
        
        return results
    
    def _synthesize_results(self, aircraft: str, country: str, 
                          aircraft_data: Dict, regulation_data: Dict, 
                          ai_results: Dict) -> ComplianceAnalysis:
        """Sintetiza resultados da análise AI"""
        
        # Determinar status baseado na análise AI e dados conhecidos
        existing_certs = aircraft_data.get('existing_certifications', [])
        target_authority = regulation_data.get('authority', '')
        
        if target_authority in existing_certs:
            overall_status = 'compliant'
            confidence = 0.85
        elif any(cert in ['FAA', 'EASA'] for cert in existing_certs):
            overall_status = 'pending'
            confidence = 0.70
        else:
            overall_status = 'non-compliant'
            confidence = 0.60
        
        # Ajustar confiança baseado na análise AI
        if 'classification' in ai_results:
            # Usar resultados do classificador para ajustar confiança
            classification = ai_results['classification']
            if isinstance(classification, list) and classification:
                ai_confidence = classification[0].get('score', 0.5)
                confidence = (confidence + ai_confidence) / 2
        
        # Gerar requisitos específicos
        requirements = []
        for req in regulation_data.get('key_requirements', []):
            status = 'compliant' if target_authority in existing_certs else 'pending'
            requirements.append({
                'name': req,
                'status': status,
                'authority': target_authority,
                'criticality': 'high' if 'Certificate' in req else 'medium'
            })
        
        # Análise de risco
        risk_level = 'low' if overall_status == 'compliant' else 'medium'
        if overall_status == 'non-compliant':
            risk_level = 'high'
        
        risk_assessment = {
            'level': risk_level,
            'factors': self._identify_risk_factors(aircraft_data, regulation_data),
            'mitigation': self._suggest_risk_mitigation(overall_status, target_authority)
        }
        
        # Recomendações baseadas em AI
        recommendations = self._generate_ai_recommendations(ai_results, overall_status)
        
        # Insights da análise AI
        ai_insights = {
            'model_confidence': confidence,
            'key_entities': ai_results.get('entities', []),
            'similarity_matches': ai_results.get('similarity_analysis', []),
            'generated_insights': ai_results.get('insights', [])
        }
        
        return ComplianceAnalysis(
            aircraft=aircraft_data.get('full_name', aircraft),
            country=f"{regulation_data.get('authority', country)} ({country})",
            overall_status=overall_status,
            confidence_score=confidence,
            requirements=requirements,
            risk_assessment=risk_assessment,
            recommendations=recommendations,
            ai_insights=ai_insights
        )
    
    def _identify_risk_factors(self, aircraft_data: Dict, regulation_data: Dict) -> List[str]:
        """Identifica fatores de risco"""
        factors = []
        
        # Verificar restrições de ruído
        if regulation_data.get('special_considerations', {}).get('noise_restrictions'):
            noise_level = aircraft_data.get('noise_level', 0)
            if noise_level > 90:
                factors.append('High noise level may require additional noise certification')
        
        # Verificar limitações de emissão
        if regulation_data.get('special_considerations', {}).get('emission_limits'):
            emission_class = aircraft_data.get('emission_class', '')
            if 'Military' in emission_class:
                factors.append('Military emission class requires civilian certification review')
        
        # Verificar ITAR para aeronaves militares
        if regulation_data.get('special_considerations', {}).get('military_itar'):
            if aircraft_data.get('category') == 'military':
                factors.append('ITAR compliance required for military aircraft')
        
        return factors
    
    def _suggest_risk_mitigation(self, status: str, authority: str) -> List[str]:
        """Sugere medidas de mitigação de risco"""
        mitigations = []
        
        if status == 'non-compliant':
            mitigations.extend([
                f'Initiate {authority} Type Certificate validation process',
                'Engage regulatory affairs specialist',
                'Prepare comprehensive technical documentation'
            ])
        elif status == 'pending':
            mitigations.extend([
                'Review current certification status',
                'Identify any regulatory changes since last certification',
                'Prepare for potential additional requirements'
            ])
        
        return mitigations
    
    def _generate_ai_recommendations(self, ai_results: Dict, status: str) -> List[str]:
        """Gera recomendações baseadas na análise AI"""
        recommendations = []
        
        # Recomendações baseadas no status
        if status == 'compliant':
            recommendations.append('Current certification status appears adequate')
            recommendations.append('Monitor for regulatory updates and changes')
        elif status == 'pending':
            recommendations.append('Complete pending certification requirements')
            recommendations.append('Coordinate with target authority for timeline')
        else:
            recommendations.append('Initiate full certification process')
            recommendations.append('Consider phased approach for complex requirements')
        
        # Adicionar insights da análise AI se disponível
        if 'insights' in ai_results and ai_results['insights']:
            try:
                ai_insight = ai_results['insights'][0].get('generated_text', '')
                if ai_insight and len(ai_insight) > 10:
                    recommendations.append(f'AI Insight: {ai_insight[:200]}...')
            except:
                pass
        
        return recommendations
    
    def _fallback_analysis(self, aircraft: str, country: str) -> ComplianceAnalysis:
        """Análise de fallback quando AI não está disponível"""
        return ComplianceAnalysis(
            aircraft=aircraft,
            country=country,
            overall_status='pending',
            confidence_score=0.5,
            requirements=[{
                'name': 'Basic Requirements Review',
                'status': 'pending',
                'authority': 'TBD',
                'criticality': 'medium'
            }],
            risk_assessment={
                'level': 'medium',
                'factors': ['AI analysis unavailable'],
                'mitigation': ['Manual review required']
            },
            recommendations=['Contact aviation regulatory expert for detailed analysis'],
            ai_insights={'note': 'AI models not available for this analysis'}
        )

# Classe utilitária para integração com o sistema existente
class McpComplianceIntegration:
    """Integração entre o servidor MCP e o sistema de conformidade existente"""
    
    def __init__(self):
        self.mcp_server = AviationMcpServer()
    
    async def validate_compliance_enhanced(self, aircraft: str, country: str) -> Dict[str, Any]:
        """Método principal para validação aprimorada com IA"""
        
        # Executar análise AI
        ai_analysis = await self.mcp_server.analyze_compliance_with_ai(aircraft, country)
        
        # Converter para formato compatível com o sistema existente
        return self._convert_to_legacy_format(ai_analysis)
    
    def _convert_to_legacy_format(self, analysis: ComplianceAnalysis) -> Dict[str, Any]:
        """Converte análise AI para formato do sistema legado"""
        
        return {
            'aircraft': analysis.aircraft,
            'originCountry': 'Brasil (ANAC)',
            'targetCountry': analysis.country,
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
                    'authority': analysis.country,
                    'status': analysis.overall_status,
                    'completionPercentage': int(analysis.confidence_score * 100),
                    'requirements': [req['name'] for req in analysis.requirements],
                    'pendingItems': analysis.recommendations if analysis.overall_status != 'compliant' else None
                }
            ],
            'overallStatus': analysis.overall_status,
            'riskLevel': analysis.risk_assessment['level'],
            'estimatedCompletionDays': self._estimate_completion_days(analysis),
            'generatedAt': self._get_iso_timestamp(),
            'aiEnhanced': True,
            'aiInsights': analysis.ai_insights
        }
    
    def _estimate_completion_days(self, analysis: ComplianceAnalysis) -> Optional[int]:
        """Estima dias para conclusão baseado na análise"""
        if analysis.overall_status == 'compliant':
            return None
        elif analysis.overall_status == 'pending':
            return 45 + len(analysis.requirements) * 10
        else:  # non-compliant
            return 90 + len(analysis.requirements) * 15
    
    def _get_iso_timestamp(self) -> str:
        """Retorna timestamp ISO atual"""
        from datetime import datetime
        return datetime.now().isoformat()

# Exemplo de uso
async def main():
    """Exemplo de uso do sistema"""
    integration = McpComplianceIntegration()
    
    # Testar análise
    result = await integration.validate_compliance_enhanced('e190', 'US')
    print(json.dumps(result, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    asyncio.run(main())