import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  FileText, 
  TrendingUp,
  Users,
  Shield,
  Zap
} from 'lucide-react';
import { ComplianceService, type GapAnalysisReport } from '@/services/ComplianceService';

const countries = [
  { code: 'BR', name: 'Brasil', authority: 'ANAC' },
  { code: 'US', name: 'Estados Unidos', authority: 'FAA' },
  { code: 'EU', name: 'União Europeia', authority: 'EASA' },
  { code: 'UK', name: 'Reino Unido', authority: 'UK CAA' },
  { code: 'CA', name: 'Canadá', authority: 'Transport Canada' },
  { code: 'AR', name: 'Argentina', authority: 'ANAC' }
];

const aircraftModels = [
  { code: 'e190', name: 'Embraer E190' },
  { code: 'e195', name: 'Embraer E195' },
  { code: 'phenom300', name: 'Phenom 300' },
  { code: 'legacy500', name: 'Legacy 500' },
  { code: 'kc390', name: 'KC-390' }
];

interface GapAnalysisProps {
  className?: string;
}

export const GapAnalysis: React.FC<GapAnalysisProps> = ({ className }) => {
  const [selectedAircraft, setSelectedAircraft] = useState<string>('');
  const [originCountry, setOriginCountry] = useState<string>('BR');
  const [targetCountry, setTargetCountry] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<GapAnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    if (!selectedAircraft || !originCountry || !targetCountry) {
      setError('Por favor, selecione todos os campos obrigatórios');
      return;
    }

    if (originCountry === targetCountry) {
      setError('País de origem e destino devem ser diferentes');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await ComplianceService.performGapAnalysis(
        selectedAircraft,
        originCountry,
        targetCountry
      );
      setAnalysis(result);
    } catch (err) {
      setError(`Erro na análise: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`gap-analysis-container ${className || ''}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Análise de Lacunas Regulamentares
          </CardTitle>
          <CardDescription>
            Compare os requisitos regulamentares entre o país de origem e destino para identificar lacunas de conformidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Formulário de Seleção */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Aeronave</label>
              <Select value={selectedAircraft} onValueChange={setSelectedAircraft}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a aeronave" />
                </SelectTrigger>
                <SelectContent>
                  {aircraftModels.map((model) => (
                    <SelectItem key={model.code} value={model.code}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">País de Origem</label>
              <Select value={originCountry} onValueChange={setOriginCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="País de origem" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.authority})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">País de Destino</label>
              <Select value={targetCountry} onValueChange={setTargetCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="País de destino" />
                </SelectTrigger>
                <SelectContent>
                  {countries
                    .filter(country => country.code !== originCountry)
                    .map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.authority})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleAnalysis} 
                disabled={loading || !selectedAircraft || !originCountry || !targetCountry}
                className="w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Analisar Lacunas
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Exibição de Erro */}
          {error && (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Resultados da Análise */}
          {analysis && (
            <div className="space-y-6">
              {/* Resumo da Análise */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Resumo da Análise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{analysis.summary.totalGaps}</div>
                      <div className="text-sm text-blue-800">Total de Lacunas</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{analysis.summary.criticalGaps}</div>
                      <div className="text-sm text-red-800">Lacunas Críticas</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{analysis.summary.highImpactGaps}</div>
                      <div className="text-sm text-orange-800">Alto Impacto</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <Badge variant={getRiskColor(analysis.summary.overallRisk)} className="text-lg px-3 py-1">
                        {analysis.summary.overallRisk.toUpperCase()}
                      </Badge>
                      <div className="text-sm text-gray-600 mt-1">Risco Geral</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>Prazo Estimado:</strong> {analysis.summary.estimatedTimeline}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        <strong>Custo Estimado:</strong> {analysis.summary.estimatedCostRange}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs para Detalhes */}
              <Tabs defaultValue="gaps" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="gaps">Lacunas Identificadas</TabsTrigger>
                  <TabsTrigger value="action-plan">Plano de Ação</TabsTrigger>
                  <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
                  <TabsTrigger value="regulatory">Contexto Regulamentar</TabsTrigger>
                </TabsList>

                {/* Tab: Lacunas Identificadas */}
                <TabsContent value="gaps" className="space-y-4">
                  {analysis.gaps.length === 0 ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Nenhuma lacuna significativa identificada. A aeronave parece estar em conformidade com os requisitos básicos.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    analysis.gaps.map((gap, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-semibold text-lg">{gap.requirement}</h4>
                              <Badge className={getImpactColor(gap.impact)} variant="outline">
                                {gap.impact.toUpperCase()}
                              </Badge>
                            </div>
                            <Badge variant="outline">{gap.category}</Badge>
                          </div>
                          
                          <p className="text-gray-700 mb-4">{gap.gap_description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <strong>Status Atual:</strong>
                              <br />
                              <span className="text-gray-600">{gap.current_status}</span>
                            </div>
                            <div>
                              <strong>Esforço Estimado:</strong>
                              <br />
                              <span className="text-gray-600">{gap.estimated_effort}</span>
                            </div>
                            <div>
                              <strong>Custo Estimado:</strong>
                              <br />
                              <span className="text-gray-600">{gap.cost_estimate}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>

                {/* Tab: Plano de Ação */}
                <TabsContent value="action-plan" className="space-y-4">
                  {analysis.actionPlan.map((phase, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {phase.phase}
                          </div>
                          {phase.title}
                        </CardTitle>
                        <CardDescription>
                          <Clock className="inline h-4 w-4 mr-1" />
                          Duração: {phase.duration}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {phase.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Tab: Recomendações */}
                <TabsContent value="recommendations" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Recomendações Estratégicas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {analysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab: Contexto Regulamentar */}
                <TabsContent value="regulatory" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">País de Origem</CardTitle>
                        <CardDescription>{analysis.analysis.originCountry}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Autoridade:</strong> {analysis.regulatoryContext.originFramework.authority}
                          </div>
                          <div>
                            <strong>Framework:</strong> {analysis.regulatoryContext.originFramework.framework}
                          </div>
                          <div>
                            <strong>Padrões:</strong> {analysis.regulatoryContext.originFramework.standards}
                          </div>
                          {analysis.regulatoryContext.originFramework.strengths && (
                            <div>
                              <strong>Pontos Fortes:</strong>
                              <ul className="list-disc list-inside ml-2 mt-1">
                                {analysis.regulatoryContext.originFramework.strengths.map((strength, index) => (
                                  <li key={index}>{strength}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">País de Destino</CardTitle>
                        <CardDescription>{analysis.analysis.targetCountry}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>
                            <strong>Autoridade:</strong> {analysis.regulatoryContext.targetFramework.authority}
                          </div>
                          <div>
                            <strong>Framework:</strong> {analysis.regulatoryContext.targetFramework.framework}
                          </div>
                          <div>
                            <strong>Padrões:</strong> {analysis.regulatoryContext.targetFramework.standards}
                          </div>
                          {analysis.regulatoryContext.targetFramework.strengths && (
                            <div>
                              <strong>Pontos Fortes:</strong>
                              <ul className="list-disc list-inside ml-2 mt-1">
                                {analysis.regulatoryContext.targetFramework.strengths.map((strength, index) => (
                                  <li key={index}>{strength}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Acordos Bilaterais */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Acordos Bilaterais
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 mb-4">
                        {analysis.regulatoryContext.bilateralAgreements.hasBilateralAgreement ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                        )}
                        <span className="font-medium">
                          {analysis.regulatoryContext.bilateralAgreements.agreementType}
                        </span>
                      </div>

                      {analysis.regulatoryContext.bilateralAgreements.benefits.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-green-800 mb-2">Benefícios:</h4>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {analysis.regulatoryContext.bilateralAgreements.benefits.map((benefit, index) => (
                              <li key={index} className="text-green-700">{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysis.regulatoryContext.bilateralAgreements.limitations.length > 0 && (
                        <div>
                          <h4 className="font-medium text-orange-800 mb-2">Limitações:</h4>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {analysis.regulatoryContext.bilateralAgreements.limitations.map((limitation, index) => (
                              <li key={index} className="text-orange-700">{limitation}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GapAnalysis;