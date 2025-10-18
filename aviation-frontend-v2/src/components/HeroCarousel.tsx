import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plane } from "lucide-react";
import { useState, useEffect, memo } from "react";
import { embraerAircraft } from "../data/aircraftData";

export const HeroCarousel = memo(function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Carrossel automático
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % embraerAircraft.length);
        }, 5000); // Troca a cada 5 segundos

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const handlePrevious = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) =>
            prev === 0 ? embraerAircraft.length - 1 : prev - 1,
        );
    };

    const handleNext = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => (prev + 1) % embraerAircraft.length);
    };

    const handleDotClick = (index: number) => {
        setIsAutoPlaying(false);
        setCurrentIndex(index);
    };

    const currentAircraft = embraerAircraft[currentIndex];

    // Override images for updated Phenom assets in /planes
    const imageOverrides: Record<string, string> = {
        "Phenom 300": "/planes/phenom300.png",
        "Phenom 500": "/planes/phenom500.png",
        "Phenom 600": "/planes/phenom600.png",
        phenom300: "/planes/phenom300.png",
        phenom500: "/planes/phenom500.png",
        phenom600: "/planes/phenom600.png",
        "phenom-300e": "/planes/phenom300e.png",
        "praetor-500": "/planes/praetor500.png",
        "praetor-600": "/planes/praetor600.png",
    };
    const modelLower = (currentAircraft?.model || "").toLowerCase();
    const includesOverride = modelLower.includes("phenom 300")
        ? "/planes/phenom300.png"
        : modelLower.includes("phenom 500")
            ? "/planes/phenom500.png"
            : modelLower.includes("phenom 600")
                ? "/planes/phenom600.png"
                : modelLower.includes("phenom 300e")
                    ? "/planes/phenom300e.png"
                    : modelLower.includes("praetor 500")
                        ? "/planes/praetor500.png"
                        : modelLower.includes("praetor 600")
                            ? "/planes/praetor600.png"
                            : undefined;

    const resolvedImage =
        includesOverride ||
        (currentAircraft.id
            ? imageOverrides[currentAircraft.id as keyof typeof imageOverrides]
            : undefined) ||
        imageOverrides[currentAircraft.model as keyof typeof imageOverrides] ||
        currentAircraft.image;

    // Session-stable cache busting for hero assets
    const [assetNonce] = useState(() => String(Date.now()));
    const cacheBustedImage = resolvedImage
        ? `${resolvedImage}${resolvedImage.includes("?") ? "&" : "?"}v=${assetNonce}`
        : resolvedImage;

    return (
        <section
            className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden"
            aria-label="Carrossel de aeronaves Embraer"
            style={{
                backgroundColor: "#0E1C59",
                isolation: "isolate",
                contain: "paint layout",
                mixBlendMode: "normal",
                borderBottom: "8px solid #0E1C59",
                boxShadow: "inset 0 2px 0 #0E1C59, inset 0 -2px 0 #0E1C59",
                backgroundImage: "none",
                marginBottom: "-8px",
                paddingBottom: "8px",
                willChange: "transform",
            }}
        >
            {/* Solid background safety layers to avoid any light band */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundColor: "#0E1C59", zIndex: 0 }}
            />
            <div
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{ height: "300px", backgroundColor: "#0E1C59", zIndex: 0 }}
            />

            {/* Carousel */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ zIndex: 10 }}
                >
                    {/* Container */}
                    <div
                        id="hero-carousel"
                        className="relative w-full h-full flex items-center justify-center px-4 sm:px-8"
                    >
                        {/* Imagem da Aeronave */}
                        <div className="relative max-w-5xl w-full">
                            <motion.img
                                src={cacheBustedImage}
                                alt={`Imagem da aeronave ${currentAircraft.model} da Embraer`}
                                className="w-full h-auto object-contain max-h-[200px] sm:max-h-[300px] lg:max-h-[400px]"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                loading="eager"
                                decoding="async"
                                style={{ willChange: "transform" }}
                            />
                        </div>

                        {/* Cartão de Informações - Inferior Esquerdo */}
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="absolute bottom-4 sm:bottom-8 lg:bottom-12 left-4 sm:left-8 lg:left-12 max-w-xs sm:max-w-sm lg:max-w-md"
                        >
                            <div
                                className="rounded-2xl p-3 sm:p-4 lg:p-6 border border-transparent shadow-none"
                                style={{ backgroundColor: "#0E1C59" }}
                            >
                                {/* Selo */}
                                {currentAircraft.badge && (
                                    <span className="inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400/90 to-orange-400/90 text-white mb-2 sm:mb-3">
                                        {currentAircraft.badge}
                                    </span>
                                )}

                                {/* Nome do Modelo */}
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                                    {currentAircraft.model}
                                </h2>

                                {/* Categoria */}
                                <p className="text-blue-200 text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                                    {currentAircraft.categoryLabel}
                                </p>

                                {/* Descrição */}
                                <p className="text-white/90 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                                    {currentAircraft.description}
                                </p>

                                {/* Especificações */}
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                        {currentAircraft.specs?.capacity && (
                                            <div
                                                className="rounded-lg p-2 border border-transparent"
                                                style={{ backgroundColor: "#0E1C59" }}
                                            >
                                                <p className="text-white/60 text-xs">Capacidade</p>
                                                <p className="text-white font-semibold text-xs sm:text-sm">
                                                    {currentAircraft.specs.capacity}
                                                </p>
                                            </div>
                                        )}
                                        {currentAircraft.specs?.range && (
                                            <div
                                                className="rounded-lg p-2 border border-transparent"
                                                style={{ backgroundColor: "#0E1C59" }}
                                            >
                                                <p className="text-white/60 text-xs">Alcance</p>
                                                <p className="text-white font-semibold text-xs sm:text-sm">
                                                    {currentAircraft.specs.range}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contador - Superior Direito */}
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="absolute top-4 sm:top-8 lg:top-12 right-4 sm:right-8 lg:right-12"
                        >
                            <div
                                className="rounded-2xl px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border border-transparent shadow-none"
                                style={{ backgroundColor: "#0E1C59" }}
                            >
                                <div className="flex items-center gap-2">
                                    <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    <span className="text-white font-bold text-sm sm:text-base lg:text-lg">
                                        {String(currentIndex + 1).padStart(2, "0")} /{" "}
                                        {String(embraerAircraft.length).padStart(2, "0")}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Botões de Navegação */}
            <button
                onClick={handlePrevious}
                className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-transparent hover:bg-transparent outline-none rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-none z-20 min-h-[44px] min-w-[44px]"
                aria-label="Aeronave anterior"
                aria-controls="hero-carousel"
            >
                <ChevronLeft
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    aria-hidden="true"
                />
            </button>

            <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-transparent hover:bg-transparent outline-none rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-none z-20 min-h-[44px] min-w-[44px]"
                aria-label="Próxima aeronave"
                aria-controls="hero-carousel"
            >
                <ChevronRight
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    aria-hidden="true"
                />
            </button>

            {/* Indicador de Páginas */}
            <div
                className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20 px-2 sm:px-3 py-1 rounded-full"
                style={{ backgroundColor: "#0E1C59" }}
                role="tablist"
                aria-label="Indicadores do carrossel de aeronaves"
            >
                {embraerAircraft.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={`transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${index === currentIndex ? "w-8 sm:w-10 lg:w-12 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/60"} rounded-full`}
                        aria-label={`Ir para aeronave ${index + 1}`}
                        aria-selected={index === currentIndex}
                        role="tab"
                        aria-controls="hero-carousel"
                    />
                ))}
            </div>
        </section>
    );
});
