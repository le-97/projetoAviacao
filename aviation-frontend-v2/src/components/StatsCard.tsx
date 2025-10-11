import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: LucideIcon;
    iconColor: string;
    iconBgColor: string;
    trend?: {
        value: string;
        isPositive: boolean;
    };
}

export function StatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor,
    iconBgColor,
    trend,
}: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="card-embraer p-6"
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-neutral-900 mt-2 font-mono">
                        {value}
                    </p>
                    {trend && (
                        <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${trend.isPositive ? 'text-green-600' : 'text-amber-600'
                            }`}>
                            <span>{trend.value}</span>
                            <span className="text-neutral-400">{subtitle}</span>
                        </p>
                    )}
                    {!trend && (
                        <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`w-14 h-14 ${iconBgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 ${iconColor}`} />
                </div>
            </div>
        </motion.div>
    );
}
