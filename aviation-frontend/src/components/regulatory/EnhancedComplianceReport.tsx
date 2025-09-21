import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, AlertTriangle, Shield, Clock } from 'lucide-react';

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

interface EnhancedComplianceReportProps {
  report: ComplianceReport;
}

const authorityColors = {
  'ANAC (Brasil)': {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-900',
    accent: 'border-l-green-500'
  },
  'FAA': {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    accent: 'border-l-blue-500'
  },
  'EASA': {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-900',
    accent: 'border-l-purple-500'
  },
  'Transport Canada': {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-900',
    accent: 'border-l-red-500'
  }
};

export default function EnhancedComplianceReport({ report }: EnhancedComplianceReportProps) {
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
      <Badge className={`${variants[status as keyof typeof variants]} font-semibold border`}>
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
      <Badge className={`${variants[risk as keyof typeof variants]} font-semibold border`}>
        {labels[risk as keyof typeof labels]}
      </Badge>
    );
  };

  const getAuthorityStyle = (authority: string) => {
    const key = Object.keys(authorityColors).find(k => authority.includes(k)) || 'FAA';
    return authorityColors[key as keyof typeof authorityColors];
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'non-compliant':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="border-2 shadow-xl bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>
            Relatório de Conformidade Regulatória
          </CardTitle>
          <div className="flex items-center space-x-3">
            {getStatusBadge(report.overallStatus)}
            {getRiskBadge(report.riskLevel)}
          </div>
        </div>
        <CardDescription className="text-gray-300" style={{ fontFamily: "'Inter', sans-serif" }}>
          Gerado em: {new Date(report.generatedAt).toLocaleString('pt-BR')} | 
          {report.estimatedCompletionDays && 
            ` Conclusão estimada: ${report.estimatedCompletionDays} dias`
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-8 space-y-8">
        {/* Enhanced Executive Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 shadow-sm">
            <div className="p-3 bg-blue-500 rounded-full mx-auto mb-3 w-fit">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <p className="font-bold text-lg text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>
              {report.aircraft}
            </p>
            <p className="text-sm text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
              Modelo da Aeronave
            </p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 shadow-sm">
            <span className="text-4xl mb-3 block">🇧🇷</span>
            <p className="font-bold text-lg text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>
              {report.originCountry}
            </p>
            <p className="text-sm text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
              País de Origem
            </p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 shadow-sm">
            <div className="p-3 bg-purple-500 rounded-full mx-auto mb-3 w-fit">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <p className="font-bold text-lg text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>
              {report.targetCountry}
            </p>
            <p className="text-sm text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
              País de Destino
            </p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200 shadow-sm">
            <div className="p-3 bg-orange-500 rounded-full mx-auto mb-3 w-fit">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <p className="font-bold text-lg text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>
              {report.estimatedCompletionDays ? `${report.estimatedCompletionDays} dias` : 'Concluído'}
            </p>
            <p className="text-sm text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
              Tempo Estimado
            </p>
          </div>
        </div>

        {/* Enhanced Overall Status Alert */}
        <Alert className={`border-2 p-6 ${
          report.overallStatus === 'compliant' ? 'border-green-200 bg-green-50' :
          report.overallStatus === 'pending' ? 'border-yellow-200 bg-yellow-50' :
          'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(report.overallStatus)}
              <div>
                <AlertTitle className="text-lg font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Status Geral de Conformidade
                </AlertTitle>
                <AlertDescription className="text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {report.overallStatus === 'compliant' && 
                    'Aeronave em conformidade com todas as regulamentações necessárias para operação.'}
                  {report.overallStatus === 'pending' && 
                    'Alguns requisitos regulatórios pendentes. Revisão e ações necessárias.'}
                  {report.overallStatus === 'non-compliant' && 
                    'Não conformidade identificada. Ações corretivas urgentes necessárias.'}
                </AlertDescription>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(report.overallStatus)}
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Nível de Risco:
                </span>
                {getRiskBadge(report.riskLevel)}
              </div>
            </div>
          </div>
        </Alert>

        {/* Enhanced Multi-Authority Dashboard */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Shield className="h-6 w-6" />
            <span>Análise Detalhada por Autoridade Regulatória</span>
          </h3>
          
          {report.regulations.map((regulation, index) => {
            const authorityStyle = getAuthorityStyle(regulation.authority);
            return (
              <Card key={index} className={`border-2 shadow-lg rounded-xl overflow-hidden ${authorityStyle.bg} border-l-4 ${authorityStyle.accent}`}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-3">
                      {getStatusIcon(regulation.status)}
                      <span className={`text-xl font-bold ${authorityStyle.text}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                        {regulation.authority}
                      </span>
                    </span>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(regulation.status)}
                      <div className="text-right">
                        <p className="text-sm text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                          Progresso
                        </p>
                        <p className="font-bold text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {regulation.completionPercentage}%
                        </p>
                      </div>
                    </div>
                  </CardTitle>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ease-out ${getProgressBarColor(regulation.status)}`}
                        style={{ width: `${regulation.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Requirements Table */}
                  <div>
                    <h4 className="font-bold text-gray-700 mb-3 flex items-center space-x-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Requisitos Atendidos ({regulation.requirements.length})</span>
                    </h4>
                    <Table className="bg-white rounded-lg overflow-hidden shadow-sm">
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-16 font-semibold">Status</TableHead>
                          <TableHead className="font-semibold">Requisito Regulatório</TableHead>
                          <TableHead className="w-24 font-semibold">Validade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {regulation.requirements.map((req, reqIndex) => (
                          <TableRow key={reqIndex} className="hover:bg-gray-50 transition-colors">
                            <TableCell>
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </TableCell>
                            <TableCell className="font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                              {req}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800 border-green-200 font-semibold">
                                Válido
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pending Items Table */}
                  {regulation.pendingItems && regulation.pendingItems.length > 0 && (
                    <div>
                      <h4 className="font-bold text-yellow-700 mb-3 flex items-center space-x-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <span>Itens Pendentes ({regulation.pendingItems.length})</span>
                      </h4>
                      <Table className="bg-white rounded-lg overflow-hidden shadow-sm">
                        <TableHeader>
                          <TableRow className="bg-yellow-50">
                            <TableHead className="w-16 font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Item Pendente</TableHead>
                            <TableHead className="w-32 font-semibold">Prioridade</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {regulation.pendingItems.map((item, itemIndex) => (
                            <TableRow key={itemIndex} className="hover:bg-yellow-50 transition-colors">
                              <TableCell>
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                              </TableCell>
                              <TableCell className="font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {item}
                              </TableCell>
                              <TableCell>
                                <Badge className={`font-semibold ${
                                  itemIndex === 0 ? 'bg-red-100 text-red-800 border-red-200' : 'bg-orange-100 text-orange-800 border-orange-200'
                                }`}>
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
            );
          })}
        </div>

        {/* Enhanced Next Steps */}
        {report.overallStatus !== 'compliant' && (
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-800 font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>
                Próximos Passos Recomendados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-blue-700" style={{ fontFamily: "'Inter', sans-serif" }}>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-800">1.</span>
                  <span>Revisar todos os itens pendentes listados acima</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-800">2.</span>
                  <span>Entrar em contato com a autoridade regulatória competente</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-800">3.</span>
                  <span>Preparar documentação adicional necessária</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-800">4.</span>
                  <span>Agendar inspeções ou auditorias se aplicável</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-800">5.</span>
                  <span>Monitorar o progresso e prazos estabelecidos</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Enhanced JSON Output */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>
            Dados Estruturados (JSON)
          </h3>
          <p className="text-sm text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
            Para integração com sistemas externos ou arquivamento
          </p>
          <div className="bg-gray-900 border-2 border-gray-300 rounded-lg p-4 overflow-x-auto max-h-64 overflow-y-auto shadow-inner">
            <pre className="text-sm text-green-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {JSON.stringify(report, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}