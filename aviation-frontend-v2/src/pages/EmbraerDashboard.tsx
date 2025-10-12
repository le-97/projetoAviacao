import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Plane,
    Activity,
    Users,
    Shield,
    FileCheck
} from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { AircraftCard } from '../components/AircraftCard';
import { HeroCarousel } from '../components/HeroCarousel';
import { embraerAircraft } from '../data/aircraftData';
import type { Aircraft } from '../types/aircraft';

export function EmbraerDashboard() {
    // Calculate statistics
    const stats = {
        total: embraerAircraft.length,
        commercial: embraerAircraft.filter((a: Aircraft) => a.category === 'commercial').length,
        executive: embraerAircraft.filter((a: Aircraft) => a.category === 'executive').length,
        defense: embraerAircraft.filter((a: Aircraft) => a.category === 'defense').length,
        agriculture: embraerAircraft.filter((a: Aircraft) => a.category === 'agriculture').length,
    };

    const commercialAircraft = embraerAircraft.filter((a: Aircraft) => a.category === 'commercial');
    const executiveAircraft = embraerAircraft.filter((a: Aircraft) => a.category === 'executive');
    const defenseAircraft = embraerAircraft.filter((a: Aircraft) => a.category === 'defense');
    const agricultureAircraft = embraerAircraft.filter((a: Aircraft) => a.category === 'agriculture'); return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Carousel */}
            <HeroCarousel />

            {/* Content Section */}
            <div className="p-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="bg-gradient-to-r from-[#0E1C59] to-[#003DA5] rounded-2xl p-8 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">EMBRAER DASHBOARD</h1>
                                <p className="text-blue-100 text-lg">Monitoramento de Aeronaves Embraer em Tempo Real</p>
                            </div>
                            <Link
                                to="/compliance"
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105"
                            >
                                <FileCheck className="w-5 h-5" />
                                Verificar Conformidade
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="FROTA TOTAL"
                        value={stats.total}
                        subtitle="100% disponíveis"
                        icon={Plane}
                        iconColor="text-green-600"
                        iconBgColor="bg-green-100"
                        trend={{ value: "+100%", isPositive: true }}
                    />

                    <StatsCard
                        title="COMERCIAIS"
                        value={stats.commercial}
                        subtitle="E-Jets E2 + Legacy"
                        icon={Activity}
                        iconColor="text-blue-600"
                        iconBgColor="bg-blue-100"
                    />

                    <StatsCard
                        title="EXECUTIVOS"
                        value={stats.executive}
                        subtitle="Phenom & Praetor"
                        icon={Users}
                        iconColor="text-purple-600"
                        iconBgColor="bg-purple-100"
                    />

                    <StatsCard
                        title="DEFESA"
                        value={stats.defense}
                        subtitle="KC-390 & A-29"
                        icon={Shield}
                        iconColor="text-orange-600"
                        iconBgColor="bg-orange-100"
                    />
                </div>

                {/* Commercial Aircraft Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900">Jatos Comerciais E-Jets</h2>
                            <p className="text-neutral-600 mt-1">Família completa de aeronaves comerciais</p>
                        </div>
                        <span className="badge-info">{commercialAircraft.length} aeronaves</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {commercialAircraft.map((aircraft: Aircraft, index: number) => (
                            <AircraftCard key={aircraft.id} aircraft={aircraft} index={index} />
                        ))}
                    </div>
                </section>

                {/* Executive Jets Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900">Jatos Executivos</h2>
                            <p className="text-neutral-600 mt-1">Phenom e Praetor - excelência em aviação executiva</p>
                        </div>
                        <span className="badge-info">{executiveAircraft.length} aeronaves</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {executiveAircraft.map((aircraft: Aircraft, index: number) => (
                            <AircraftCard key={aircraft.id} aircraft={aircraft} index={index} />
                        ))}
                    </div>
                </section>

                {/* Defense Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900">Defesa & Segurança</h2>
                            <p className="text-neutral-600 mt-1">Soluções militares e de defesa</p>
                        </div>
                        <span className="badge-info">{defenseAircraft.length} aeronaves</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {defenseAircraft.map((aircraft: Aircraft, index: number) => (
                            <AircraftCard key={aircraft.id} aircraft={aircraft} index={index} />
                        ))}
                    </div>
                </section>

                {/* Agriculture Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-900">Aviação Agrícola</h2>
                            <p className="text-neutral-600 mt-1">Soluções para aplicação agrícola</p>
                        </div>
                        <span className="badge-info">{agricultureAircraft.length} aeronave</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {agricultureAircraft.map((aircraft: Aircraft, index: number) => (
                            <AircraftCard key={aircraft.id} aircraft={aircraft} index={index} />
                        ))}
                    </div>
                </section>

                {/* Performance Metrics */}
                <section className="card-embraer p-8">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-6">Métricas de Performance</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <p className="text-sm text-neutral-500 mb-2">Disponibilidade da Frota</p>
                            <p className="text-3xl font-bold text-green-600">100%</p>
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500 mb-2">Horas de Voo Total</p>
                            <p className="text-3xl font-bold text-blue-600 font-mono">12,450h</p>
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500 mb-2">Eficiência Operacional</p>
                            <p className="text-3xl font-bold text-orange-600">96%</p>
                        </div>
                        <div>
                            <p className="text-sm text-neutral-500 mb-2">Satisfação</p>
                            <p className="text-3xl font-bold text-purple-600">4.9★</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
