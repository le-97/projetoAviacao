import { 
  Activity, 
  Plane, 
  AlertTriangle, 
  Users, 
  MapPin, 
  TrendingUp,
  Gauge
} from 'lucide-react';
import { AviationButton } from '../components/ui/AviationButton';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-mono">AERONAVES ATIVAS</p>
              <p className="text-3xl font-bold text-white font-mono">12</p>
              <p className="text-green-400 text-xs font-mono flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2 hoje
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Plane className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-mono">VOOS ATIVOS</p>
              <p className="text-3xl font-bold text-white font-mono">8</p>
              <p className="text-blue-400 text-xs font-mono flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                Em tempo real
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-mono">TRIPULAÇÃO</p>
              <p className="text-3xl font-bold text-white font-mono">24</p>
              <p className="text-purple-400 text-xs font-mono flex items-center">
                <Users className="w-3 h-3 mr-1" />
                18 disponíveis
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-mono">ALERTAS</p>
              <p className="text-3xl font-bold text-white font-mono">3</p>
              <p className="text-orange-400 text-xs font-mono flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Requer atenção
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flight Operations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Flights */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white font-mono">VOOS ATIVOS</h3>
              <AviationButton variant="secondary" size="sm">
                Ver Todos
              </AviationButton>
            </div>
            
            <div className="space-y-4">
              {[
                { flight: 'AER-001', from: 'GRU', to: 'SDU', status: 'Em Voo', eta: '14:30', aircraft: 'Boeing 737' },
                { flight: 'AER-002', from: 'CGH', to: 'BSB', status: 'Decolando', eta: '15:45', aircraft: 'Embraer E190' },
                { flight: 'AER-003', from: 'REC', to: 'FOR', status: 'Aterrissando', eta: '16:15', aircraft: 'ATR 72' },
                { flight: 'AER-004', from: 'MAO', to: 'GIG', status: 'Preparação', eta: '17:20', aircraft: 'Airbus A320' },
              ].map((flight, index) => (
                <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Plane className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-mono font-semibold text-white">{flight.flight}</div>
                        <div className="text-sm text-slate-400 font-mono">{flight.aircraft}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-lg font-mono text-white">{flight.from}</div>
                        <div className="text-xs text-slate-400">ORIGEM</div>
                      </div>
                      <div className="w-8 border-t border-slate-600 relative">
                        <Plane className="w-4 h-4 text-blue-400 absolute top-[-8px] left-1/2 transform -translate-x-1/2" />
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-mono text-white">{flight.to}</div>
                        <div className="text-xs text-slate-400">DESTINO</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-sm font-mono px-2 py-1 rounded ${
                        flight.status === 'Em Voo' ? 'bg-green-500/20 text-green-400' :
                        flight.status === 'Decolando' ? 'bg-blue-500/20 text-blue-400' :
                        flight.status === 'Aterrissando' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {flight.status}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 font-mono">ETA {flight.eta}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Conditions */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white font-mono mb-6">CONDIÇÕES METEOROLÓGICAS</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { airport: 'GRU', temp: '23°C', condition: 'Ensolarado', wind: '15 kt', visibility: '10+ km' },
                { airport: 'SDU', temp: '26°C', condition: 'Parcialmente Nublado', wind: '8 kt', visibility: '8 km' },
                { airport: 'BSB', temp: '28°C', condition: 'Céu Limpo', wind: '12 kt', visibility: '10+ km' },
              ].map((weather, index) => (
                <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-mono font-semibold text-white">{weather.airport}</h4>
                    <MapPin className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-mono font-bold text-white">{weather.temp}</div>
                    <div className="text-sm text-slate-400 font-mono">{weather.condition}</div>
                    <div className="text-xs text-slate-500 font-mono">Vento: {weather.wind}</div>
                    <div className="text-xs text-slate-500 font-mono">Visib: {weather.visibility}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* System Status */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white font-mono mb-6">STATUS DO SISTEMA</h3>
            
            <div className="space-y-4">
              {[
                { system: 'Radar Principal', status: 'Operacional', color: 'green' },
                { system: 'Comunicações', status: 'Operacional', color: 'green' },
                { system: 'GPS/GNSS', status: 'Operacional', color: 'green' },
                { system: 'Sistema de Backup', status: 'Standby', color: 'yellow' },
                { system: 'Torre de Controle', status: 'Manutenção', color: 'orange' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.color === 'green' ? 'bg-green-400' :
                      item.color === 'yellow' ? 'bg-yellow-400' :
                      'bg-orange-400'
                    } ${item.color === 'green' ? 'animate-pulse' : ''}`}></div>
                    <span className="text-sm text-slate-300 font-mono">{item.system}</span>
                  </div>
                  <span className={`text-xs font-mono px-2 py-1 rounded ${
                    item.color === 'green' ? 'bg-green-500/20 text-green-400' :
                    item.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white font-mono mb-6">AÇÕES RÁPIDAS</h3>
            
            <div className="space-y-3">
              <AviationButton 
                variant="primary" 
                size="md" 
                icon={<Plane className="w-4 h-4" />}
                iconPosition="left"
                className="w-full"
              >
                NOVO VOO
              </AviationButton>
              
              <AviationButton 
                variant="secondary" 
                size="md" 
                icon={<Users className="w-4 h-4" />}
                iconPosition="left"
                className="w-full"
              >
                GERENCIAR TRIPULAÇÃO
              </AviationButton>
              
              <AviationButton 
                variant="secondary" 
                size="md" 
                icon={<Gauge className="w-4 h-4" />}
                iconPosition="left"
                className="w-full"
              >
                MANUTENÇÃO
              </AviationButton>
              
              <AviationButton 
                variant="danger" 
                size="md" 
                icon={<AlertTriangle className="w-4 h-4" />}
                iconPosition="left"
                className="w-full"
              >
                EMERGÊNCIA
              </AviationButton>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold text-white font-mono mb-6">MÉTRICAS</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-mono">Eficiência Operacional</span>
                <span className="text-lg font-mono font-bold text-green-400">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-mono">Pontualidade</span>
                <span className="text-lg font-mono font-bold text-blue-400">89%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-mono">Consumo Combustível</span>
                <span className="text-lg font-mono font-bold text-orange-400">-8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400 font-mono">Satisfação</span>
                <span className="text-lg font-mono font-bold text-purple-400">4.8★</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}