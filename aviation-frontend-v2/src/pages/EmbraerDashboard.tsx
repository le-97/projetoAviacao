import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Activity,
    Users,
    Shield,
    FileCheck
} from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { AircraftCard } from '../components/AircraftCard';
import { HeroCarousel } from '../components/HeroCarousel';
import { GitHubMetrics } from '../components/GitHubMetrics';
import { TechStackInfographic } from '../components/TechStackInfographic';
import { embraerAircraft } from '../data/aircraftData';
import type { Aircraft } from '../types/aircraft';

export function EmbraerDashboard() {

    const commercialAircraft = embraerAircraft.filter((a: Aircraft) => a.category === 'commercial');
    const executiveAircraft = embraerAircraft.filter((a: Aircraft) => a.category === 'executive');
    const defenseAircraft = embraerAircraft.filter((a: Aircraft) => a.category === 'defense');
    const agricultureAircraft = embraerAircraft.filter((a: Aircraft) => a.category === 'agriculture'); return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Carousel - Without Background */}
            <div className="relative bg-white">
                <HeroCarousel />
            </div>

            {/* Content Section with Animated Sky Background */}
            <div className="relative">
                {/* Animated Sky Background - Only for content area */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-50 animate-clouds-fast"
                        style={{
                            backgroundImage: 'url(/BG/envato-labs-ai-4884b2bb-306c-4085-b4d6-6e69a514dae9.jpg)',
                            backgroundSize: '130%'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-white/60" />
                </div>

                {/* Content */}
                <div className="relative z-10 p-6">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="bg-gradient-to-r from-[#0E1C59] to-[#003DA5] rounded-2xl p-8 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-4xl font-bold mb-2 text-white">EMBRAER DASHBOARD</h1>
                                    <p className="text-blue-100 text-lg">Prova de conceito para verificação de conformidade de aeronaves da EMBRAER</p>
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

                    {/* GitHub Metrics Section with Shadcn UI - Before Footer */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-12"
                    >
                        <div className="bg-gradient-to-r from-[#0E1C59] to-[#003DA5] rounded-2xl p-8 text-white mb-6">
                            <h2 className="text-4xl font-bold mb-2 text-white">MÉTRICAS DO REPOSITÓRIO GITHUB</h2>
                            <p className="text-blue-100 text-lg">Estatísticas em tempo real do projeto</p>
                        </div>
                        <GitHubMetrics />
                    </motion.div>

                    {/* Tech Stack Infographic */}
                    <section className="mb-12">
                        <div className="bg-gradient-to-r from-[#0E1C59] to-[#003DA5] rounded-2xl p-6 text-white mb-6">
                            <h3 className="text-2xl font-semibold text-white">STACK TECNOLÓGICA DO PROJETO</h3>
                            <p className="text-blue-100">Visão geral das tecnologias utilizadas</p>
                        </div>
                        <TechStackInfographic />
                    </section>
                </div>
            </div>
        </div>
    );
}
