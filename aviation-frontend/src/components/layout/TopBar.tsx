import { Bell, User, Search, Wifi, Battery, Signal } from 'lucide-react';

interface TopBarProps {
  currentPage: string;
}

const pageNames: { [key: string]: string } = {
  dashboard: 'Dashboard Principal',
  aircraft: 'Gestão de Aeronaves',
  flights: 'Controle de Voos',
  maintenance: 'Centro de Manutenção',
  communications: 'Centro de Comunicações',
  weather: 'Meteorologia',
  crew: 'Gestão de Tripulação',
  schedule: 'Agenda Operacional',
  safety: 'Centro de Segurança',
  alerts: 'Central de Alertas',
  analytics: 'Relatórios e Analytics',
  demo: 'Demo de Componentes',
  settings: 'Configurações do Sistema',
};

export default function TopBar({ currentPage }: TopBarProps) {
  return (
    <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6">
      {/* Left side - Page title and breadcrumb */}
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-lg font-semibold text-white font-mono">
            {pageNames[currentPage] || 'Sistema de Aviação'}
          </h2>
          <div className="text-xs text-slate-400 font-mono">
            AERO CONTROL / {pageNames[currentPage]?.toUpperCase() || currentPage.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar aeronaves, voos, tripulação..."
            className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
          />
        </div>
      </div>

      {/* Right side - Status indicators and user */}
      <div className="flex items-center space-x-4">
        {/* System status indicators */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-green-400">
            <Wifi className="w-4 h-4" />
            <span className="text-xs font-mono">5G</span>
          </div>
          <div className="flex items-center space-x-1 text-blue-400">
            <Signal className="w-4 h-4" />
            <span className="text-xs font-mono">GPS</span>
          </div>
          <div className="flex items-center space-x-1 text-orange-400">
            <Battery className="w-4 h-4" />
            <span className="text-xs font-mono">89%</span>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">3</span>
            </div>
          </button>
        </div>

        {/* User profile */}
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-600">
          <div className="text-right">
            <div className="text-sm font-medium text-white font-mono">Comandante Silva</div>
            <div className="text-xs text-slate-400 font-mono">Controlador Senior</div>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Emergency indicator */}
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}