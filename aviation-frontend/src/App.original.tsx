import { useState } from 'react';
import VariantSelector from './components/VariantSelector';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './pages/Dashboard';
import AircraftPage from './pages/AircraftPage';
import AviationDemo from './pages/AviationDemo';
import ComponentsTest from './pages/ComponentsTest';
import { FlightStatusDemo } from './pages/FlightStatusDemo';
import { AircraftSelectorDemo } from './pages/AircraftSelectorDemo';
import { AlertPanelDemo } from './pages/AlertPanelDemo';
import { AllAviationComponentsDemo } from './pages/AllAviationComponentsDemo';
import AIPromptInterface from './components/ai/AIPromptInterface';
import AIUIShowcase from './components/ai/AIUIShowcase';
import AviationScenariosTest from './components/ai/AviationScenariosTest';
import ShadcnShowcase from './pages/ShadcnShowcase';

function App() {
  const [selectedVariant, setSelectedVariant] = useState<'military' | 'modern' | 'futuristic' | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Se não tiver variante selecionada, mostra o seletor
  if (!selectedVariant) {
    return <VariantSelector onVariantSelect={setSelectedVariant} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'aircraft':
        return <AircraftPage />;
      case 'flights':
        return (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
            <h2 className="text-2xl font-bold text-white font-mono mb-4">CONTROLE DE VOOS</h2>
            <p className="text-slate-400 font-mono">Sistema de controle de tráfego aéreo em desenvolvimento.</p>
            <p className="text-slate-500 font-mono text-sm mt-4">Variante: {selectedVariant.toUpperCase()}</p>
          </div>
        );
      case 'maintenance':
        return (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
            <h2 className="text-2xl font-bold text-white font-mono mb-4">CENTRO DE MANUTENÇÃO</h2>
            <p className="text-slate-400 font-mono">Sistema de gestão de manutenção em desenvolvimento.</p>
            <p className="text-slate-500 font-mono text-sm mt-4">Variante: {selectedVariant.toUpperCase()}</p>
          </div>
        );
      case 'communications':
        return (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
            <h2 className="text-2xl font-bold text-white font-mono mb-4">CENTRO DE COMUNICAÇÕES</h2>
            <p className="text-slate-400 font-mono">Sistema de comunicações aeronáuticas em desenvolvimento.</p>
            <p className="text-slate-500 font-mono text-sm mt-4">Variante: {selectedVariant.toUpperCase()}</p>
          </div>
        );
      case 'weather':
        return (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
            <h2 className="text-2xl font-bold text-white font-mono mb-4">METEOROLOGIA</h2>
            <p className="text-slate-400 font-mono">Sistema meteorológico integrado em desenvolvimento.</p>
            <p className="text-slate-500 font-mono text-sm mt-4">Variante: {selectedVariant.toUpperCase()}</p>
          </div>
        );
      case 'crew':
        return (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
            <h2 className="text-2xl font-bold text-white font-mono mb-4">GESTÃO DE TRIPULAÇÃO</h2>
            <p className="text-slate-400 font-mono">Sistema de gestão de recursos humanos em desenvolvimento.</p>
            <p className="text-slate-500 font-mono text-sm mt-4">Variante: {selectedVariant.toUpperCase()}</p>
          </div>
        );
      case 'schedule':
        return (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
            <h2 className="text-2xl font-bold text-white font-mono mb-4">AGENDA OPERACIONAL</h2>
            <p className="text-slate-400 font-mono">Sistema de agendamento operacional em desenvolvimento.</p>
            <p className="text-slate-500 font-mono text-sm mt-4">Variante: {selectedVariant.toUpperCase()}</p>
          </div>
        );
      case 'safety':
        return (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
            <h2 className="text-2xl font-bold text-white font-mono mb-4">CENTRO DE SEGURANÇA</h2>
            <p className="text-slate-400 font-mono">Sistema de gestão de segurança em desenvolvimento.</p>
            <p className="text-slate-500 font-mono text-sm mt-4">Variante: {selectedVariant.toUpperCase()}</p>
          </div>
        );
      case 'alerts':
        return (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
            <h2 className="text-2xl font-bold text-white font-mono mb-4">CENTRAL DE ALERTAS</h2>
            <p className="text-slate-400 font-mono">Sistema de alertas e notificações em desenvolvimento.</p>
            <p className="text-slate-500 font-mono text-sm mt-4">Variante: {selectedVariant.toUpperCase()}</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
            <h2 className="text-2xl font-bold text-white font-mono mb-4">RELATÓRIOS E ANALYTICS</h2>
            <p className="text-slate-400 font-mono">Sistema de business intelligence em desenvolvimento.</p>
            <p className="text-slate-500 font-mono text-sm mt-4">Variante: {selectedVariant.toUpperCase()}</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
            <h2 className="text-2xl font-bold text-white font-mono mb-4">CONFIGURAÇÕES DO SISTEMA</h2>
            <p className="text-slate-400 font-mono">Painel de configurações em desenvolvimento.</p>
            <div className="mt-6">
              <button
                onClick={() => setSelectedVariant(null)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-mono px-6 py-2 rounded-lg transition-colors"
              >
                TROCAR VARIANTE DE DESIGN
              </button>
            </div>
            <p className="text-slate-500 font-mono text-sm mt-4">Variante Atual: {selectedVariant.toUpperCase()}</p>
          </div>
        );
      case 'demo':
        return <AviationDemo />;
      case 'components-test':
        return <ComponentsTest />;
      case 'flight-status-demo':
        return <FlightStatusDemo />;
      case 'aircraft-selector-demo':
        return <AircraftSelectorDemo />;
      case 'alert-panel-demo':
        return <AlertPanelDemo />;
      case 'all-aviation-demo':
        return <AllAviationComponentsDemo />;
      case 'ai-prompt-interface':
        return (
          <div className="container mx-auto py-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white font-mono mb-2">AI UI GENERATION</h1>
              <p className="text-slate-400 font-mono">Generate aviation UI components using natural language prompts</p>
            </div>
            <AIPromptInterface />
          </div>
        );
      case 'ai-ui-showcase':
        return <AIUIShowcase />;
      case 'aviation-scenarios-test':
        return (
          <div className="container mx-auto py-6">
            <AviationScenariosTest />
          </div>
        );
      case 'shadcn-showcase':
        return <ShadcnShowcase />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen flex ${
      selectedVariant === 'military' ? 'bg-slate-900' :
      selectedVariant === 'modern' ? 'bg-gray-50' :
      'bg-slate-900'
    }`}>
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="flex-1 flex flex-col">
        <TopBar currentPage={currentPage} />
        
        <main className="flex-1 p-6 overflow-auto">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
