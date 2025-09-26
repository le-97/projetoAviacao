import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertTriangle, Plane, Globe, FileText, Shield, Clock, Brain, Sparkles, TrendingUp } from 'lucide-react';
import { ComplianceService, type ComplianceReport, type AIComplianceReport } from '@/services/ComplianceService';
import { AIInsightsDisplay } from '@/components/AIInsightsDisplay';
import GapAnalysis from '@/components/GapAnalysis';

export default function AircraftComplianceValidator() {
  const [selectedAircraft, setSelectedAircraft] = useState<string>('');
  const [targetCountry, setTargetCountry] = useState<string>('');
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);
  const [aiComplianceReport, setAiComplianceReport] = useState<AIComplianceReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useAI, setUseAI] = useState(true);

  const aircraftModels = [
    { value: 'e190', label: 'Embraer E190', description: 'Regional jet, 96-114 passageiros' },
    { value: 'e195', label: 'Embraer E195', description: 'Regional jet, 124-146 passageiros' },
    { value: 'phenom300', label: 'Phenom 300', description: 'Business jet, até 11 passageiros' },
    { value: 'legacy500', label: 'Legacy 500', description: 'Business jet, até 12 passageiros' },
    { value: 'kc390', label: 'KC-390 Millennium', description: 'Transporte militar/civil, até 80 passageiros' }
  ];

  const targetCountries = [
    // Américas - América do Norte
    { value: 'USA', label: 'Estados Unidos', authority: 'FAA', flag: '🇺🇸', region: 'América do Norte' },
    { value: 'CA', label: 'Canadá', authority: 'Transport Canada', flag: '🇨🇦', region: 'América do Norte' },
    { value: 'MX', label: 'México', authority: 'AFAC', flag: '🇲🇽', region: 'América do Norte' },
    
    // Américas - América do Sul
    { value: 'BR', label: 'Brasil', authority: 'ANAC', flag: '🇧🇷', region: 'América do Sul' },
    { value: 'CO', label: 'Colômbia', authority: 'UAEAC', flag: '🇨🇴', region: 'América do Sul' },
    { value: 'AR', label: 'Argentina', authority: 'ANAC', flag: '🇦🇷', region: 'América do Sul' },
    { value: 'CL', label: 'Chile', authority: 'DGAC', flag: '🇨🇱', region: 'América do Sul' },
    { value: 'EC', label: 'Equador', authority: 'DAC', flag: '🇪🇨', region: 'América do Sul' },
    { value: 'GY', label: 'Guiana', authority: 'GCAA', flag: '🇬🇾', region: 'América do Sul' },
    { value: 'PY', label: 'Paraguai', authority: 'DINAC', flag: '🇵🇾', region: 'América do Sul' },
    { value: 'UY', label: 'Uruguai', authority: 'DINACIA', flag: '🇺🇾', region: 'América do Sul' },
    { value: 'BO', label: 'Bolívia', authority: 'DGAC', flag: '🇧🇴', region: 'América do Sul' },
    
    // Américas - América Central e Caribe
    { value: 'PA', label: 'Panamá', authority: 'AAC', flag: '🇵🇦', region: 'América Central' },
    { value: 'TT', label: 'Trinidad e Tobago', authority: 'TTCAA', flag: '🇹🇹', region: 'Caribe' },
    
    // Europa
    { value: 'EU', label: 'União Europeia', authority: 'EASA', flag: '🇪🇺', region: 'Europa' },
    { value: 'PT', label: 'Portugal', authority: 'ANAC', flag: '🇵🇹', region: 'Europa' },
    { value: 'NL', label: 'Holanda', authority: 'ILT', flag: '🇳🇱', region: 'Europa' },
    { value: 'UK', label: 'Reino Unido', authority: 'CAA', flag: '�🇧', region: 'Europa' },
    { value: 'HU', label: 'Hungria', authority: 'NKH', flag: '🇭�🇺', region: 'Europa' },
    { value: 'AT', label: 'Áustria', authority: 'ACG', flag: '🇦🇹', region: 'Europa' },
    { value: 'CZ', label: 'República Tcheca', authority: 'CAA', flag: '🇨🇿', region: 'Europa' },
    { value: 'CH', label: 'Suíça', authority: 'FOCA', flag: '🇨🇭', region: 'Europa' },
    { value: 'PL', label: 'Polônia', authority: 'CAA', flag: '🇵🇱', region: 'Europa' },
    { value: 'DE', label: 'Alemanha', authority: 'LBA', flag: '🇩🇪', region: 'Europa' },
    { value: 'ES', label: 'Espanha', authority: 'AESA', flag: '🇪🇸', region: 'Europa' },
    { value: 'FI', label: 'Finlândia', authority: 'Traficom', flag: '🇫🇮', region: 'Europa' },
    { value: 'FR', label: 'França', authority: 'DGAC', flag: '🇫🇷', region: 'Europa' },
    { value: 'IE', label: 'Irlanda', authority: 'IAA', flag: '🇮🇪', region: 'Europa' },
    { value: 'NO', label: 'Noruega', authority: 'CAA', flag: '🇳🇴', region: 'Europa' },
    { value: 'BE', label: 'Bélgica', authority: 'BCAA', flag: '🇧🇪', region: 'Europa' },
    
    // Ásia
    { value: 'KR', label: 'Coreia do Sul', authority: 'MOLIT', flag: '🇰🇷', region: 'Ásia' },
    { value: 'CN', label: 'China', authority: 'CAAC', flag: '🇨🇳', region: 'Ásia' },
    { value: 'JP', label: 'Japão', authority: 'JCAB', flag: '🇯🇵', region: 'Ásia' },
    { value: 'KZ', label: 'Cazaquistão', authority: 'CAC', flag: '🇰🇿', region: 'Ásia' },
    { value: 'PH', label: 'Filipinas', authority: 'CAAP', flag: '🇵🇭', region: 'Ásia' },
    { value: 'IN', label: 'Índia', authority: 'DGCA', flag: '🇮🇳', region: 'Ásia' },
    { value: 'ID', label: 'Indonésia', authority: 'DGCA', flag: '🇮🇩', region: 'Ásia' },
    { value: 'LB', label: 'Líbano', authority: 'DGCA', flag: '🇱🇧', region: 'Oriente Médio' },
    { value: 'SA', label: 'Arábia Saudita', authority: 'GACA', flag: '�🇦', region: 'Oriente Médio' },
    { value: 'AE', label: 'Emirados Árabes Unidos', authority: 'GCAA', flag: '🇦🇪', region: 'Oriente Médio' },
    { value: 'VN', label: 'Vietnã', authority: 'CAAV', flag: '🇻🇳', region: 'Ásia' },
    
    // África
    { value: 'NG', label: 'Nigéria', authority: 'NCAA', flag: '🇳🇬', region: 'África' },
    { value: 'AO', label: 'Angola', authority: 'INCA', flag: '🇦🇴', region: 'África' },
    { value: 'KE', label: 'Quênia', authority: 'KCAA', flag: '🇰🇪', region: 'África' },
    { value: 'EG', label: 'Egito', authority: 'ECAA', flag: '🇪🇬', region: 'África' },
    { value: 'GH', label: 'Gana', authority: 'GCAA', flag: '🇬🇭', region: 'África' },
    { value: 'MZ', label: 'Moçambique', authority: 'IACM', flag: '🇲🇿', region: 'África' },
    { value: 'ZA', label: 'África do Sul', authority: 'SACAA', flag: '🇿🇦', region: 'África' },
    
    // Oceania
    { value: 'AU', label: 'Austrália', authority: 'CASA', flag: '🇦🇺', region: 'Oceania' },
    { value: 'PG', label: 'Papua-Nova Guiné', authority: 'CAA', flag: '🇵🇬', region: 'Oceania' }
  ];

  const handleValidation = async () => {
    if (!selectedAircraft || !targetCountry) return;
    
    setIsLoading(true);
    try {
      if (useAI) {
        console.log('🤖 Using AI-enhanced analysis...');
        const aiReport = await ComplianceService.validateComplianceWithAI(selectedAircraft, targetCountry);
        setAiComplianceReport(aiReport);
        setComplianceReport(null);
      } else {
        console.log('📋 Using traditional analysis...');
        const report = await ComplianceService.validateCompliance(selectedAircraft, targetCountry);
        setComplianceReport(report);
        setAiComplianceReport(null);
      }
    } catch (error) {
      console.error('Erro na validação:', error);
      alert('Erro ao validar conformidade. Verifique os dados selecionados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'non-compliant':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      compliant: 'bg-green-100 text-green-800 border-green-200',
      'non-compliant': 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };

    const labels = {
      compliant: 'Conforme',
      'non-compliant': 'Não Conforme',
      pending: 'Em Análise'
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getRiskBadge = (risk: string) => {
    const variants = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };

    const labels = {
      low: 'Baixo Risco',
      medium: 'Médio Risco',
      high: 'Alto Risco'
    };

    return (
      <Badge className={variants[risk as keyof typeof variants]}>
        {labels[risk as keyof typeof labels]}
      </Badge>
    );
  };

  const getRiskBadgeColor = (risk: string) => {
    const variants = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    return variants[risk as keyof typeof variants] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-blue-600 rounded-full">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Sistema de Validação de Conformidade
              </h1>
              <p className="text-lg text-blue-600 font-medium">Aeronaves Embraer</p>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Verifique a conformidade regulatória de aeronaves Embraer para comercialização e operação internacional 
            conforme regulamentações ANAC, FAA, EASA e outras autoridades aeronáuticas.
          </p>
        </div>

        {/* Formulário de Validação */}
        <Card className="border-2 border-blue-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-xl">
              <FileText className="h-6 w-6" />
              <span>Parâmetros de Validação de Conformidade</span>
            </CardTitle>
            <CardDescription className="text-blue-100">
              Selecione o modelo da aeronave Embraer e o país de destino para análise regulatória completa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <Plane className="h-4 w-4" />
                  <span>Modelo da Aeronave</span>
                </label>
                <Select value={selectedAircraft} onValueChange={setSelectedAircraft}>
                  <SelectTrigger className="border-2 h-12">
                    <SelectValue placeholder="Selecione o modelo Embraer" />
                  </SelectTrigger>
                  <SelectContent>
                    {aircraftModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{model.label}</span>
                          <span className="text-xs text-gray-500">{model.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <span className="text-lg">🇧🇷</span>
                  <span>País de Origem</span>
                </label>
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg h-12 flex items-center">
                  <span className="text-green-800 font-semibold">Brasil (ANAC)</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>País de Destino</span>
                </label>
                <Select value={targetCountry} onValueChange={setTargetCountry}>
                  <SelectTrigger className="border-2 h-12">
                    <SelectValue placeholder="Selecione o país de destino" />
                  </SelectTrigger>
                  <SelectContent className="max-h-96 overflow-y-auto">
                    {Object.entries(
                      targetCountries.reduce((acc, country) => {
                        const region = country.region || 'Outros';
                        if (!acc[region]) acc[region] = [];
                        acc[region].push(country);
                        return acc;
                      }, {} as Record<string, typeof targetCountries>)
                    ).map(([region, regionCountries]) => (
                      <div key={region}>
                        <div className="px-2 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border-b border-blue-200">
                          {region}
                        </div>
                        {regionCountries.map((country) => (
                          <SelectItem key={country.value} value={country.value} className="pl-6">
                            <div className="flex items-center space-x-2">
                              <span>{country.flag}</span>
                              <div className="flex flex-col">
                                <span className="font-medium">{country.label}</span>
                                <span className="text-xs text-gray-500">{country.authority}</span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Toggle de Análise AI */}
            <div className="flex items-center justify-center space-x-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
              <div className="flex items-center space-x-2">
                <Button
                  variant={useAI ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseAI(true)}
                  className={useAI ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Análise AI
                </Button>
                <Button
                  variant={!useAI ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseAI(false)}
                  className={!useAI ? "bg-gray-600 hover:bg-gray-700" : ""}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Análise Tradicional
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                {useAI ? (
                  <div className="flex items-center space-x-1">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <span>Análise inteligente com insights AI</span>
                  </div>
                ) : (
                  <span>Análise baseada em regras</span>
                )}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleValidation}
                disabled={!selectedAircraft || !targetCountry || isLoading}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 px-12 py-4 text-lg font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Validando Conformidade...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Iniciar Validação de Conformidade</span>
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sistema de Tabs para Análises */}
        <Tabs defaultValue="compliance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Análise de Conformidade
            </TabsTrigger>
            <TabsTrigger value="gap-analysis" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Análise de Lacunas
            </TabsTrigger>
          </TabsList>

          {/* Tab: Análise de Conformidade */}
          <TabsContent value="compliance" className="space-y-6">
            {/* Relatório AI Aprimorado */}
            {aiComplianceReport && (
              <div className="space-y-6">
            <Card className="border-2 shadow-xl border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-800 to-blue-900 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Brain className="h-6 w-6" />
                    Relatório AI de Conformidade Regulatória
                  </CardTitle>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(aiComplianceReport.overallStatus)}
                    {getRiskBadge(aiComplianceReport.riskLevel)}
                  </div>
                </div>
                <CardDescription className="text-purple-100">
                  Análise inteligente gerada em: {new Date(aiComplianceReport.generatedAt).toLocaleString('pt-BR')} | 
                  Timeline: {aiComplianceReport.estimatedTimeline} | 
                  Probabilidade de Sucesso: {Math.round(aiComplianceReport.successProbability * 100)}%
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex items-center space-x-3">
                        <Plane className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{aiComplianceReport.aircraft}</h3>
                          <p className="text-sm text-gray-600">{aiComplianceReport.originCountry}</p>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Globe className="h-8 w-8 text-green-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{aiComplianceReport.targetCountry}</h3>
                          <p className="text-sm text-gray-600">Destino da validação</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Status Geral</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Conformidade</span>
                          {getStatusIcon(aiComplianceReport.overallStatus)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Nível de Risco</span>
                          <Badge className={getRiskBadgeColor(aiComplianceReport.riskLevel)}>
                            {aiComplianceReport.riskLevel.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Timeline</span>
                          <span className="text-sm font-medium">{aiComplianceReport.estimatedTimeline}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Renderizar Insights AI */}
                <AIInsightsDisplay report={aiComplianceReport} />
                
                {/* Regulamentações (se disponível) */}
                {aiComplianceReport.regulations && aiComplianceReport.regulations.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Análise Regulatória Detalhada
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {aiComplianceReport.regulations.map((regulation, index) => (
                        <Card key={index} className="border border-gray-200">
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base font-semibold text-gray-800">
                                {regulation.authority}
                              </CardTitle>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(regulation.status)}
                                <span className="text-sm font-medium">
                                  {regulation.completionPercentage}%
                                </span>
                              </div>
                            </div>
                            <Progress value={regulation.completionPercentage} className="w-full" />
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Requisitos:</h5>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {regulation.requirements.map((req, idx) => (
                                    <li key={idx} className="flex items-center space-x-2">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      <span>{req}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              {regulation.pendingItems && regulation.pendingItems.length > 0 && (
                                <div>
                                  <h5 className="text-sm font-semibold text-red-700 mb-2">Itens Pendentes:</h5>
                                  <ul className="text-sm text-red-600 space-y-1">
                                    {regulation.pendingItems.map((item, idx) => (
                                      <li key={idx} className="flex items-center space-x-2">
                                        <AlertTriangle className="h-3 w-3 text-red-500" />
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Relatório de Conformidade */}
        {complianceReport && (
          <Card className="border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Relatório de Conformidade Regulatória</CardTitle>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(complianceReport.overallStatus)}
                  {getRiskBadge(complianceReport.riskLevel)}
                </div>
              </div>
              <CardDescription className="text-gray-300">
                Gerado em: {new Date(complianceReport.generatedAt).toLocaleString('pt-BR')} | 
                {complianceReport.estimatedCompletionDays && 
                  ` Conclusão estimada: ${complianceReport.estimatedCompletionDays} dias`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {/* Resumo Executivo */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <Plane className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                  <p className="font-bold text-lg text-gray-800">{complianceReport.aircraft}</p>
                  <p className="text-sm text-gray-600">Modelo da Aeronave</p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
                  <span className="text-3xl mb-3 block">🇧🇷</span>
                  <p className="font-bold text-lg text-gray-800">{complianceReport.originCountry}</p>
                  <p className="text-sm text-gray-600">País de Origem</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
                  <Globe className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                  <p className="font-bold text-lg text-gray-800">{complianceReport.targetCountry}</p>
                  <p className="text-sm text-gray-600">País de Destino</p>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-xl border-2 border-orange-200">
                  <Clock className="h-10 w-10 text-orange-600 mx-auto mb-3" />
                  <p className="font-bold text-lg text-gray-800">
                    {complianceReport.estimatedCompletionDays ? `${complianceReport.estimatedCompletionDays} dias` : 'Concluído'}
                  </p>
                  <p className="text-sm text-gray-600">Tempo Estimado</p>
                </div>
              </div>

              <Separator />

              {/* Status Geral */}
              <Alert className={`border-2 p-6 ${
                complianceReport.overallStatus === 'compliant' ? 'border-green-200 bg-green-50' :
                complianceReport.overallStatus === 'pending' ? 'border-yellow-200 bg-yellow-50' :
                'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(complianceReport.overallStatus)}
                    <div>
                      <p className="text-lg font-bold">Status Geral de Conformidade</p>
                      <AlertDescription className="text-base">
                        {complianceReport.overallStatus === 'compliant' && 
                          'Aeronave em conformidade com todas as regulamentações necessárias para operação.'}
                        {complianceReport.overallStatus === 'pending' && 
                          'Alguns requisitos regulatórios pendentes. Revisão e ações necessárias.'}
                        {complianceReport.overallStatus === 'non-compliant' && 
                          'Não conformidade identificada. Ações corretivas urgentes necessárias.'}
                      </AlertDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(complianceReport.overallStatus)}
                    <p className="text-sm text-gray-600 mt-1">Nível de Risco: {getRiskBadge(complianceReport.riskLevel)}</p>
                  </div>
                </div>
              </Alert>

              {/* Detalhes das Regulamentações */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                  <Shield className="h-6 w-6" />
                  <span>Análise Detalhada por Autoridade Regulatória</span>
                </h3>
                
                {complianceReport.regulations.map((regulation, index) => (
                  <Card key={index} className="border-2 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center space-x-3">
                          {getStatusIcon(regulation.status)}
                          <span className="text-xl">{regulation.authority}</span>
                        </span>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(regulation.status)}
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Progresso</p>
                            <p className="font-bold">{regulation.completionPercentage}%</p>
                          </div>
                        </div>
                      </CardTitle>
                      <div className="mt-2">
                        <Progress value={regulation.completionPercentage} className="h-3" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-bold text-gray-700 mb-3 flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span>Requisitos Atendidos ({regulation.requirements.length})</span>
                        </h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-16">Status</TableHead>
                              <TableHead>Requisito Regulatório</TableHead>
                              <TableHead className="w-24">Validade</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {regulation.requirements.map((req, reqIndex) => (
                              <TableRow key={reqIndex}>
                                <TableCell>
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                </TableCell>
                                <TableCell className="font-medium">{req}</TableCell>
                                <TableCell>
                                  <Badge className="bg-green-100 text-green-800">Válido</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {regulation.pendingItems && regulation.pendingItems.length > 0 && (
                        <div>
                          <h4 className="font-bold text-yellow-700 mb-3 flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            <span>Itens Pendentes ({regulation.pendingItems.length})</span>
                          </h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-16">Status</TableHead>
                                <TableHead>Item Pendente</TableHead>
                                <TableHead className="w-32">Prioridade</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {regulation.pendingItems.map((item, itemIndex) => (
                                <TableRow key={itemIndex}>
                                  <TableCell>
                                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                  </TableCell>
                                  <TableCell className="font-medium">{item}</TableCell>
                                  <TableCell>
                                    <Badge className="bg-orange-100 text-orange-800">
                                      {itemIndex === 0 ? 'Alta' : 'Média'}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Próximos Passos */}
              {complianceReport.overallStatus !== 'compliant' && (
                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-800">Próximos Passos Recomendados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2 text-blue-700">
                      <li>1. Revisar todos os itens pendentes listados acima</li>
                      <li>2. Entrar em contato com a autoridade regulatória competente</li>
                      <li>3. Preparar documentação adicional necessária</li>
                      <li>4. Agendar inspeções ou auditorias se aplicável</li>
                      <li>5. Monitorar o progresso e prazos estabelecidos</li>
                    </ol>
                  </CardContent>
                </Card>
              )}

              {/* JSON Raw Data */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-800">Dados Estruturados (JSON)</h3>
                <p className="text-sm text-gray-600">Para integração com sistemas externos ou arquivamento</p>
                <pre className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 text-sm overflow-x-auto max-h-64 overflow-y-auto">
                  {JSON.stringify(complianceReport, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
          </TabsContent>

          {/* Tab: Análise de Lacunas */}
          <TabsContent value="gap-analysis" className="space-y-6">
            <GapAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}