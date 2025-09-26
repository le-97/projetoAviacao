import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Download, 
  Filter,
  Calendar,
  BarChart3,
  TrendingUp,
  PieChart,
  Eye,
  RefreshCw,
  FileSpreadsheet,
  Mail
} from 'lucide-react'

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('last-30-days')
  const [selectedType, setSelectedType] = useState('all')
  
  const reportTemplates = [
    {
      id: 1,
      name: 'Relatório de Conformidade Geral',
      description: 'Visão completa do status de conformidade da frota',
      type: 'compliance',
      frequency: 'Mensal',
      lastGenerated: '2024-01-15',
      icon: BarChart3
    },
    {
      id: 2,
      name: 'Análise de Tendências',
      description: 'Análise temporal das métricas de conformidade',
      type: 'analytics',
      frequency: 'Trimestral',
      lastGenerated: '2024-01-10',
      icon: TrendingUp
    },
    {
      id: 3,
      name: 'Status por Aeronave',
      description: 'Relatório detalhado de cada aeronave da frota',
      type: 'fleet',
      frequency: 'Semanal',
      lastGenerated: '2024-01-18',
      icon: PieChart
    },
    {
      id: 4,
      name: 'Relatório de Não Conformidades',
      description: 'Listagem e análise de todas as não conformidades',
      type: 'issues',
      frequency: 'Conforme necessário',
      lastGenerated: '2024-01-12',
      icon: FileText
    }
  ]

  const recentReports = [
    {
      id: 1,
      name: 'Relatório Mensal - Janeiro 2024',
      type: 'Conformidade Geral',
      generatedAt: '2024-01-20T10:30:00',
      size: '2.3 MB',
      format: 'PDF',
      status: 'completed'
    },
    {
      id: 2,
      name: 'Análise Trimestral Q4 2023',
      type: 'Tendências',
      generatedAt: '2024-01-15T14:20:00',
      size: '1.8 MB',
      format: 'XLSX',
      status: 'completed'
    },
    {
      id: 3,
      name: 'Status Frota - Semana 3',
      type: 'Fleet Status',
      generatedAt: '2024-01-18T09:15:00',
      size: '875 KB',
      format: 'PDF',
      status: 'generating'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'generating':
        return 'text-blue-600 bg-blue-100'
      case 'error':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-1">Gere e visualize relatórios de conformidade personalizados</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Agendar Relatório
          </Button>
          <Button variant="aviation">
            <FileText className="w-4 h-4 mr-2" />
            Novo Relatório
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="last-7-days">Últimos 7 dias</option>
                <option value="last-30-days">Últimos 30 dias</option>
                <option value="last-90-days">Últimos 90 dias</option>
                <option value="last-year">Último ano</option>
                <option value="custom">Período personalizado</option>
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Relatório
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os tipos</option>
                <option value="compliance">Conformidade</option>
                <option value="analytics">Análise</option>
                <option value="fleet">Frota</option>
                <option value="issues">Não Conformidades</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Modelos de Relatório</CardTitle>
          <CardDescription>
            Selecione um modelo para gerar um novo relatório
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTemplates.map((template) => {
              const IconComponent = template.icon
              return (
                <div key={template.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                    <span>Frequência: {template.frequency}</span>
                    <span>Último: {new Date(template.lastGenerated).toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Visualizar
                    </Button>
                    <Button size="sm" variant="aviation" className="flex-1">
                      <FileText className="w-4 h-4 mr-1" />
                      Gerar
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Recentes</CardTitle>
          <CardDescription>
            Histórico de relatórios gerados nos últimos 30 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">{report.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>{report.type}</span>
                      <span>{new Date(report.generatedAt).toLocaleDateString('pt-BR')} às {new Date(report.generatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>{report.size}</span>
                      <span className="font-medium">{report.format}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status === 'completed' ? 'Concluído' : 
                     report.status === 'generating' ? 'Gerando...' : 'Erro'}
                  </span>
                  
                  {report.status === 'completed' && (
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  {report.status === 'generating' && (
                    <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">27</div>
            <div className="text-sm text-gray-600">Relatórios este mês</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">94%</div>
            <div className="text-sm text-gray-600">Taxa de sucesso</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">3</div>
            <div className="text-sm text-gray-600">Relatórios agendados</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">15.2MB</div>
            <div className="text-sm text-gray-600">Tamanho médio</div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-green-900">Opções de Exportação</CardTitle>
          <CardDescription>
            Personalize o formato e entrega dos seus relatórios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">PDF</h3>
              <p className="text-sm text-gray-600">
                Formato padrão para relatórios executivos
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileSpreadsheet className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Excel</h3>
              <p className="text-sm text-gray-600">
                Dados estruturados para análises avançadas
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-sm text-gray-600">
                Envio automático para stakeholders
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}