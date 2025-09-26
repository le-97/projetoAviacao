import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  Plane, 
  Shield, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  FileText,
  Activity
} from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral do sistema de conformidade aeronáutica</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Gerar Relatório
          </Button>
          <Button variant="aviation">
            <Shield className="w-4 h-4 mr-2" />
            Nova Verificação
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Aeronaves</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
                <p className="text-sm text-green-600 mt-1">+2 este mês</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Plane className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conformidade</p>
                <p className="text-3xl font-bold text-gray-900">94%</p>
                <p className="text-sm text-green-600 mt-1">+3% vs mês anterior</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alertas Ativos</p>
                <p className="text-3xl font-bold text-gray-900">3</p>
                <p className="text-sm text-yellow-600 mt-1">2 críticos</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inspeções Pendentes</p>
                <p className="text-3xl font-bold text-gray-900">7</p>
                <p className="text-sm text-purple-600 mt-1">nos próximos 30 dias</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tendências de Conformidade
            </CardTitle>
            <CardDescription>
              Taxa de conformidade nos últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Gráfico de tendências será implementado aqui</p>
                <p className="text-sm">Usando Recharts para visualização</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Verificação E190 concluída</p>
                  <p className="text-xs text-gray-500">PR-ABC • há 2 horas</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Certificado próximo ao vencimento</p>
                  <p className="text-xs text-gray-500">PR-XYZ • há 4 horas</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nova aeronave adicionada</p>
                  <p className="text-xs text-gray-500">PR-DEF • há 1 dia</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Não conformidade detectada</p>
                  <p className="text-xs text-gray-500">PR-GHI • há 2 dias</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Button variant="ghost" className="w-full">
                Ver todas as atividades
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Status and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fleet Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status da Frota</CardTitle>
            <CardDescription>Distribuição das aeronaves por status operacional</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">Operacional</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">8 aeronaves</span>
                  <span className="text-xs text-gray-500">(67%)</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm">Manutenção</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">3 aeronaves</span>
                  <span className="text-xs text-gray-500">(25%)</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Não operacional</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">1 aeronave</span>
                  <span className="text-xs text-gray-500">(8%)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas Críticos
            </CardTitle>
            <CardDescription>Itens que requerem atenção imediata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-800">Certificado ANAC vencido</p>
                    <p className="text-xs text-red-600">PR-ABC • Vencido há 5 dias</p>
                  </div>
                  <Button size="sm" variant="destructive">
                    Resolver
                  </Button>
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Inspeção 100h vencida</p>
                    <p className="text-xs text-yellow-600">PR-XYZ • Vence em 2 dias</p>
                  </div>
                  <Button size="sm" variant="warning">
                    Agendar
                  </Button>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Documentação pendente</p>
                    <p className="text-xs text-blue-600">PR-DEF • Revisão necessária</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Revisar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}