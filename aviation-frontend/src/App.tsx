import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Sparkles, Shield, BarChart3 } from 'lucide-react';
import AircraftComplianceValidator from './pages/AircraftComplianceValidator';
import AIUIShowcase from './components/ai/AIUIShowcase';
import './App.css';

type Page = 'compliance' | 'showcase';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('compliance');

  const navigation = [
    { 
      id: 'compliance' as Page, 
      label: 'Validador de Conformidade', 
      icon: Shield,
      description: 'Sistema de validação de conformidade de aeronaves'
    },
    { 
      id: 'showcase' as Page, 
      label: 'Showcase de IA', 
      icon: Sparkles,
      description: 'Galeria de componentes gerados por IA'
    }
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'compliance':
        return <AircraftComplianceValidator />;
      case 'showcase':
        return <AIUIShowcase />;
      default:
        return <AircraftComplianceValidator />;
    }
  };

  if (currentPage !== 'compliance') {
    return renderPage();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header de Navegação */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
                <Plane className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sistema de Aviação</h1>
                <p className="text-sm text-gray-600">Plataforma Integrada de Gestão Aeronáutica</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(item.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Principal */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Seção de Boas-vindas */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bem-vindo ao Sistema de Aviação
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Explore nossa plataforma integrada com validação de conformidade de aeronaves e 
              componentes de interface gerados por inteligência artificial.
            </p>
          </div>

          {/* Cards de Navegação Rápida */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={item.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-blue-50 border-blue-200"
                  onClick={() => setCurrentPage(item.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {item.label}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {item.id === 'compliance' ? 'Operacional' : 'Demonstração'}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Acessar →
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Componentes IA</p>
                    <p className="text-2xl font-bold">10+</p>
                  </div>
                  <Sparkles className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-green-400">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold">100%</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-purple-400">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Aeronaves</p>
                    <p className="text-2xl font-bold">50+</p>
                  </div>
                  <Plane className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-400">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Conformidade</p>
                    <p className="text-2xl font-bold">98%</p>
                  </div>
                  <Shield className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seção do Validador de Conformidade */}
          <div className="mt-8">
            <AircraftComplianceValidator />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;