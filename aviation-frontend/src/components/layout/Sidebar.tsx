import { 
  Home, 
  Plane, 
  Navigation, 
  Wrench, 
  BarChart3, 
  Settings, 
  Radio,
  MapPin,
  Shield,
  Users,
  Calendar,
  AlertTriangle,
  Palette,
  TestTube,
  Sparkles,
  Brain,
  Zap
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-blue-400' },
  { id: 'aircraft', label: 'Aeronaves', icon: Plane, color: 'text-green-400' },
  { id: 'flights', label: 'Controle de Voos', icon: Navigation, color: 'text-purple-400' },
  { id: 'maintenance', label: 'Manutenção', icon: Wrench, color: 'text-orange-400' },
  { id: 'communications', label: 'Comunicações', icon: Radio, color: 'text-cyan-400' },
  { id: 'weather', label: 'Meteorologia', icon: MapPin, color: 'text-yellow-400' },
  { id: 'crew', label: 'Tripulação', icon: Users, color: 'text-pink-400' },
  { id: 'schedule', label: 'Agenda', icon: Calendar, color: 'text-indigo-400' },
  { id: 'safety', label: 'Segurança', icon: Shield, color: 'text-red-400' },
  { id: 'alerts', label: 'Alertas', icon: AlertTriangle, color: 'text-red-500' },
  { id: 'analytics', label: 'Relatórios', icon: BarChart3, color: 'text-emerald-400' },
  { id: 'demo', label: 'Demo Componentes', icon: Palette, color: 'text-violet-400' },
  { id: 'flight-status-demo', label: 'Flight Status Demo', icon: Navigation, color: 'text-sky-400' },
  { id: 'aircraft-selector-demo', label: 'Aircraft Selector Demo', icon: Plane, color: 'text-emerald-400' },
  { id: 'alert-panel-demo', label: 'Alert Panel Demo', icon: AlertTriangle, color: 'text-red-400' },
  { id: 'all-aviation-demo', label: 'All Aviation Components', icon: Palette, color: 'text-purple-400' },
  { id: 'ai-prompt-interface', label: 'AI UI Generator', icon: Sparkles, color: 'text-blue-500' },
  { id: 'ai-ui-showcase', label: 'AI UI Showcase', icon: Brain, color: 'text-purple-500' },
  { id: 'aviation-scenarios-test', label: 'Aviation AI Tests', icon: Zap, color: 'text-yellow-500' },
  { id: 'components-test', label: 'shadcn/ui Test', icon: TestTube, color: 'text-lime-400' },
  { id: 'shadcn-showcase', label: 'shadcn/ui Showcase', icon: Palette, color: 'text-rose-400' },
  { id: 'settings', label: 'Configurações', icon: Settings, color: 'text-slate-400' },
];

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 h-screen flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-mono">AERO CONTROL</h1>
            <p className="text-xs text-slate-400 font-mono">Sistema Integrado</p>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="px-6 py-3 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-mono">SISTEMA ONLINE</span>
          </div>
          <div className="text-xs text-slate-500 font-mono">v2.1.0</div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`
                w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg font-mono text-sm
                transition-all duration-200 group relative overflow-hidden
                ${isActive 
                  ? 'bg-slate-800 text-white border border-slate-600' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 w-1 h-full bg-blue-500"></div>
              )}
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              
              <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-blue-400' : item.color}`} />
              <span className="relative z-10">{item.label}</span>
              
              {/* Notification badges for specific items */}
              {item.id === 'alerts' && (
                <div className="w-2 h-2 bg-red-500 rounded-full ml-auto animate-pulse"></div>
              )}
              {item.id === 'maintenance' && (
                <div className="w-5 h-5 bg-orange-500 rounded-full ml-auto flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-center">
          <div className="text-xs text-slate-500 font-mono">
            Última atualização
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {new Date().toLocaleTimeString('pt-BR')}
          </div>
        </div>
      </div>
    </div>
  );
}