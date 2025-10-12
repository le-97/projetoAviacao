import { motion } from 'framer-motion';
import { Plane, Gauge, Users } from 'lucide-react';
import type { Aircraft } from '../types/aircraft';

interface AircraftCardProps {
    aircraft: Aircraft;
    index: number;
}

export function AircraftCard({ aircraft, index }: AircraftCardProps) {
    const getCategoryBadgeColor = (category: string) => {
        switch (category) {
            case 'commercial':
                return 'bg-blue-100 text-blue-800';
            case 'executive':
                return 'bg-purple-100 text-purple-800';
            case 'defense':
                return 'bg-orange-100 text-orange-800';
            case 'agriculture':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-neutral-100 text-neutral-800';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="card-embraer overflow-hidden group cursor-pointer"
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-neutral-100">
                <img
                    src={aircraft.images?.primary || aircraft.image || ''}
                    alt={aircraft.model}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(aircraft.category)}`}>
                        {aircraft.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900">{aircraft.model}</h3>
                        <p className="text-sm text-neutral-500">{aircraft.type}</p>
                    </div>
                    <div className="w-10 h-10 bg-[#0E1C59]/10 rounded-lg flex items-center justify-center">
                        <Plane className="w-5 h-5 text-[#0E1C59]" />
                    </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {aircraft.capacity?.passengers && (
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm text-neutral-600">{aircraft.capacity.passengers} pax</span>
                        </div>
                    )}
                    {aircraft.performance?.range && (
                        <div className="flex items-center gap-2">
                            <Gauge className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm text-neutral-600">{aircraft.performance.range}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="tech-data">{aircraft.performance?.maxSpeed || 'N/A'}</span>
                    <span className="badge-success">Operacional</span>
                </div>
            </div>
        </motion.div>
    );
}
