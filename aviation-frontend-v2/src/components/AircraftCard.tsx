import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Plane, Gauge, Users } from 'lucide-react';
import { useState } from 'react';
import type { Aircraft } from '../types/aircraft';

interface AircraftCardProps {
    aircraft: Aircraft;
    index: number;
}

export function AircraftCard({ aircraft, index }: AircraftCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    
    // Parallax effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    
    const mouseXSpring = useSpring(x, { damping: 30, stiffness: 200 });
    const mouseYSpring = useSpring(y, { damping: 30, stiffness: 200 });
    
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };
    
    const getCategoryBadgeColor = (category: string) => {
        switch (category) {
            case 'commercial':
                return 'bg-blue-100/80 backdrop-blur-sm text-blue-800 border border-blue-200/50';
            case 'executive':
                return 'bg-purple-100/80 backdrop-blur-sm text-purple-800 border border-purple-200/50';
            case 'defense':
                return 'bg-orange-100/80 backdrop-blur-sm text-orange-800 border border-orange-200/50';
            case 'agriculture':
                return 'bg-green-100/80 backdrop-blur-sm text-green-800 border border-green-200/50';
            default:
                return 'bg-neutral-100/80 backdrop-blur-sm text-neutral-800 border border-neutral-200/50';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="relative overflow-hidden group cursor-pointer"
        >
            {/* Glassmorphism Card */}
            <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
                {/* Image with Parallax */}
                <motion.div 
                    className="relative h-48 overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200"
                    style={{
                        transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)',
                        transformStyle: 'preserve-3d',
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <img
                        src={aircraft.images?.primary || aircraft.image || ''}
                        alt={aircraft.model}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                    />
                    {/* Glass overlay on image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${getCategoryBadgeColor(aircraft.category)}`}>
                            {aircraft.categoryLabel || aircraft.category}
                        </span>
                    </div>
                    
                    {/* Badge if exists */}
                    {aircraft.badge && (
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-yellow-400/90 to-orange-400/90 text-white backdrop-blur-sm border border-white/30 shadow-lg">
                                {aircraft.badge}
                            </span>
                        </div>
                    )}
                </motion.div>

                {/* Content with Glass effect */}
                <motion.div 
                    className="relative p-6 bg-white/40 backdrop-blur-sm"
                    style={{
                        transform: isHovered ? 'translateZ(30px)' : 'translateZ(0px)',
                        transformStyle: 'preserve-3d',
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-neutral-900 mb-1 group-hover:text-[#0E1C59] transition-colors">
                                {aircraft.model}
                            </h3>
                            <p className="text-sm text-neutral-600 line-clamp-2">{aircraft.description}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-br from-[#0E1C59]/10 to-[#003DA5]/10 rounded-xl flex items-center justify-center border border-[#0E1C59]/20 group-hover:scale-110 transition-transform shadow-lg">
                            <Plane className="w-6 h-6 text-[#0E1C59]" />
                        </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {aircraft.specs?.capacity && (
                            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-neutral-700">{aircraft.specs.capacity}</span>
                            </div>
                        )}
                        {aircraft.specs?.range && (
                            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                                <Gauge className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-neutral-700">{aircraft.specs.range}</span>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-white/30 flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#0E1C59] bg-[#0E1C59]/10 px-3 py-1.5 rounded-lg">
                            {aircraft.specs?.speed || 'N/A'}
                        </span>
                        <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100/80 text-green-700 border border-green-200/50 backdrop-blur-sm">
                            {aircraft.status === 'operational' ? 'Operacional' : aircraft.status}
                        </span>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </motion.div>
            </div>
        </motion.div>
    );
}
