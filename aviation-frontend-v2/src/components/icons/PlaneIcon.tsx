import { motion } from 'framer-motion';

interface PlaneIconProps {
    isOpen: boolean;
    className?: string;
}

/**
 * Ícone de avião minimalista com animação de rotação
 * → quando fechado, ↘️ quando aberto (simulando pouso/aterrissagem)
 */
export const PlaneIcon = ({ isOpen, className = '' }: PlaneIconProps) => {
    return (
        <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-6 h-6 ${className}`}
            animate={{
                rotate: isOpen ? 45 : 0,
            }}
            transition={{
                duration: 0.3,
                ease: 'easeInOut',
            }}
        >
            {/* Fuselagem (corpo do avião) */}
            <path d="M3 12h18" />

            {/* Asas */}
            <path d="M8 8L12 12L8 16" />
            <path d="M16 8L12 12L16 16" />

            {/* Cauda */}
            <path d="M21 10v4" />

            {/* Cockpit/Nariz */}
            <circle cx="3" cy="12" r="1" fill="currentColor" />
        </motion.svg>
    );
};
