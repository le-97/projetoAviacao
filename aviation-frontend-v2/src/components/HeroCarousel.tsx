import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plane } from 'lucide-react';
import { useState, useEffect } from 'react';
import { embraerAircraft } from '../data/aircraftData';

export function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % embraerAircraft.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const handlePrevious = () => {
        setIsAutoPlaying(false);
        setCurrentIndex((prev) => prev === 0 ? embraerAircraft.length - 1 : prev - 1);
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

    return (
        <div
            className="relative w-full h-[600px] overflow-hidden"
            style={{
                backgroundColor: '#0E1C59',
                backgroundImage: 'linear-gradient(135deg, #0E1C59 0%, #003DA5 50%, #0E1C59 100%)',
                isolation: 'isolate',
                zIndex: 100
            }}
        >
            {/* Opaque Solid Background - Complete isolation */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundColor: '#0E1C59',
                    backgroundImage: 'linear-gradient(135deg, #0E1C59 0%, #003DA5 50%, #0E1C59 100%)',
                    zIndex: 1
                }}
            />


            {/* Decorative Pattern */}
            <div
                className="absolute inset-0 opacity-5"
                style={{ zIndex: 2 }}
            >
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                />
            </div>

            {/* Main Content Layer */}
            <div className="absolute inset-0" style={{ zIndex: 10 }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.7, ease: 'easeInOut' }}
                        className="w-full h-full flex items-center justify-center"
                    >
                        {/* Glass Container */}
                        <div className="relative w-full h-full flex items-center justify-center px-8">
                            {/* Aircraft Image */}
                            <div className="relative max-w-5xl w-full">
                                <motion.img
                                    src={currentAircraft.image}
                                    alt={currentAircraft.model}
                                    className="w-full h-auto object-contain drop-shadow-2xl"
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                />

                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-transparent blur-3xl" />
                            </div>

                            {/* Info Card - Bottom Left */}
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="absolute bottom-12 left-12 max-w-md"
                            >
                                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
                                    {/* Badge */}
                                    {currentAircraft.badge && (
                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400/90 to-orange-400/90 text-white mb-3 shadow-lg">
                                            {currentAircraft.badge}
                                        </span>
                                    )}

                                    {/* Model Name */}
                                    <h2 className="text-4xl font-bold text-white mb-2">
                                        {currentAircraft.model}
                                    </h2>

                                    {/* Category */}
                                    <p className="text-blue-200 text-sm font-medium mb-3">
                                        {currentAircraft.categoryLabel}
                                    </p>

                                    {/* Description */}
                                    <p className="text-white/90 text-sm leading-relaxed mb-4">
                                        {currentAircraft.description}
                                    </p>

                                    {/* Specs */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {currentAircraft.specs?.capacity && (
                                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                                                <p className="text-white/60 text-xs">Capacidade</p>
                                                <p className="text-white font-semibold text-sm">{currentAircraft.specs.capacity}</p>
                                            </div>
                                        )}
                                        {currentAircraft.specs?.range && (
                                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                                                <p className="text-white/60 text-xs">Alcance</p>
                                                <p className="text-white font-semibold text-sm">{currentAircraft.specs.range}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Counter - Top Right */}
                            <motion.div
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="absolute top-12 right-12"
                            >
                                <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/20 shadow-2xl">
                                    <div className="flex items-center gap-2">
                                        <Plane className="w-5 h-5 text-white" />
                                        <span className="text-white font-bold text-lg">
                                            {String(currentIndex + 1).padStart(2, '0')} / {String(embraerAircraft.length).padStart(2, '0')}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <button
                    onClick={handlePrevious}
                    className="absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center transition-all hover:scale-110 shadow-xl"
                    style={{ zIndex: 50 }}
                    aria-label="Previous aircraft"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center transition-all hover:scale-110 shadow-xl"
                    style={{ zIndex: 50 }}
                    aria-label="Next aircraft"
                >
                    <ChevronRight className="w-6 h-6 text-white" />
                </button>

                {/* Dots Indicator */}
                <div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2"
                    style={{ zIndex: 50 }}
                >
                    {embraerAircraft.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`transition-all ${index === currentIndex
                                ? 'w-12 h-2 bg-white'
                                : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                                } rounded-full`}
                            aria-label={`Go to aircraft ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
