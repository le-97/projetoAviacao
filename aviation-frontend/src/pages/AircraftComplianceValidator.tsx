import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, Plane, Globe, FileText, Shield, Clock } from 'lucide-react';

interface ComplianceReport {
  aircraft: string;
  originCountry: string;
  targetCountry: string;
  regulations: {
    authority: string;
    status: 'compliant' | 'non-compliant' | 'pending';
    requirements: string[];
    pendingItems?: string[];
    completionPercentage: number;
  }[];
  overallStatus: 'compliant' | 'non-compliant' | 'pending';
  riskLevel: 'low' | 'medium' | 'high';
  estimatedCompletionDays?: number;
  generatedAt: string;
}

export default function AircraftComplianceValidator() {
  const [selectedAircraft, setSelectedAircraft] = useState<string>('');
  const [targetCountry, setTargetCountry] = useState<string>('');
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const aircraftModels = [
    { value: 'E190', label: 'Embraer E190', description: 'Regional jet, 96-114 passageiros' },
    { value: 'E195', label: 'Embraer E195', description: 'Regional jet, 124-146 passageiros' },
    { value: 'E175', label: 'Embraer E175', description: 'Regional jet, 76-88 passageiros' },
    { value: 'E170', label: 'Embraer E170', description: 'Regional jet, 70-80 passageiros' }
  ];

  const targetCountries = [
    { value: 'USA', label: 'Estados Unidos', authority: 'FAA', flag: '🇺🇸' },
    { value: 'EU', label: 'União Europeia', authority: 'EASA', flag: '🇪🇺' },
    { value: 'CA', label: 'Canadá', authority: 'Transport Canada', flag: '🇨🇦' },
    { value: 'UK', label: 'Reino Unido', authority: 'CAA', flag: '🇬🇧' }
  ];

  const mockComplianceCheck = async (): Promise<ComplianceReport> => {
    // Simulação de chamada à API de validação de conformidade
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const targetCountryData = targetCountries.find(c => c.value === targetCountry);
    const aircraftData = aircraftModels.find(a => a.value === selectedAircraft);
    
    // Simulação de dados baseados na seleção
    const mockData: ComplianceReport = {
      aircraft: aircraftData?.label || selectedAircraft,
      originCountry: 'Brasil (ANAC)',
      targetCountry: `${targetCountryData?.label} (${targetCountryData?.authority})`,
      regulations: [
        {
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
        },
        {
          authority: targetCountryData?.authority || 'FAA',
          status: targetCountry === 'EU' ? 'pending' : targetCountry === 'UK' ? 'non-compliant' : 'compliant',
          completionPercentage: targetCountry === 'EU' ? 65 : targetCountry === 'UK' ? 30 : 95,
          requirements: [
            'Type Certificate Validation',
            'Standard Airworthiness Certificate',
            'Registration Certificate',
            'Operational Specifications',
            'Maintenance Program Approval'
          ],
          pendingItems: targetCountry === 'EU' ? [
            'EASA Supplemental Type Certificate (STC)',
            'European Aviation Safety Documentation',
            'Noise Certificate Validation'
          ] : targetCountry === 'UK' ? [
            'Post-Brexit Aviation Agreement',
            'CAA Type Certificate Recognition',
            'UK-specific Airworthiness Directives',
            'Brexit Transition Documentation'
          ] : undefined
        }
      ],
      overallStatus: targetCountry === 'EU' ? 'pending' : targetCountry === 'UK' ? 'non-compliant' : 'compliant',
      riskLevel: targetCountry === 'UK' ? 'high' : targetCountry === 'EU' ? 'medium' : 'low',
      estimatedCompletionDays: targetCountry === 'EU' ? 45 : targetCountry === 'UK' ? 120 : undefined,
      generatedAt: new Date().toISOString()
    };

    return mockData;
  };

  const handleValidation = async () => {
    if (!selectedAircraft || !targetCountry) return;
    
    setIsLoading(true);
    try {
      const report = await mockComplianceCheck();
      setComplianceReport(report);
    } catch (error) {
      console.error('Erro na validação:', error);
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
                  <SelectContent>
                    {targetCountries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        <div className="flex items-center space-x-2">
                          <span>{country.flag}</span>
                          <div className="flex flex-col">
                            <span className="font-medium">{country.label}</span>
                            <span className="text-xs text-gray-500">{country.authority}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
      </div>
    </div>
  );
}