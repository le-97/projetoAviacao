import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FileCheck, AlertCircle, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { AircraftCard } from "../components/AircraftCard";
import { HeroCarousel } from "../components/HeroCarousel";
import { GitHubMetrics } from "../components/GitHubMetrics";
import { TechStackInfographic } from "../components/TechStackInfographic";
import { Skeleton } from "../components/ui/skeleton";
import { Breadcrumb } from "../components/Breadcrumb";
import { SEO } from "../components/SEO";
import { embraerAircraft } from "../data/aircraftData";
import type { Aircraft } from "../types/aircraft";

export function EmbraerDashboard() {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [aircraftData, setAircraftData] = useState<{
        commercial: Aircraft[];
        executive: Aircraft[];
        defense: Aircraft[];
        agriculture: Aircraft[];
    } | null>(null);

    useEffect(() => {
        const loadAircraftData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Simulate API call delay
                await new Promise((resolve) => setTimeout(resolve, 1500));

                const commercial = embraerAircraft.filter(
                    (a: Aircraft) => a.category === "commercial",
                );
                const executive = embraerAircraft.filter(
                    (a: Aircraft) => a.category === "executive",
                );
                const defense = embraerAircraft.filter(
                    (a: Aircraft) => a.category === "defense",
                );
                const agriculture = embraerAircraft.filter(
                    (a: Aircraft) => a.category === "agriculture",
                );

                setAircraftData({ commercial, executive, defense, agriculture });
                toast.success("Dados das aeronaves carregados com sucesso!");
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : "Erro ao carregar dados das aeronaves";
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        loadAircraftData();
    }, []);

    const handleRetry = () => {
        setError(null);
        setAircraftData(null);
        window.location.reload();
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0E1C59] via-[#003DA5] to-[#0E1C59] py-8 sm:py-12 px-4 flex items-center justify-center">
                <div className="max-w-md mx-auto text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">
                        Erro ao carregar dados
                    </h2>
                    <p className="text-blue-100 mb-6">{error}</p>
                    <button
                        onClick={handleRetry}
                        className="inline-flex items-center px-6 py-3 bg-white text-[#0E1C59] rounded-xl hover:bg-gray-100 transition-colors font-semibold"
                    >
                        <RefreshCw className="h-5 w-5 mr-2" />
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    const commercialAircraft = aircraftData?.commercial || [];
    const executiveAircraft = aircraftData?.executive || [];
    const defenseAircraft = aircraftData?.defense || [];
    const agricultureAircraft = aircraftData?.agriculture || [];

    const dashboardStructuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Embraer Aviation Compliance Platform",
        "description": "Advanced aviation compliance platform for Embraer aircraft. Ensure regulatory compliance with automated checks, real-time monitoring, and comprehensive reporting.",
        "url": window.location.href,
        "publisher": {
            "@type": "Organization",
            "name": "Embraer Aviation Compliance Platform",
            "url": window.location.origin
        },
        "about": {
            "@type": "Product",
            "name": "Embraer Aircraft Compliance System",
            "description": "Comprehensive compliance verification system for Embraer E-Jets, Phenom, Praetor, and defense aircraft",
            "category": "Aviation Software"
        }
    };

    return (
        <>
            <SEO
                title="Embraer Aviation Compliance Platform"
                description="Advanced aviation compliance platform for Embraer aircraft. Ensure regulatory compliance with automated checks, real-time monitoring, and comprehensive reporting for E-Jets, Phenom, Praetor, and defense aircraft."
                keywords="Embraer, aviation compliance, aircraft certification, EASA, FAA, ANAC, regulatory compliance, safety standards"
                structuredData={dashboardStructuredData}
            />
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="min-h-screen"
                style={{
                    backgroundColor: "#fafafa",
                    backgroundImage: "none",
                }}
                role="main"
                aria-labelledby="dashboard-title"
            >
                {/* Hero Carousel - Completely isolated */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 1000,
                        isolation: "isolate",
                    }}
                >
                    <HeroCarousel />
                </div>

                {/* Content Section */}
                <div
                    className="p-4 sm:p-6"
                    style={{
                        position: "relative",
                        zIndex: 10,
                        backgroundColor: "#fafafa",
                        borderTop: "4px solid #0E1C59", // clear separation
                    }}
                >
                    {/* Breadcrumb Navigation */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 sm:mb-6"
                    >
                        <Breadcrumb />
                    </motion.div>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6 sm:mb-8"
                    >
                        <div className="bg-gradient-to-r from-[#0E1C59] to-[#003DA5] rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                                <div>
                                    <h1
                                        id="dashboard-title"
                                        className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white"
                                    >
                                        EMBRAER DASHBOARD
                                    </h1>
                                    <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                                        Prova de conceito para verificação de conformidade de
                                        aeronaves da EMBRAER
                                    </p>
                                </div>
                                <Link
                                    to="/compliance"
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl flex items-center gap-2 transition-all hover:scale-105 text-sm sm:text-base min-h-[44px] justify-center lg:justify-start"
                                >
                                    <FileCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Verificar Conformidade
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Commercial Aircraft Section */}
                    <section className="mb-8 sm:mb-12" aria-labelledby="commercial-title">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
                            <div>
                                <h2
                                    id="commercial-title"
                                    className="text-xl sm:text-2xl font-bold text-neutral-900"
                                >
                                    Jatos Comerciais E-Jets
                                </h2>
                                <p className="text-neutral-600 mt-1 text-sm sm:text-base">
                                    Família completa de aeronaves comerciais
                                </p>
                            </div>
                            {isLoading ? (
                                <Skeleton className="h-6 w-20" />
                            ) : (
                                <span className="badge-info text-sm self-start sm:self-auto">
                                    {commercialAircraft.length} aeronaves
                                </span>
                            )}
                        </div>
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                            role="list"
                        >
                            {isLoading
                                ? [...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden min-h-[320px] sm:min-h-[360px]"
                                    >
                                        <Skeleton className="h-40 sm:h-48 w-full" />
                                        <div className="p-4 sm:p-6">
                                            <Skeleton className="h-6 w-32 mb-2" />
                                            <Skeleton className="h-4 w-full mb-4" />
                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <Skeleton className="h-8 w-full" />
                                                <Skeleton className="h-8 w-full" />
                                            </div>
                                            <div className="flex justify-between">
                                                <Skeleton className="h-6 w-16" />
                                                <Skeleton className="h-6 w-20" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                                : commercialAircraft.map((aircraft: Aircraft, index: number) => (
                                    <AircraftCard
                                        key={aircraft.id}
                                        aircraft={aircraft}
                                        index={index}
                                    />
                                ))}
                        </div>
                    </section>

                    {/* Executive Jets Section */}
                    <section className="mb-8 sm:mb-12" aria-labelledby="executive-title">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
                            <div>
                                <h2
                                    id="executive-title"
                                    className="text-xl sm:text-2xl font-bold text-neutral-900"
                                >
                                    Jatos Executivos
                                </h2>
                                <p className="text-neutral-600 mt-1 text-sm sm:text-base">
                                    Phenom e Praetor - excelência em aviação executiva
                                </p>
                            </div>
                            {isLoading ? (
                                <Skeleton className="h-6 w-20" />
                            ) : (
                                <span className="badge-info text-sm self-start sm:self-auto">
                                    {executiveAircraft.length} aeronaves
                                </span>
                            )}
                        </div>
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                            role="list"
                        >
                            {isLoading
                                ? [...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden min-h-[320px] sm:min-h-[360px]"
                                    >
                                        <Skeleton className="h-40 sm:h-48 w-full" />
                                        <div className="p-4 sm:p-6">
                                            <Skeleton className="h-6 w-32 mb-2" />
                                            <Skeleton className="h-4 w-full mb-4" />
                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <Skeleton className="h-8 w-full" />
                                                <Skeleton className="h-8 w-full" />
                                            </div>
                                            <div className="flex justify-between">
                                                <Skeleton className="h-6 w-16" />
                                                <Skeleton className="h-6 w-20" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                                : executiveAircraft.map((aircraft: Aircraft, index: number) => (
                                    <AircraftCard
                                        key={aircraft.id}
                                        aircraft={aircraft}
                                        index={index}
                                    />
                                ))}
                        </div>
                    </section>

                    {/* Defense Section */}
                    <section className="mb-8 sm:mb-12" aria-labelledby="defense-title">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
                            <div>
                                <h2
                                    id="defense-title"
                                    className="text-xl sm:text-2xl font-bold text-neutral-900"
                                >
                                    Defesa & Segurança
                                </h2>
                                <p className="text-neutral-600 mt-1 text-sm sm:text-base">
                                    Soluções militares e de defesa
                                </p>
                            </div>
                            {isLoading ? (
                                <Skeleton className="h-6 w-20" />
                            ) : (
                                <span className="badge-info text-sm self-start sm:self-auto">
                                    {defenseAircraft.length} aeronaves
                                </span>
                            )}
                        </div>
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                            role="list"
                        >
                            {isLoading
                                ? [...Array(2)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden min-h-[320px] sm:min-h-[360px]"
                                    >
                                        <Skeleton className="h-40 sm:h-48 w-full" />
                                        <div className="p-4 sm:p-6">
                                            <Skeleton className="h-6 w-32 mb-2" />
                                            <Skeleton className="h-4 w-full mb-4" />
                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <Skeleton className="h-8 w-full" />
                                                <Skeleton className="h-8 w-full" />
                                            </div>
                                            <div className="flex justify-between">
                                                <Skeleton className="h-6 w-16" />
                                                <Skeleton className="h-6 w-20" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                                : defenseAircraft.map((aircraft: Aircraft, index: number) => (
                                    <AircraftCard
                                        key={aircraft.id}
                                        aircraft={aircraft}
                                        index={index}
                                    />
                                ))}
                        </div>
                    </section>

                    {/* Agriculture Section */}
                    <section className="mb-8 sm:mb-12" aria-labelledby="agriculture-title">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
                            <div>
                                <h2
                                    id="agriculture-title"
                                    className="text-xl sm:text-2xl font-bold text-neutral-900"
                                >
                                    Aviação Agrícola
                                </h2>
                                <p className="text-neutral-600 mt-1 text-sm sm:text-base">
                                    Soluções para aplicação agrícola
                                </p>
                            </div>
                            {isLoading ? (
                                <Skeleton className="h-6 w-20" />
                            ) : (
                                <span className="badge-info text-sm self-start sm:self-auto">
                                    {agricultureAircraft.length} aeronave
                                </span>
                            )}
                        </div>
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                            role="list"
                        >
                            {isLoading
                                ? [...Array(1)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden min-h-[320px] sm:min-h-[360px]"
                                    >
                                        <Skeleton className="h-40 sm:h-48 w-full" />
                                        <div className="p-4 sm:p-6">
                                            <Skeleton className="h-6 w-32 mb-2" />
                                            <Skeleton className="h-4 w-full mb-4" />
                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <Skeleton className="h-8 w-full" />
                                                <Skeleton className="h-8 w-full" />
                                            </div>
                                            <div className="flex justify-between">
                                                <Skeleton className="h-6 w-16" />
                                                <Skeleton className="h-6 w-20" />
                                            </div>
                                        </div>
                                    </div>
                                ))
                                : agricultureAircraft.map((aircraft: Aircraft, index: number) => (
                                    <AircraftCard
                                        key={aircraft.id}
                                        aircraft={aircraft}
                                        index={index}
                                    />
                                ))}
                        </div>
                    </section>

                    {/* GitHub Metrics Section with Shadcn UI - Before Footer */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-8 sm:mb-12"
                        role="region"
                        aria-labelledby="github-metrics-title"
                    >
                        <div className="bg-gradient-to-r from-[#0E1C59] to-[#003DA5] rounded-2xl p-4 sm:p-6 lg:p-8 text-white mb-4 sm:mb-6">
                            <h2
                                id="github-metrics-title"
                                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white"
                            >
                                MÉTRICAS DO REPOSITÓRIO GITHUB
                            </h2>
                            <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                                Estatísticas em tempo real do projeto
                            </p>
                        </div>
                        <GitHubMetrics />
                    </motion.div>

                    {/* Tech Stack Infographic */}
                    <section className="mb-8 sm:mb-12" aria-labelledby="tech-stack-title">
                        <div className="bg-gradient-to-r from-[#0E1C59] to-[#003DA5] rounded-2xl p-4 sm:p-6 lg:p-8 text-white mb-4 sm:mb-6">
                            <h2
                                id="tech-stack-title"
                                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white"
                            >
                                STACK TECNOLÓGICA DO PROJETO
                            </h2>
                            <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                                Visão geral das tecnologias utilizadas
                            </p>
                        </div>
                        <TechStackInfographic />
                    </section>
                </div>
            </motion.div>
        </>
    );
}
