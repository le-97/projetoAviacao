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

export default function EmbraerDashboard() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0E1C59] to-[#003DA5] rounded-xl p-8 border border-blue-700">
                <h1 className="text-3xl font-bold text-white font-mono mb-2">EMBRAER DASHBOARD</h1>
                <p className="text-blue-200 font-mono">Monitoramento de Aeronaves Embraer em Tempo Real</p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-mono">EMBRAER ATIVOS</p>
                            <p className="text-3xl font-bold text-white font-mono">15</p>
                            <p className="text-green-400 text-xs font-mono flex items-center">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                100% disponíveis
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
                            <p className="text-slate-400 text-sm font-mono">E-JETS E2</p>
                            <p className="text-3xl font-bold text-white font-mono">6</p>
                            <p className="text-blue-400 text-xs font-mono flex items-center">
                                <Activity className="w-3 h-3 mr-1" />
                                Nova geração
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
                            <p className="text-slate-400 text-sm font-mono">EXECUTIVOS</p>
                            <p className="text-3xl font-bold text-white font-mono">4</p>
                            <p className="text-purple-400 text-xs font-mono flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                Phenom & Praetor
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
                            <p className="text-slate-400 text-sm font-mono">DEFESA</p>
                            <p className="text-3xl font-bold text-white font-mono">4</p>
                            <p className="text-orange-400 text-xs font-mono flex items-center">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                KC-390 & A-29
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
                {/* Embraer Aircraft Fleet */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Commercial Aircraft */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-white font-mono">COMERCIAIS E-JETS</h3>
                            <AviationButton variant="secondary" size="sm">
                                Ver Catálogo
                            </AviationButton>
                        </div>

                        <div className="space-y-4">
                            {[
                                { model: 'E175-E2', capacity: '88 pax', range: '4,815 km', status: 'Operacional', color: 'green' },
                                { model: 'E190-E2', capacity: '114 pax', range: '5,278 km', status: 'Operacional', color: 'green' },
                                { model: 'E195-E2', capacity: '146 pax', range: '4,815 km', status: 'Operacional', color: 'green' },
                                { model: 'E175', capacity: '88 pax', range: '3,889 km', status: 'Manutenção', color: 'yellow' },
                            ].map((aircraft, index) => (
                                <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${aircraft.color === 'green' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                                                }`}>
                                                <Plane className={`w-5 h-5 ${aircraft.color === 'green' ? 'text-green-400' : 'text-yellow-400'
                                                    }`} />
                                            </div>
                                            <div>
                                                <div className="font-mono font-semibold text-white">{aircraft.model}</div>
                                                <div className="text-sm text-slate-400 font-mono">{aircraft.capacity} • {aircraft.range}</div>
                                            </div>
                                        </div>

                                        <div className={`text-sm font-mono px-3 py-1 rounded ${aircraft.color === 'green' ? 'bg-green-500/20 text-green-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {aircraft.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Executive Jets */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-white font-mono mb-6">JATOS EXECUTIVOS</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { model: 'Phenom 100EV', type: 'Light Jet', range: '2,182 km', speed: '839 km/h' },
                                { model: 'Phenom 300E', type: 'Light Jet', range: '3,650 km', speed: '839 km/h' },
                                { model: 'Praetor 500', type: 'Midsize', range: '6,019 km', speed: '863 km/h' },
                                { model: 'Praetor 600', type: 'Super Midsize', range: '7,408 km', speed: '863 km/h' },
                            ].map((jet, index) => (
                                <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-mono font-semibold text-white">{jet.model}</h4>
                                        <MapPin className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm text-slate-400 font-mono">{jet.type}</div>
                                        <div className="text-xs text-slate-500 font-mono">Alcance: {jet.range}</div>
                                        <div className="text-xs text-slate-500 font-mono">Velocidade: {jet.speed}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                    {/* Defense Aircraft */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-white font-mono mb-6">DEFESA & SEGURANÇA</h3>

                        <div className="space-y-4">
                            {[
                                { aircraft: 'KC-390', type: 'Transporte Militar', status: 'Operacional', color: 'green' },
                                { aircraft: 'A-29 Super Tucano', type: 'Ataque Leve', status: 'Operacional', color: 'green' },
                                { aircraft: 'C-390 Millennium', type: 'Transporte Tático', status: 'Operacional', color: 'green' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-3 h-3 rounded-full bg-green-400 animate-pulse`}></div>
                                        <div>
                                            <div className="text-sm text-slate-300 font-mono font-semibold">{item.aircraft}</div>
                                            <div className="text-xs text-slate-500 font-mono">{item.type}</div>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-mono px-2 py-1 rounded bg-green-500/20 text-green-400`}>
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
                                CATÁLOGO EMBRAER
                            </AviationButton>

                            <AviationButton
                                variant="secondary"
                                size="md"
                                icon={<Users className="w-4 h-4" />}
                                iconPosition="left"
                                className="w-full"
                            >
                                VERIFICAR CONFORMIDADE
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
                                SUPORTE TÉCNICO
                            </AviationButton>
                        </div>
                    </div>

                    {/* Embraer Fleet Metrics */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-white font-mono mb-6">MÉTRICAS DA FROTA</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400 font-mono">Disponibilidade</span>
                                <span className="text-lg font-mono font-bold text-green-400">100%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400 font-mono">Horas de Voo</span>
                                <span className="text-lg font-mono font-bold text-blue-400">12,450h</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400 font-mono">Eficiência</span>
                                <span className="text-lg font-mono font-bold text-orange-400">96%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400 font-mono">Satisfação</span>
                                <span className="text-lg font-mono font-bold text-purple-400">4.9★</span>
                            </div>
                        </div>
                    </div>

                    {/* Agriculture Aircraft */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <h3 className="text-xl font-semibold text-white font-mono mb-4">AGRÍCOLA</h3>

                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-mono font-semibold text-white">Ipanema</h4>
                                <Plane className="w-4 h-4 text-green-400" />
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm text-slate-400 font-mono">Aplicação Agrícola</div>
                                <div className="text-xs text-slate-500 font-mono">Motor: Lycoming IO-540</div>
                                <div className="text-xs text-slate-500 font-mono">Capacidade: 950 L</div>
                                <div className="mt-3">
                                    <span className="text-xs font-mono px-2 py-1 rounded bg-green-500/20 text-green-400">
                                        Operacional
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
