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
    <div className="min-h-screen" style={{ background: 'var(--aviation-neutral-50)' }}>
      {/* Header de Navegação - Aviation Premium */}
      <header className="dashboard-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg text-white" style={{ background: 'var(--gradient-aviation-primary)' }}>
                <Plane className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ 
                  fontFamily: 'var(--font-aviation-sans)', 
                  color: 'var(--aviation-neutral-900)' 
                }}>Sistema de Aviação</h1>
                <p className="text-sm" style={{ 
                  fontFamily: 'var(--font-aviation-sans)', 
                  color: 'var(--aviation-neutral-600)' 
                }}>Plataforma Integrada de Gestão Aeronáutica</p>
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
            <h2 className="font-bold" style={{ 
              fontSize: 'var(--text-aviation-3xl)',
              fontFamily: 'var(--font-aviation-sans)',
              background: 'var(--gradient-aviation-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Bem-vindo ao Sistema de Aviação
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ 
              fontFamily: 'var(--font-aviation-sans)',
              fontSize: 'var(--text-aviation-lg)',
              color: 'var(--aviation-neutral-600)'
            }}>
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
                  className="card-aviation cursor-pointer"
                  style={{ 
                    border: '1px solid var(--aviation-neutral-200)',
                    background: 'white'
                  }}
                  onClick={() => setCurrentPage(item.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg text-white" style={{ 
                        background: 'var(--gradient-aviation-primary)',
                        borderRadius: 'var(--radius-aviation-lg)'
                      }}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2" style={{ 
                          fontFamily: 'var(--font-aviation-sans)',
                          color: 'var(--aviation-neutral-900)'
                        }}>
                          {item.label}
                        </h3>
                        <p className="mb-4" style={{ 
                          fontFamily: 'var(--font-aviation-sans)',
                          color: 'var(--aviation-neutral-600)'
                        }}>
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" style={{ 
                            background: 'var(--aviation-primary-50)',
                            color: 'var(--aviation-primary-800)',
                            fontFamily: 'var(--font-aviation-sans)'
                          }}>
                            {item.id === 'compliance' ? 'Operacional' : 'Demonstração'}
                          </Badge>
                          <Button variant="outline" size="sm" style={{ 
                            borderColor: 'var(--aviation-primary-500)',
                            color: 'var(--aviation-primary-600)',
                            fontFamily: 'var(--font-aviation-sans)'
                          }}>
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
            <Card className="metric-card-aviation text-white" style={{ 
              background: 'var(--gradient-aviation-primary)',
              borderColor: 'var(--aviation-primary-400)'
            }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ 
                      color: 'var(--aviation-primary-50)',
                      fontFamily: 'var(--font-aviation-sans)'
                    }}>Componentes IA</p>
                    <p className="text-2xl font-bold" style={{ 
                      fontFamily: 'var(--font-aviation-sans)'
                    }}>10+</p>
                  </div>
                  <Sparkles className="w-8 h-8" style={{ 
                    color: 'var(--aviation-primary-100)'
                  }} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="metric-card-aviation text-white" style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderColor: '#34d399'
            }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ 
                      color: '#d1fae5',
                      fontFamily: 'var(--font-aviation-sans)'
                    }}>Taxa de Sucesso</p>
                    <p className="text-2xl font-bold" style={{ 
                      fontFamily: 'var(--font-aviation-sans)'
                    }}>100%</p>
                  </div>
                  <BarChart3 className="w-8 h-8" style={{ 
                    color: '#a7f3d0'
                  }} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="metric-card-aviation text-white" style={{ 
              background: 'var(--gradient-aviation-accent)',
              borderColor: 'var(--aviation-accent-400)'
            }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ 
                      color: 'var(--aviation-accent-50)',
                      fontFamily: 'var(--font-aviation-sans)'
                    }}>Aeronaves</p>
                    <p className="text-2xl font-bold" style={{ 
                      fontFamily: 'var(--font-aviation-sans)'
                    }}>50+</p>
                  </div>
                  <Plane className="w-8 h-8" style={{ 
                    color: 'var(--aviation-accent-100)'
                  }} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="metric-card-aviation text-white" style={{ 
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              borderColor: '#fb923c'
            }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ 
                      color: '#fed7aa',
                      fontFamily: 'var(--font-aviation-sans)'
                    }}>Conformidade</p>
                    <p className="text-2xl font-bold" style={{ 
                      fontFamily: 'var(--font-aviation-sans)'
                    }}>98%</p>
                  </div>
                  <Shield className="w-8 h-8" style={{ 
                    color: '#fdba74'
                  }} />
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