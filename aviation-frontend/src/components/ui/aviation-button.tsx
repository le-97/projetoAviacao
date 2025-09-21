import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface AviationButtonProps {
  variant?: "primary" | "secondary" | "warning" | "critical" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function AviationButton({ 
  variant = "primary", 
  size = "md", 
  loading = false,
  className,
  children,
  disabled,
  onClick,
  type = "button"
}: AviationButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border-blue-500/50",
    secondary: "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white border-slate-500/50",
    warning: "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white border-yellow-500/50",
    critical: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border-red-500/50",
    ghost: "bg-transparent hover:bg-white/10 text-white border-white/20"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm", 
    lg: "px-6 py-3 text-base"
  };

  return (
    <motion.button
      type={type}
      className={cn(
        "relative font-mono uppercase tracking-wider border backdrop-blur-sm rounded-md",
        "transition-all duration-200 ease-out",
        "before:absolute before:inset-0 before:rounded-md before:border before:border-white/10",
        "after:absolute after:top-0 after:left-2 after:right-2 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      {/* Corner accents */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-current/60" />
      <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-current/60" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-current/60" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-current/60" />
      
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        <span>{children}</span>
      </span>
    </motion.button>
  );
}

interface AviationIconButtonProps {
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "warning" | "critical" | "ghost";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function AviationIconButton({ 
  icon, 
  variant = "primary", 
  size = "md",
  pulse = false,
  className,
  onClick,
  disabled
}: AviationIconButtonProps) {
  const variants = {
    primary: "bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border-blue-500/50",
    secondary: "bg-slate-600/20 hover:bg-slate-600/30 text-slate-300 border-slate-500/50",
    warning: "bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 border-yellow-500/50",
    critical: "bg-red-600/20 hover:bg-red-600/30 text-red-300 border-red-500/50",
    ghost: "bg-transparent hover:bg-white/10 text-white border-white/20"
  };

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base"
  };

  return (
    <motion.button
      className={cn(
        "relative border backdrop-blur-sm rounded-md flex items-center justify-center",
        "transition-all duration-200 ease-out",
        "before:absolute before:inset-0 before:rounded-md before:border before:border-white/10",
        pulse && "animate-pulse",
        variants[variant],
        sizes[size],
        className
      )}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      {icon}
    </motion.button>
  );
}