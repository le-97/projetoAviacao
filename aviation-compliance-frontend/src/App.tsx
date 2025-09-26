import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plane, Shield, BarChart3, Settings, FileText, Globe, AlertTriangle } from 'lucide-react'

// Pages (will be created later)
import Dashboard from '@/pages/Dashboard'
import AircraftManagement from '@/pages/AircraftManagement'
import ComplianceChecking from '@/pages/ComplianceChecking'
import Reports from '@/pages/Reports'
import SettingsPage from '@/pages/Settings'

type Page = 'dashboard' | 'aircraft' | 'compliance' | 'reports' | 'settings'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  // Temporary navigation for development
  const navigation = [
    { 
      id: 'dashboard' as Page, 
      label: 'Dashboard', 
      icon: BarChart3,
      description: 'Visão geral do sistema de conformidade'
    },
    { 
      id: 'aircraft' as Page, 
      label: 'Aeronaves', 
      icon: Plane,
      description: 'Gestão da frota de aeronaves'
    },
    { 
      id: 'compliance' as Page, 
      label: 'Conformidade', 
      icon: Shield,
      description: 'Sistema de validação regulatória'
    },
    { 
      id: 'reports' as Page, 
      label: 'Relatórios', 
      icon: FileText,
      description: 'Relatórios e análises detalhadas'
    },
    { 
      id: 'settings' as Page, 
      label: 'Configurações', 
      icon: Settings,
      description: 'Configurações do sistema'
    }
  ]

  // For now, we'll use a simple page renderer instead of React Router
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'aircraft':
        return <AircraftManagement />
      case 'compliance':
        return <ComplianceChecking />
      case 'reports':
        return <Reports />
      case 'settings':
        return <SettingsPage />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header de Navegação */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 aviation-gradient rounded-lg text-white">
                <Plane className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sistema de Conformidade Aeronáutica</h1>
                <p className="text-sm text-gray-600">Plataforma Integrada de Gestão Regulatória</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? 'aviation' : 'outline'}
                    onClick={() => setCurrentPage(item.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentPage === 'dashboard' ? (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-aviation-gradient">
                Bem-vindo ao Sistema de Conformidade Aeronáutica
              </h2>
              <p className="text-gray-600 text-lg max-w-4xl mx-auto">
                Gerencie a conformidade regulatória de sua frota de aeronaves com inteligência artificial 
                e análise automatizada de gaps regulatórios.
              </p>
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {navigation.filter(nav => nav.id !== 'dashboard').map((item) => {
                const Icon = item.icon
                return (
                  <Card 
                    key={item.id}
                    className="cursor-pointer hover:shadow-aviation-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-blue-50 border-blue-200"
                    onClick={() => setCurrentPage(item.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="p-3 aviation-gradient rounded-lg text-white">
                          <Icon className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{item.label}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {item.id === 'aircraft' && 'Gerencie sua frota'}
                          {item.id === 'compliance' && 'Validação automática'}
                          {item.id === 'reports' && 'Análises detalhadas'}
                          {item.id === 'settings' && 'Configurar sistema'}
                        </div>
                        <Button variant="ghost" size="sm">
                          Acessar →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="aviation-gradient text-white border-aviation-400">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total de Aeronaves</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <Plane className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-green-400">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Taxa de Conformidade</p>
                      <p className="text-2xl font-bold">94%</p>
                    </div>
                    <Shield className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-purple-400">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Países Certificados</p>
                      <p className="text-2xl font-bold">28</p>
                    </div>
                    <Globe className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-orange-400">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Alertas Ativos</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Status do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm font-medium text-gray-700">API Backend</p>
                    <p className="text-xs text-gray-500">Operacional</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm font-medium text-gray-700">Banco de Dados</p>
                    <p className="text-xs text-gray-500">Conectado</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm font-medium text-gray-700">Análise IA</p>
                    <p className="text-xs text-gray-500">Disponível</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {renderPage()}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 aviation-gradient rounded-lg text-white">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Sistema de Conformidade Aeronáutica</p>
                <p className="text-sm text-gray-600">Desenvolvido para o Projeto Aviação</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              © 2025 Projeto Aviação. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App