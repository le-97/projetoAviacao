import { useState } from 'react';
import { 
  Plane, 
  Settings, 
  Clock, 
  Fuel,
  MapPin,
  Calendar,
  Wrench,
  BarChart3,
  Filter
} from 'lucide-react';
import { AviationButton } from '../components/ui/AviationButton';

export default function AircraftPage() {
  const [selectedAircraft, setSelectedAircraft] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const aircraftData = [
    {
      id: 'AER-001',
      model: 'Boeing 737-800',
      registration: 'PR-AER',
      status: 'operational',
      location: 'Hangar 1 - GRU',
      nextFlight: '14:30 - SDU',
      fuel: 85,
      maintenance: 'OK',
      crew: 'Capitão Silva, Co-piloto Santos',
      lastInspection: '15/09/2025',
      flightHours: 12450,
      nextMaintenance: '25/09/2025',
      capacity: 189,
      year: 2018
    },
    {
      id: 'AER-002',
      model: 'Embraer E190',
      registration: 'PR-EMB',
      status: 'maintenance',
      location: 'Oficina A - CGH',
      nextFlight: 'Manutenção Programada',
      fuel: 0,
      maintenance: 'Em andamento',
      crew: 'Não atribuída',
      lastInspection: '10/09/2025',
      flightHours: 8920,
      nextMaintenance: '20/09/2025',
      capacity: 114,
      year: 2020
    },
    {
      id: 'AER-003',
      model: 'ATR 72-600',
      registration: 'PR-ATR',
      status: 'operational',
      location: 'Terminal 2 - REC',
      nextFlight: '16:15 - FOR',
      fuel: 72,
      maintenance: 'OK',
      crew: 'Capitão Oliveira, Co-piloto Lima',
      lastInspection: '18/09/2025',
      flightHours: 6780,
      nextMaintenance: '30/09/2025',
      capacity: 78,
      year: 2019
    },
    {
      id: 'AER-004',
      model: 'Airbus A320',
      registration: 'PR-AIR',
      status: 'in-flight',
      location: 'Em voo - MAO → GIG',
      nextFlight: 'Pousando às 17:20',
      fuel: 45,
      maintenance: 'OK',
      crew: 'Capitão Costa, Co-piloto Ferreira',
      lastInspection: '12/09/2025',
      flightHours: 15230,
      nextMaintenance: '28/09/2025',
      capacity: 180,
      year: 2017
    },
    {
      id: 'AER-005',
      model: 'Boeing 787-9',
      registration: 'PR-DRM',
      status: 'standby',
      location: 'Gate 15 - GIG',
      nextFlight: 'Aguardando programação',
      fuel: 95,
      maintenance: 'OK',
      crew: 'Disponível',
      lastInspection: '19/09/2025',
      flightHours: 9850,
      nextMaintenance: '05/10/2025',
      capacity: 296,
      year: 2021
    },
    {
      id: 'AER-006',
      model: 'Embraer E175',
      registration: 'PR-E17',
      status: 'inspection',
      location: 'Hangar 3 - BSB',
      nextFlight: 'Inspeção 100h',
      fuel: 15,
      maintenance: 'Inspeção',
      crew: 'Não atribuída',
      lastInspection: '05/09/2025',
      flightHours: 11200,
      nextMaintenance: '22/09/2025',
      capacity: 88,
      year: 2019
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Operacional' };
      case 'maintenance': return { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'Manutenção' };
      case 'in-flight': return { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Em Voo' };
      case 'standby': return { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Standby' };
      case 'inspection': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Inspeção' };
      default: return { bg: 'bg-slate-500/20', text: 'text-slate-400', label: 'Desconhecido' };
    }
  };

  const filteredAircraft = aircraftData.filter(aircraft => 
    filterStatus === 'all' || aircraft.status === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* Header with filters and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white font-mono">GESTÃO DE AERONAVES</h1>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas</option>
              <option value="operational">Operacional</option>
              <option value="maintenance">Manutenção</option>
              <option value="in-flight">Em Voo</option>
              <option value="standby">Standby</option>
              <option value="inspection">Inspeção</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <AviationButton variant="secondary" size="sm" icon={<BarChart3 className="w-4 h-4" />}>
            Relatórios
          </AviationButton>
          <AviationButton variant="primary" size="sm" icon={<Plane className="w-4 h-4" />}>
            Nova Aeronave
          </AviationButton>
        </div>
      </div>

      {/* Aircraft Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAircraft.map((aircraft) => {
          const statusInfo = getStatusColor(aircraft.status);
          return (
            <div
              key={aircraft.id}
              className={`bg-slate-800 rounded-xl p-6 border cursor-pointer transition-all duration-200 hover:border-blue-500 ${
                selectedAircraft === aircraft.id ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-700'
              }`}
              onClick={() => setSelectedAircraft(selectedAircraft === aircraft.id ? null : aircraft.id)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Plane className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-white">{aircraft.id}</h3>
                    <p className="text-sm text-slate-400 font-mono">{aircraft.registration}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-mono ${statusInfo.bg} ${statusInfo.text}`}>
                  {statusInfo.label}
                </div>
              </div>

              {/* Aircraft Info */}
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-lg font-semibold text-white font-mono">{aircraft.model}</p>
                  <p className="text-sm text-slate-400 font-mono">{aircraft.year} • {aircraft.capacity} assentos</p>
                </div>
                
                <div className="flex items-center space-x-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-mono">{aircraft.location}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-slate-300">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-mono">{aircraft.nextFlight}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Fuel className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-slate-400 font-mono">COMBUSTÍVEL</span>
                  </div>
                  <div className="text-xl font-bold text-white font-mono">{aircraft.fuel}%</div>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${aircraft.fuel > 50 ? 'bg-green-400' : aircraft.fuel > 25 ? 'bg-orange-400' : 'bg-red-400'}`}
                      style={{ width: `${aircraft.fuel}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wrench className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-slate-400 font-mono">MANUTENÇÃO</span>
                  </div>
                  <div className={`text-sm font-mono ${
                    aircraft.maintenance === 'OK' ? 'text-green-400' : 
                    aircraft.maintenance === 'Em andamento' ? 'text-orange-400' : 'text-yellow-400'
                  }`}>
                    {aircraft.maintenance}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-1">
                    Próx: {aircraft.nextMaintenance}
                  </div>
                </div>
              </div>

              {/* Expandable Details */}
              {selectedAircraft === aircraft.id && (
                <div className="border-t border-slate-700 pt-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400 font-mono">TRIPULAÇÃO</p>
                      <p className="text-white font-mono">{aircraft.crew}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-mono">HORAS DE VOO</p>
                      <p className="text-white font-mono">{aircraft.flightHours.toLocaleString()}h</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-mono">ÚLTIMA INSPEÇÃO</p>
                      <p className="text-white font-mono">{aircraft.lastInspection}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-mono">PRÓXIMA MANUTENÇÃO</p>
                      <p className="text-white font-mono">{aircraft.nextMaintenance}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-3">
                    <AviationButton variant="primary" size="sm" icon={<Settings className="w-3 h-3" />}>
                      Configurar
                    </AviationButton>
                    <AviationButton variant="secondary" size="sm" icon={<Calendar className="w-3 h-3" />}>
                      Agendar
                    </AviationButton>
                    <AviationButton variant="secondary" size="sm" icon={<BarChart3 className="w-3 h-3" />}>
                      Histórico
                    </AviationButton>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white font-mono mb-6">RESUMO DA FROTA</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white font-mono">6</div>
            <div className="text-sm text-slate-400 font-mono">Total de Aeronaves</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 font-mono">3</div>
            <div className="text-sm text-slate-400 font-mono">Operacionais</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 font-mono">1</div>
            <div className="text-sm text-slate-400 font-mono">Em Voo</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400 font-mono">1</div>
            <div className="text-sm text-slate-400 font-mono">Manutenção</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 font-mono">1</div>
            <div className="text-sm text-slate-400 font-mono">Standby</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white font-mono">965</div>
            <div className="text-sm text-slate-400 font-mono">Capacidade Total</div>
          </div>
        </div>
      </div>
    </div>
  );
}