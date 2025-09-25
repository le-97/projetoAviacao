import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Shield, 
  Play, 
  Upload,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Bot,
  Search,
  Download,
  RefreshCw
} from 'lucide-react'

export default function ComplianceChecking() {
  const [selectedAircraft, setSelectedAircraft] = useState('')
  const [checkingStatus, setCheckingStatus] = useState<'idle' | 'running' | 'completed'>('idle')
  
  const aircraftOptions = [
    { id: 'PR-ABC123', model: 'Embraer E190' },
    { id: 'PR-XYZ456', model: 'Boeing 737-800' },
    { id: 'PR-DEF789', model: 'Airbus A320' }
  ]

  const complianceResults = {
    overallScore: 94,
    totalChecks: 127,
    passedChecks: 119,
    failedChecks: 5,
    warningChecks: 3,
    categories: [
      {
        name: 'Documentação',
        score: 98,
        status: 'passed',
        checks: 45,
        issues: 1
      },
      {
        name: 'Certificações',
        score: 92,
        status: 'warning',
        checks: 23,
        issues: 2
      },
      {
        name: 'Manutenção',
        score: 89,
        status: 'warning',
        checks: 34,
        issues: 4
      },
      {
        name: 'Operacional',
        score: 96,
        status: 'passed',
        checks: 25,
        issues: 1
      }
    ],
    criticalIssues: [
      {
        id: 1,
        title: 'Certificado ANAC próximo ao vencimento',
        description: 'Certificado de Tipo vence em 15 dias',
        severity: 'high',
        category: 'Certificações',
        recommendation: 'Renovar certificado imediatamente'
      },
      {
        id: 2,
        title: 'Inspeção 100h atrasada',
        description: 'Inspeção obrigatória está 10 horas em atraso',
        severity: 'critical',
        category: 'Manutenção',
        recommendation: 'Agendar inspeção urgentemente'
      },
      {
        id: 3,
        title: 'Documentação incompleta',
        description: 'Faltam 2 documentos no registro operacional',
        severity: 'medium',
        category: 'Documentação',
        recommendation: 'Completar documentação pendente'
      }
    ]
  }

  const handleStartCheck = () => {
    setCheckingStatus('running')
    // Simular verificação
    setTimeout(() => {
      setCheckingStatus('completed')
    }, 3000)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50'
      case 'high':
        return 'border-orange-500 bg-orange-50'
      case 'medium':
        return 'border-yellow-500 bg-yellow-50'
      default:
        return 'border-gray-300 bg-gray-50'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      case 'medium':
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <CheckCircle className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Verificação de Conformidade</h1>
          <p className="text-gray-600 mt-1">Análise automatizada com IA para verificação de conformidade regulatória</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importar Documentos
          </Button>
          <Button variant="aviation">
            <Bot className="w-4 h-4 mr-2" />
            Análise com IA
          </Button>
        </div>
      </div>

      {/* Quick Start Panel */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Zap className="w-5 h-5" />
            Verificação Rápida
          </CardTitle>
          <CardDescription>
            Selecione uma aeronave e inicie a verificação automatizada de conformidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecionar Aeronave
              </label>
              <select
                value={selectedAircraft}
                onChange={(e) => setSelectedAircraft(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Escolha uma aeronave...</option>
                {aircraftOptions.map((aircraft) => (
                  <option key={aircraft.id} value={aircraft.id}>
                    {aircraft.id} - {aircraft.model}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={handleStartCheck}
                disabled={!selectedAircraft || checkingStatus === 'running'}
                variant="aviation"
                className="min-w-[160px]"
              >
                {checkingStatus === 'running' ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Verificação
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {checkingStatus === 'completed' && (
        <>
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Resultado da Verificação - {selectedAircraft}
              </CardTitle>
              <CardDescription>
                Análise completa de conformidade realizada em {new Date().toLocaleString('pt-BR')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {complianceResults.overallScore}%
                  </div>
                  <div className="text-sm text-gray-600">Score Geral</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {complianceResults.passedChecks}
                  </div>
                  <div className="text-sm text-gray-600">Verificações Aprovadas</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">
                    {complianceResults.warningChecks}
                  </div>
                  <div className="text-sm text-gray-600">Avisos</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-2">
                    {complianceResults.failedChecks}
                  </div>
                  <div className="text-sm text-gray-600">Falhas Críticas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Análise por Categoria</CardTitle>
              <CardDescription>
                Detalhamento do score de conformidade por área regulatória
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complianceResults.categories.map((category, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <div className="flex items-center gap-2">
                        {category.status === 'passed' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        )}
                        <span className="font-bold text-lg">{category.score}%</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {category.checks} verificações • {category.issues} issues encontradas
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${category.score >= 95 ? 'bg-green-500' : category.score >= 85 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${category.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Critical Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Issues Críticas
              </CardTitle>
              <CardDescription>
                Problemas que requerem atenção imediata
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceResults.criticalIssues.map((issue) => (
                  <div key={issue.id} className={`p-4 border-l-4 rounded-lg ${getSeverityColor(issue.severity)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getSeverityIcon(issue.severity)}
                          <h3 className="font-semibold text-gray-900">{issue.title}</h3>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {issue.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                        <div className="text-sm">
                          <strong>Recomendação:</strong> {issue.recommendation}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Search className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="aviation">
                          Resolver
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar Relatório
            </Button>
            <Button variant="aviation">
              <FileText className="w-4 h-4 mr-2" />
              Gerar Plano de Ação
            </Button>
          </div>
        </>
      )}

      {/* AI Features Info */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <Bot className="w-5 h-5" />
            Recursos de IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Análise Inteligente</h3>
              <p className="text-sm text-gray-600">
                IA analisa documentos e identifica não conformidades automaticamente
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verificação Rápida</h3>
              <p className="text-sm text-gray-600">
                Processo de verificação 10x mais rápido que métodos tradicionais
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Recomendações</h3>
              <p className="text-sm text-gray-600">
                Sugestões inteligentes para resolver problemas de conformidade
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}