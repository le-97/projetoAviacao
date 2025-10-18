import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Info,
    Search,
    Plane,
    Globe,
    FileCheck,
    Loader2,
    XCircle,
    RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import {
    checkCompliance,
    type ComplianceReport,
    type ComplianceCheck,
} from "../services/complianceService";
import { embraerAircraft } from "../data/aircraftData";
import { Skeleton } from "../components/ui/skeleton";
import { BackButton } from "../components/BackButton";
import { Breadcrumb } from "../components/Breadcrumb";
import { SEO } from "../components/SEO";

const countries = [
    { code: "USA", name: "Estados Unidos", flag: "🇺🇸", authority: "FAA" },
    { code: "BRAZIL", name: "Brasil", flag: "🇧🇷", authority: "ANAC" },
    { code: "EUROPE", name: "União Europeia", flag: "🇪🇺", authority: "EASA" },
];

const statusConfig = {
    COMPLIANT: {
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: CheckCircle2,
        label: "Conforme",
    },
    NON_COMPLIANT: {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: XCircle,
        label: "Não Conforme",
    },
    PARTIAL_COMPLIANCE: {
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        icon: AlertTriangle,
        label: "Parcialmente Conforme",
    },
    NOT_APPLICABLE: {
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        icon: Info,
        label: "Não Aplicável",
    },
};
const severityConfig = {
    CRITICAL: { color: "text-red-600", bgColor: "bg-red-100", label: "Crítico" },
    MAJOR: { color: "text-orange-600", bgColor: "bg-orange-100", label: "Maior" },
    MINOR: { color: "text-yellow-600", bgColor: "bg-yellow-100", label: "Menor" },
    INFO: { color: "text-blue-600", bgColor: "bg-blue-100", label: "Info" },
};

export function ComplianceChecker() {
    const location = useLocation();
    const [selectedAircraft, setSelectedAircraft] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [report, setReport] = useState<ComplianceReport | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCheck = async () => {
        if (!selectedAircraft || !selectedCountry) {
            toast.error("Por favor, selecione uma aeronave e um país");
            return;
        }

        setIsChecking(true);
        setError(null);
        setReport(null);

        try {
            const result = await checkCompliance(selectedAircraft, selectedCountry);
            setReport(result);
            toast.success("Verificação de conformidade concluída com sucesso!");
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Erro ao verificar conformidade";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsChecking(false);
        }
    };

    const handleRetry = () => {
        setError(null);
        setReport(null);
        handleCheck();
    };

    const StatusBadge = ({ check }: { check: ComplianceCheck }) => {
        const config =
            statusConfig[check.status] || statusConfig.PARTIAL_COMPLIANCE;
        const Icon = config.icon;

        return (
            <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor} ${config.borderColor} border`}
            >
                <Icon className={`w-4 h-4 ${config.color}`} />
                <span className={`text-sm font-medium ${config.color}`}>
                    {config.label}
                </span>
            </div>
        );
    };

    const SeverityBadge = ({
        severity,
    }: {
        severity: ComplianceCheck["severity"];
    }) => {
        const config = severityConfig[severity];
        return (
            <span
                className={`px-2 py-1 text-xs font-semibold rounded ${config.bgColor} ${config.color}`}
            >
                {config.label}
            </span>
        );
    };

    const complianceStructuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Aviation Compliance Checker - Embraer Aircraft",
        "description": "Check regulatory compliance for Embraer aircraft against FAA, EASA, and ANAC standards. Automated compliance verification with detailed reports and recommendations.",
        "url": window.location.href,
        "publisher": {
            "@type": "Organization",
            "name": "Embraer Aviation Compliance Platform",
            "url": window.location.origin
        },
        "about": {
            "@type": "Service",
            "name": "Aircraft Compliance Verification",
            "description": "Automated regulatory compliance checking for aviation industry",
            "provider": {
                "@type": "Organization",
                "name": "Embraer"
            }
        }
    };

    return (
        <>
            <SEO
                title="Aviation Compliance Checker - Embraer Aircraft Verification"
                description="Check regulatory compliance for Embraer aircraft against FAA, EASA, and ANAC standards. Automated compliance verification with detailed reports and safety recommendations."
                keywords="aviation compliance, Embraer aircraft, regulatory verification, FAA compliance, EASA standards, ANAC certification, aircraft safety"
                structuredData={complianceStructuredData}
            />
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="min-h-screen bg-gradient-to-br from-[#0E1C59] via-[#003DA5] to-[#0E1C59] py-8 sm:py-12 px-4"
                role="main"
                aria-labelledby="compliance-checker-title"
            >
                <div className="max-w-6xl mx-auto">
                    {/* Navigation */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 sm:mb-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <Breadcrumb />
                            <BackButton />
                        </div>
                    </motion.div>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-center mb-8 sm:mb-12"
                    >
                        <h1
                            id="compliance-checker-title"
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
                        >
                            Verificação de Conformidade
                        </h1>
                        <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                            Verifique a conformidade regulatória das aeronaves Embraer
                        </p>
                    </motion.div>

                    {/* Form Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8"
                        role="region"
                        aria-labelledby="form-title"
                    >
                        <div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6"
                            role="group"
                            aria-labelledby="form-title"
                        >
                            <h2 id="form-title" className="sr-only">
                                Formulário de Verificação de Conformidade
                            </h2>
                            {/* Aircraft Selection */}
                            <div>
                                <label
                                    htmlFor="aircraft-select"
                                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
                                >
                                    <Plane className="w-4 h-4" aria-hidden="true" />
                                    Aeronave
                                </label>
                                <select
                                    id="aircraft-select"
                                    value={selectedAircraft}
                                    onChange={(e) => setSelectedAircraft(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0E1C59] focus:ring-2 focus:ring-blue-100 transition-all text-sm sm:text-base min-h-[44px]"
                                    aria-describedby="aircraft-help"
                                >
                                    <option value="">Selecione uma aeronave</option>
                                    {embraerAircraft.map((aircraft) => (
                                        <option key={aircraft.id} value={aircraft.model}>
                                            {aircraft.model} - {aircraft.categoryLabel}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Country Selection */}
                            <div>
                                <label
                                    htmlFor="country-select"
                                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
                                >
                                    <Globe className="w-4 h-4" aria-hidden="true" />
                                    País/Região
                                </label>
                                <select
                                    id="country-select"
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0E1C59] focus:ring-2 focus:ring-blue-100 transition-all text-sm sm:text-base min-h-[44px]"
                                    aria-describedby="country-help"
                                >
                                    <option value="">Selecione um país</option>
                                    {countries.map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.flag} {country.name} ({country.authority})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Check Button */}
                        <button
                            onClick={handleCheck}
                            disabled={isChecking || !selectedAircraft || !selectedCountry}
                            className="w-full bg-gradient-to-r from-[#0E1C59] to-[#003DA5] text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px]"
                            aria-describedby="check-button-help"
                        >
                            {isChecking ? (
                                <>
                                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                    Verificando Conformidade...
                                </>
                            ) : (
                                <>
                                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Verificar Conformidade
                                </>
                            )}
                        </button>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-red-800">{error}</p>
                                    </div>
                                    <button
                                        onClick={handleRetry}
                                        className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Tentar Novamente
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Loading Skeleton */}
                    <AnimatePresence>
                        {isChecking && !report && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                {/* Summary Card Skeleton */}
                                <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-4">
                                        <div className="flex-1">
                                            <Skeleton className="h-8 w-64 mb-2" />
                                            <Skeleton className="h-4 w-48" />
                                        </div>
                                        <Skeleton className="h-8 w-24" />
                                    </div>

                                    {/* Stats Grid Skeleton */}
                                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="bg-gray-50 rounded-xl p-4">
                                                <Skeleton className="h-6 w-6 mb-2" />
                                                <Skeleton className="h-8 w-12 mb-1" />
                                                <Skeleton className="h-4 w-20" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Progress Bar Skeleton */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-4 w-12" />
                                        </div>
                                        <Skeleton className="h-3 w-full rounded-full" />
                                    </div>
                                </div>

                                {/* Checks List Skeleton */}
                                <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
                                    <Skeleton className="h-6 w-48 mb-4" />
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="border-2 border-gray-100 rounded-xl p-4"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-3">
                                                    <div className="flex-1">
                                                        <Skeleton className="h-5 w-64 mb-1" />
                                                        <Skeleton className="h-4 w-48" />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Skeleton className="h-6 w-16" />
                                                        <Skeleton className="h-6 w-20" />
                                                    </div>
                                                </div>
                                                <Skeleton className="h-16 w-full mb-3" />
                                                <Skeleton className="h-12 w-full" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Results */}
                    <AnimatePresence>
                        {report && !isChecking && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                {/* Summary Card */}
                                <div
                                    className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8"
                                    role="region"
                                    aria-labelledby="summary-title"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-4">
                                        <div>
                                            <h2
                                                id="summary-title"
                                                className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
                                            >
                                                Relatório de Conformidade
                                            </h2>
                                            <p className="text-gray-600 text-sm sm:text-base">
                                                {report.aircraft_model} •{" "}
                                                {report.authority ||
                                                    countries.find((c) => c.code === report.country)
                                                        ?.authority}
                                            </p>
                                        </div>
                                        <StatusBadge
                                            check={{ status: report.overall_status } as ComplianceCheck}
                                        />
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                        <div className="bg-blue-50 rounded-xl p-4">
                                            <FileCheck className="w-6 h-6 text-blue-600 mb-2" />
                                            <div className="text-2xl font-bold text-blue-600">
                                                {report.total_checks}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Total de Verificações
                                            </div>
                                        </div>
                                        <div className="bg-green-50 rounded-xl p-4">
                                            <CheckCircle2 className="w-6 h-6 text-green-600 mb-2" />
                                            <div className="text-2xl font-bold text-green-600">
                                                {report.compliant_checks}
                                            </div>
                                            <div className="text-sm text-gray-600">Conformes</div>
                                        </div>
                                        <div className="bg-red-50 rounded-xl p-4">
                                            <XCircle className="w-6 h-6 text-red-600 mb-2" />
                                            <div className="text-2xl font-bold text-red-600">
                                                {report.non_compliant_checks}
                                            </div>
                                            <div className="text-sm text-gray-600">Não Conformes</div>
                                        </div>
                                        <div className="bg-orange-50 rounded-xl p-4">
                                            <AlertTriangle className="w-6 h-6 text-orange-600 mb-2" />
                                            <div className="text-2xl font-bold text-orange-600">
                                                {report.critical_issues}
                                            </div>
                                            <div className="text-sm text-gray-600">Críticos</div>
                                        </div>
                                    </div>

                                    {/* Compliance Percentage */}
                                    {report.compliance_percentage !== undefined && (
                                        <div className="mb-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-semibold text-gray-700">
                                                    Taxa de Conformidade
                                                </span>
                                                <span className="text-lg font-bold text-[#0E1C59]">
                                                    {report.compliance_percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${report.compliance_percentage}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="bg-gradient-to-r from-[#0E1C59] to-[#003DA5] h-3 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Checks List */}
                                {report.checks && report.checks.length > 0 && (
                                    <div
                                        className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8"
                                        role="region"
                                        aria-labelledby="checks-title"
                                    >
                                        <h3
                                            id="checks-title"
                                            className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6"
                                        >
                                            Verificações Detalhadas
                                        </h3>
                                        <div className="space-y-3 sm:space-y-4" role="list">
                                            {report.checks.map((check, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="border-2 border-gray-100 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
                                                    role="listitem"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 gap-3">
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">
                                                                {check.regulation_title}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                {check.regulation_reference}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <SeverityBadge severity={check.severity} />
                                                            <StatusBadge check={check} />
                                                        </div>
                                                    </div>

                                                    {check.findings && check.findings.length > 0 && (
                                                        <div className="mb-3">
                                                            <p className="text-sm font-semibold text-gray-700 mb-2">
                                                                Achados:
                                                            </p>
                                                            <ul className="list-disc list-inside space-y-1">
                                                                {check.findings.map((finding, i) => (
                                                                    <li key={i} className="text-sm text-gray-600">
                                                                        {finding}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {check.recommendations &&
                                                        check.recommendations.length > 0 && (
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-700 mb-2">
                                                                    Recomendações:
                                                                </p>
                                                                <ul className="list-disc list-inside space-y-1">
                                                                    {check.recommendations.map((rec, i) => (
                                                                        <li key={i} className="text-sm text-blue-600">
                                                                            {rec}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recommendations */}
                                {report.recommendations && report.recommendations.length > 0 && (
                                    <div
                                        className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8"
                                        role="region"
                                        aria-labelledby="recommendations-title"
                                    >
                                        <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                            <Info
                                                className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                                                aria-hidden="true"
                                            />
                                            <h3
                                                id="recommendations-title"
                                                className="text-lg sm:text-xl font-bold text-gray-900"
                                            >
                                                Recomendações Gerais
                                            </h3>
                                        </div>
                                        <ul className="space-y-2 sm:space-y-3" role="list">
                                            {report.recommendations.map((rec, index) => (
                                                <motion.li
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 rounded-xl"
                                                    role="listitem"
                                                >
                                                    <CheckCircle2
                                                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5"
                                                        aria-hidden="true"
                                                    />
                                                    <p className="text-gray-700 text-sm sm:text-base">
                                                        {rec}
                                                    </p>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </>
    );
}
