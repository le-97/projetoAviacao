interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  mandatory: boolean;
  documentType: string;
  validityPeriod?: number; // em dias
}

interface CountryRegulation {
  countryCode: string;
  countryName: string;
  authority: string;
  requirements: ComplianceRequirement[];
  specificRules: {
    noiseRestrictions?: boolean;
    emissionLimits?: boolean;
    specialCertifications?: string[];
    bilateralAgreements?: string[];
  };
}

interface AircraftSpecification {
  model: string;
  category: string;
  maxSeats: number;
  mtow: number; // Maximum Take-off Weight
  noiseLevel: number; // EPNdB
  emissionClass: string;
  certifications: string[];
  manufacturingCountry: string;
}

// Base de dados de regulamentações por país
const countryRegulations: Record<string, CountryRegulation> = {
  'US': {
    countryCode: 'US',
    countryName: 'Estados Unidos',
    authority: 'FAA',
    requirements: [
      {
        id: 'faa_type_cert',
        name: 'Type Certificate',
        description: 'Certificado de tipo FAA ou validação de certificado estrangeiro',
        mandatory: true,
        documentType: 'certificate'
      },
      {
        id: 'faa_airworthiness',
        name: 'Airworthiness Certificate',
        description: 'Certificado de aeronavegabilidade padrão',
        mandatory: true,
        documentType: 'certificate'
      },
      {
        id: 'faa_registration',
        name: 'Aircraft Registration',
        description: 'Registro da aeronave no sistema FAA',
        mandatory: true,
        documentType: 'registration'
      },
      {
        id: 'faa_noise_cert',
        name: 'Noise Certificate',
        description: 'Certificado de ruído conforme FAR Part 36',
        mandatory: true,
        documentType: 'certificate'
      }
    ],
    specificRules: {
      noiseRestrictions: true,
      emissionLimits: true,
      specialCertifications: ['TSO', 'PMA'],
      bilateralAgreements: ['BASA']
    }
  },
  'EU': {
    countryCode: 'EU',
    countryName: 'União Europeia',
    authority: 'EASA',
    requirements: [
      {
        id: 'easa_type_cert',
        name: 'EASA Type Certificate',
        description: 'Certificado de tipo EASA ou validação',
        mandatory: true,
        documentType: 'certificate'
      },
      {
        id: 'easa_coa',
        name: 'Certificate of Airworthiness',
        description: 'Certificado de aeronavegabilidade EASA',
        mandatory: true,
        documentType: 'certificate'
      },
      {
        id: 'easa_noise',
        name: 'Noise Certificate',
        description: 'Certificado de ruído ICAO Annex 16',
        mandatory: true,
        documentType: 'certificate'
      },
      {
        id: 'easa_emission',
        name: 'Emission Certificate',
        description: 'Certificado de emissões ICAO Annex 16',
        mandatory: true,
        documentType: 'certificate'
      }
    ],
    specificRules: {
      noiseRestrictions: true,
      emissionLimits: true,
      specialCertifications: ['ETSO'],
      bilateralAgreements: ['BASA']
    }
  },
  'UK': {
    countryCode: 'UK',
    countryName: 'Reino Unido',
    authority: 'CAA',
    requirements: [
      {
        id: 'uk_type_cert',
        name: 'UK Type Certificate',
        description: 'Certificado de tipo UK CAA pós-Brexit',
        mandatory: true,
        documentType: 'certificate'
      },
      {
        id: 'uk_coa',
        name: 'Certificate of Airworthiness',
        description: 'Certificado de aeronavegabilidade UK',
        mandatory: true,
        documentType: 'certificate'
      },
      {
        id: 'uk_brexit_doc',
        name: 'Brexit Transition Documentation',
        description: 'Documentação específica pós-Brexit',
        mandatory: true,
        documentType: 'documentation'
      }
    ],
    specificRules: {
      noiseRestrictions: true,
      emissionLimits: true,
      specialCertifications: ['UK-TSO'],
      bilateralAgreements: []
    }
  },
  'CA': {
    countryCode: 'CA',
    countryName: 'Canadá',
    authority: 'Transport Canada',
    requirements: [
      {
        id: 'tc_type_cert',
        name: 'Type Certificate',
        description: 'Certificado de tipo Transport Canada',
        mandatory: true,
        documentType: 'certificate'
      },
      {
        id: 'tc_coa',
        name: 'Certificate of Airworthiness',
        description: 'Certificado de aeronavegabilidade canadense',
        mandatory: true,
        documentType: 'certificate'
      }
    ],
    specificRules: {
      noiseRestrictions: true,
      emissionLimits: false,
      bilateralAgreements: ['BASA']
    }
  },
  'AR': {
    countryCode: 'AR',
    countryName: 'Argentina',
    authority: 'ANAC',
    requirements: [
      {
        id: 'anac_ar_type',
        name: 'Certificado de Tipo',
        description: 'Certificado de tipo ANAC Argentina',
        mandatory: true,
        documentType: 'certificate'
      },
      {
        id: 'anac_ar_airworthiness',
        name: 'Certificado de Aeronavegabilidade',
        description: 'Certificado de aeronavegabilidade padrão',
        mandatory: true,
        documentType: 'certificate'
      }
    ],
    specificRules: {
      noiseRestrictions: false,
      emissionLimits: false,
      bilateralAgreements: ['Mercosul']
    }
  }
};

// Especificações dos modelos de aeronaves Embraer
const aircraftSpecifications: Record<string, AircraftSpecification> = {
  'e190': {
    model: 'Embraer E190',
    category: 'commercial',
    maxSeats: 114,
    mtow: 56000,
    noiseLevel: 85.7,
    emissionClass: 'CAEP/8',
    certifications: ['ANAC', 'FAA', 'EASA'],
    manufacturingCountry: 'BR'
  },
  'e195': {
    model: 'Embraer E195',
    category: 'commercial',
    maxSeats: 146,
    mtow: 61900,
    noiseLevel: 87.2,
    emissionClass: 'CAEP/8',
    certifications: ['ANAC', 'FAA', 'EASA'],
    manufacturingCountry: 'BR'
  },
  'phenom300': {
    model: 'Phenom 300',
    category: 'business',
    maxSeats: 11,
    mtow: 8150,
    noiseLevel: 78.5,
    emissionClass: 'CAEP/6',
    certifications: ['ANAC', 'FAA', 'EASA'],
    manufacturingCountry: 'BR'
  },
  'legacy500': {
    model: 'Legacy 500',
    category: 'business',
    maxSeats: 12,
    mtow: 14200,
    noiseLevel: 82.1,
    emissionClass: 'CAEP/8',
    certifications: ['ANAC', 'FAA', 'EASA'],
    manufacturingCountry: 'BR'
  },
  'kc390': {
    model: 'KC-390',
    category: 'military',
    maxSeats: 80,
    mtow: 87000,
    noiseLevel: 92.5,
    emissionClass: 'Military',
    certifications: ['ANAC', 'FAA'],
    manufacturingCountry: 'BR'
  }
};

export class ComplianceService {
  private static apiBaseUrl = 'https://aviation-backend.greensand-8aeaae63.brazilsouth.azurecontainerapps.io';

  /**
   * Análise de lacunas entre países de origem e destino
   */
  static async performGapAnalysis(aircraftModel: string, originCountry: string, targetCountry: string): Promise<GapAnalysisReport> {
    try {
      // Tenta usar endpoint de Gap Analysis
      const response = await fetch(`${this.apiBaseUrl}/compliance/gap-analysis/${aircraftModel}/${originCountry}/${targetCountry}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Gap Analysis successful:', result);
        return result;
      } else {
        console.warn('⚠️ Gap Analysis endpoint failed, falling back to basic analysis');
      }
    } catch (error) {
      console.warn('⚠️ Gap analysis failed, using fallback:', error);
    }

    // Fallback para análise básica local
    return this.performLocalGapAnalysis(aircraftModel, originCountry, targetCountry);
  }

  /**
   * Gap Analysis local como fallback
   */
  private static performLocalGapAnalysis(aircraftModel: string, originCountry: string, targetCountry: string): GapAnalysisReport {
    const aircraft = aircraftSpecifications[aircraftModel.toLowerCase()];
    const originRegulation = countryRegulations[originCountry.toUpperCase()];
    const targetRegulation = countryRegulations[targetCountry.toUpperCase()];

    if (!aircraft || !originRegulation || !targetRegulation) {
      return {
        analysis: {
          model: aircraftModel,
          originCountry: originCountry,
          targetCountry: targetCountry,
          analysisDate: new Date().toISOString()
        },
        summary: {
          totalGaps: 0,
          criticalGaps: 0,
          highImpactGaps: 0,
          overallRisk: 'unknown',
          estimatedTimeline: 'Data unavailable',
          estimatedCostRange: 'Unknown'
        },
        gaps: [],
        recommendations: ['Verify aircraft model and country codes', 'Consult regulatory experts'],
        actionPlan: [],
        regulatoryContext: {
          originFramework: {},
          targetFramework: {},
          bilateralAgreements: {
            hasBilateralAgreement: false,
            agreementType: 'Unknown',
            benefits: [],
            limitations: []
          }
        },
        generatedAt: new Date().toISOString(),
        error: 'Missing regulatory data for basic gap analysis'
      };
    }

    // Análise básica de lacunas
    const gaps: GapAnalysisGap[] = [];
    
    // Compara requisitos entre países
    targetRegulation.requirements.forEach(targetReq => {
      const hasEquivalent = originRegulation.requirements.some(originReq => 
        originReq.documentType === targetReq.documentType
      );

      if (!hasEquivalent) {
        gaps.push({
          category: 'Certification',
          requirement: targetReq.name,
          current_status: 'Missing',
          gap_description: `${targetReq.description} not available from origin country`,
          impact: targetReq.mandatory ? 'high' : 'medium',
          estimated_effort: targetReq.mandatory ? '6-12 months' : '3-6 months',
          cost_estimate: targetReq.mandatory ? '$100,000 - $500,000' : '$25,000 - $100,000'
        });
      }
    });

    // Verifica acordos bilaterais
    const hasBASA = (originCountry.toUpperCase() === 'BR' && targetCountry.toUpperCase() === 'US') ||
                    (originCountry.toUpperCase() === 'US' && targetCountry.toUpperCase() === 'BR') ||
                    (originCountry.toUpperCase() === 'BR' && targetCountry.toUpperCase() === 'CA') ||
                    (originCountry.toUpperCase() === 'CA' && targetCountry.toUpperCase() === 'BR');

    const summary: GapAnalysisSummary = {
      totalGaps: gaps.length,
      criticalGaps: gaps.filter(g => g.impact === 'critical').length,
      highImpactGaps: gaps.filter(g => g.impact === 'high').length,
      overallRisk: gaps.length > 3 ? 'high' : gaps.length > 1 ? 'medium' : 'low',
      estimatedTimeline: gaps.length > 3 ? '12-18 months' : gaps.length > 1 ? '6-12 months' : '3-6 months',
      estimatedCostRange: gaps.length > 3 ? '$500,000 - $2,000,000' : '$100,000 - $1,000,000'
    };

    return {
      analysis: {
        model: aircraft.model,
        originCountry: `${originRegulation.countryName} (${originRegulation.authority})`,
        targetCountry: `${targetRegulation.countryName} (${targetRegulation.authority})`,
        analysisDate: new Date().toISOString()
      },
      summary,
      gaps,
      recommendations: [
        hasBASA ? 'Leverage bilateral aviation safety agreement' : 'Consider establishing bilateral agreements',
        'Engage regulatory consultants early in the process',
        'Prepare comprehensive documentation package',
        'Allow additional time for regulatory review'
      ],
      actionPlan: [
        {
          phase: 1,
          title: 'Initial Assessment and Planning',
          duration: '1-2 months',
          items: [
            'Review regulatory requirements',
            'Engage regulatory consultants',
            'Prepare documentation strategy'
          ]
        },
        {
          phase: 2,
          title: 'Documentation and Application',
          duration: `${Math.max(3, gaps.length * 2)}-${Math.max(6, gaps.length * 3)} months`,
          items: gaps.map(gap => `Complete ${gap.requirement}`)
        },
        {
          phase: 3,
          title: 'Final Review and Approval',
          duration: '2-4 months',
          items: [
            'Submit application to regulatory authority',
            'Respond to regulatory queries',
            'Obtain final approval'
          ]
        }
      ],
      regulatoryContext: {
        originFramework: {
          authority: originRegulation.authority,
          framework: 'Country-specific aviation regulations',
          standards: 'ICAO compliant',
          strengths: ['Established certification process']
        },
        targetFramework: {
          authority: targetRegulation.authority,
          framework: 'Country-specific aviation regulations',
          standards: 'ICAO compliant with local requirements',
          strengths: ['Comprehensive safety oversight']
        },
        bilateralAgreements: {
          hasBilateralAgreement: hasBASA,
          agreementType: hasBASA ? 'BASA (Bilateral Aviation Safety Agreement)' : 'None',
          benefits: hasBASA ? ['Expedited certification', 'Reduced costs', 'Mutual recognition'] : [],
          limitations: hasBASA ? [] : ['Full certification required', 'Extended timeline']
        }
      },
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Validação de conformidade com análise AI aprimorada
   */
  static async validateComplianceWithAI(aircraftModel: string, targetCountryCode: string): Promise<AIComplianceReport> {
    try {
      // Tenta usar endpoint AI primeiro
      const response = await fetch(`${this.apiBaseUrl}/compliance/ai-analysis/${aircraftModel}/${targetCountryCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ AI Analysis successful:', result);
        return result;
      } else {
        console.warn('⚠️ AI endpoint failed, falling back to regular validation');
      }
    } catch (error) {
      console.warn('⚠️ AI analysis failed, using fallback:', error);
    }

    // Fallback para validação regular
    const regularResult = await this.validateCompliance(aircraftModel, targetCountryCode);
    return this.convertToAIFormat(regularResult);
  }

  /**
   * Validação de conformidade tradicional (mantido para compatibilidade)
   */
  static async validateCompliance(aircraftModel: string, targetCountryCode: string): Promise<ComplianceReport> {
    try {
      // Primeiro, tenta obter dados da API backend
      const response = await fetch(`${this.apiBaseUrl}/api/compliance/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aircraft: aircraftModel,
          targetCountry: targetCountryCode
        })
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('API backend não disponível, usando validação local:', error);
    }

    // Fallback para validação local
    return this.performLocalValidation(aircraftModel, targetCountryCode);
  }

  /**
   * Converte resultado tradicional para formato AI
   */
  private static convertToAIFormat(regularResult: ComplianceReport): AIComplianceReport {
    return {
      aircraft: regularResult.aircraft,
      originCountry: regularResult.originCountry,
      targetCountry: regularResult.targetCountry,
      regulations: regularResult.regulations,
      overallStatus: regularResult.overallStatus,
      riskLevel: regularResult.riskLevel,
      estimatedTimeline: regularResult.estimatedCompletionDays ? `${regularResult.estimatedCompletionDays} days` : '30-90 days',
      successProbability: this.calculateSuccessProbability(regularResult),
      generatedAt: regularResult.generatedAt,
      aiEnhanced: false,
      aiAnalysis: {
        classification: {
          prediction: regularResult.overallStatus.toUpperCase(),
          confidence: 0.75,
          method: 'rule_based_fallback'
        },
        similarities: [],
        insights: {
          generated_text: this.generateBasicInsights(regularResult),
          risk_factors: this.extractRiskFactors(regularResult),
          recommendations: this.generateBasicRecommendations(regularResult)
        },
        model_info: {
          compliance_classifier: 'rule_based_fallback',
          similarity_model: 'basic_pattern_matching',
          insight_generator: 'template_based'
        },
        fallback_used: true
      }
    };
  }

  private static calculateSuccessProbability(result: ComplianceReport): number {
    const avgCompletion = result.regulations.reduce((acc, reg) => acc + reg.completionPercentage, 0) / result.regulations.length;
    return Math.min(avgCompletion / 100, 0.95);
  }

  private static generateBasicInsights(result: ComplianceReport): string {
    if (result.overallStatus === 'compliant') {
      return 'Aircraft meets current regulatory requirements for target jurisdiction';
    } else if (result.overallStatus === 'pending') {
      return 'Validation process required through bilateral aviation agreements';
    } else {
      return 'Significant compliance gaps identified requiring regulatory attention';
    }
  }

  private static extractRiskFactors(result: ComplianceReport): string[] {
    const factors: string[] = [];
    
    result.regulations.forEach(reg => {
      if (reg.status === 'non-compliant') {
        factors.push(`${reg.authority} certification requirements not met`);
      }
      if (reg.pendingItems && reg.pendingItems.length > 0) {
        factors.push(`Pending documentation: ${reg.pendingItems.length} items`);
      }
    });

    if (result.riskLevel === 'high') {
      factors.push('Complex regulatory environment requiring specialized expertise');
    }

    return factors;
  }

  private static generateBasicRecommendations(result: ComplianceReport): string[] {
    const recommendations: string[] = [];
    
    if (result.overallStatus === 'pending') {
      recommendations.push('Initiate bilateral agreement validation process');
      recommendations.push('Prepare comprehensive documentation package');
    } else if (result.overallStatus === 'non-compliant') {
      recommendations.push('Engage regulatory consultants for gap analysis');
      recommendations.push('Develop compliance roadmap with timeline');
    }
    
    recommendations.push('Monitor regulatory changes in target jurisdiction');
    
    return recommendations;
  }

  private static performLocalValidation(aircraftModel: string, targetCountryCode: string): ComplianceReport {
    const aircraft = aircraftSpecifications[aircraftModel.toLowerCase()];
    const targetRegulation = countryRegulations[targetCountryCode.toUpperCase()];
    const brasilRegulation = countryRegulations['BR'] || {
      countryCode: 'BR',
      countryName: 'Brasil',
      authority: 'ANAC',
      requirements: [
        {
          id: 'anac_br_type',
          name: 'Certificado de Tipo',
          description: 'Certificado de tipo ANAC Brasil',
          mandatory: true,
          documentType: 'certificate'
        }
      ],
      specificRules: {}
    };

    if (!aircraft || !targetRegulation) {
      throw new Error('Dados de aeronave ou regulamentação não encontrados');
    }

    // Analisa conformidade baseada nas especificações reais
    const complianceResults = this.analyzeCompliance(aircraft, targetRegulation);
    const brasilCompliance = this.analyzeBrasilCompliance(aircraft, brasilRegulation);

    return {
      aircraft: aircraft.model,
      originCountry: 'Brasil (ANAC)',
      targetCountry: `${targetRegulation.countryName} (${targetRegulation.authority})`,
      regulations: [brasilCompliance, complianceResults],
      overallStatus: complianceResults.status,
      riskLevel: this.calculateRiskLevel(complianceResults),
      estimatedCompletionDays: this.estimateCompletionTime(complianceResults),
      generatedAt: new Date().toISOString()
    };
  }

  private static analyzeCompliance(aircraft: AircraftSpecification, regulation: CountryRegulation): RegulationStatus {
    const requirements = regulation.requirements.map(req => req.name);
    const pendingItems: string[] = [];
    let completionPercentage = 0;
    let status: 'compliant' | 'non-compliant' | 'pending' = 'compliant';

    // Verifica se a aeronave já possui certificações para o país/autoridade
    const hasBaseCertification = aircraft.certifications.some(cert => 
      cert === regulation.authority || 
      (regulation.authority === 'EASA' && cert === 'EASA') ||
      (regulation.authority === 'FAA' && cert === 'FAA')
    );

    if (hasBaseCertification) {
      completionPercentage = 95;
      // Verifica requisitos específicos
      if (regulation.specificRules.noiseRestrictions && aircraft.noiseLevel > 90) {
        pendingItems.push('Noise Level Compliance Review');
        completionPercentage -= 10;
      }
      if (regulation.specificRules.emissionLimits && aircraft.emissionClass === 'Military') {
        pendingItems.push('Emission Standards Validation');
        completionPercentage -= 15;
      }
    } else {
      // Precisa de validação completa
      completionPercentage = 30;
      status = 'pending';
      pendingItems.push(
        `${regulation.authority} Type Certificate Validation`,
        `${regulation.authority} Airworthiness Certificate`,
        'Local Registration Documentation'
      );

      // Casos especiais
      if (regulation.countryCode === 'UK') {
        pendingItems.push('Post-Brexit Aviation Agreement');
        completionPercentage = 25;
        status = 'non-compliant';
      }
      if (regulation.countryCode === 'US' && aircraft.category === 'military') {
        pendingItems.push('ITAR Compliance', 'Military Export License');
        completionPercentage = 20;
      }
    }

    return {
      authority: `${regulation.countryName} (${regulation.authority})`,
      status: pendingItems.length > 0 ? (status === 'compliant' ? 'pending' : status) : 'compliant',
      completionPercentage: Math.max(completionPercentage, 0),
      requirements,
      pendingItems: pendingItems.length > 0 ? pendingItems : undefined
    };
  }

  private static analyzeBrasilCompliance(_aircraft: AircraftSpecification, _regulation: CountryRegulation): RegulationStatus {
    // Para aeronaves brasileiras, assumimos conformidade total com ANAC
    return {
      authority: 'ANAC (Brasil)',
      status: 'compliant',
      completionPercentage: 100,
      requirements: [
        'Certificado de Aeronavegabilidade (CA)',
        'Registro Nacional de Aeronaves (RNA)',
        'Certificado de Matrícula (CM)',
        'Certificado de Homologação de Tipo (CHT)',
        'Manual de Operações aprovado'
      ]
    };
  }

  private static calculateRiskLevel(compliance: RegulationStatus): 'low' | 'medium' | 'high' {
    if (compliance.completionPercentage >= 80) return 'low';
    if (compliance.completionPercentage >= 50) return 'medium';
    return 'high';
  }

  private static estimateCompletionTime(compliance: RegulationStatus): number | undefined {
    if (compliance.status === 'compliant') return undefined;
    
    const pendingCount = compliance.pendingItems?.length || 0;
    if (compliance.status === 'non-compliant') return pendingCount * 30 + 60;
    return pendingCount * 15 + 30;
  }
}

// Interfaces para o sistema de validação
export interface RegulationStatus {
  authority: string;
  status: 'compliant' | 'non-compliant' | 'pending';
  completionPercentage: number;
  requirements: string[];
  pendingItems?: string[];
}

export interface ComplianceReport {
  aircraft: string;
  originCountry: string;
  targetCountry: string;
  regulations: RegulationStatus[];
  overallStatus: 'compliant' | 'non-compliant' | 'pending';
  riskLevel: 'low' | 'medium' | 'high';
  estimatedCompletionDays?: number;
  generatedAt: string;
}

// Interfaces para análise AI aprimorada
export interface AIClassification {
  prediction: string;
  confidence: number;
  method: string;
}

export interface AISimilarity {
  pattern: string;
  similarity: number;
  typical_process: string;
  timeline: string;
  success_rate: number;
}

export interface AIInsights {
  generated_text: string;
  risk_factors: string[];
  recommendations: string[];
}

export interface AIModelInfo {
  compliance_classifier: string;
  similarity_model: string;
  insight_generator: string;
}

export interface AIAnalysis {
  classification: AIClassification;
  similarities: AISimilarity[];
  insights: AIInsights;
  model_info: AIModelInfo;
  fallback_used: boolean;
}

export interface AIComplianceReport {
  aircraft: string;
  originCountry: string;
  targetCountry: string;
  regulations?: RegulationStatus[];
  overallStatus: 'compliant' | 'non-compliant' | 'pending';
  riskLevel: 'low' | 'medium' | 'high';
  estimatedTimeline: string;
  successProbability: number;
  generatedAt: string;
  aiEnhanced: boolean;
  aiAnalysis: AIAnalysis;
  error?: string;
  fallback?: boolean;
}

// Interfaces para Gap Analysis
export interface GapAnalysisGap {
  category: string;
  requirement: string;
  current_status: string;
  gap_description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  estimated_effort: string;
  cost_estimate: string;
}

export interface GapAnalysisSummary {
  totalGaps: number;
  criticalGaps: number;
  highImpactGaps: number;
  overallRisk: string;
  estimatedTimeline: string;
  estimatedCostRange: string;
}

export interface GapAnalysisActionItem {
  phase: number;
  title: string;
  duration: string;
  items: string[];
}

export interface RegulatoryFramework {
  authority?: string;
  framework?: string;
  standards?: string;
  strengths?: string[];
}

export interface BilateralAgreements {
  hasBilateralAgreement: boolean;
  agreementType: string;
  benefits: string[];
  limitations: string[];
}

export interface RegulatoryContext {
  originFramework: RegulatoryFramework;
  targetFramework: RegulatoryFramework;
  bilateralAgreements: BilateralAgreements;
}

export interface GapAnalysisReport {
  analysis: {
    model: string;
    originCountry: string;
    targetCountry: string;
    analysisDate: string;
  };
  summary: GapAnalysisSummary;
  gaps: GapAnalysisGap[];
  recommendations: string[];
  actionPlan: GapAnalysisActionItem[];
  regulatoryContext: RegulatoryContext;
  generatedAt: string;
  error?: string;
}