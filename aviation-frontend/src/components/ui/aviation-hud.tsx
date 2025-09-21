import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface AviationHUDProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "warning" | "critical";
  animated?: boolean;
}

export function AviationHUD({ 
  className, 
  children, 
  variant = "primary",
  animated = true 
}: AviationHUDProps) {
  const variants = {
    primary: "border-blue-500/30 bg-blue-950/20 text-blue-100",
    secondary: "border-slate-400/30 bg-slate-950/20 text-slate-100", 
    warning: "border-yellow-500/30 bg-yellow-950/20 text-yellow-100",
    critical: "border-red-500/30 bg-red-950/20 text-red-100"
  };

  const Component = animated ? motion.div : "div";
  const animationProps = animated ? {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] as const }
  } : {};

  return (
    <Component
      className={cn(
        "relative border backdrop-blur-sm rounded-lg p-4",
        "before:absolute before:inset-0 before:rounded-lg before:border before:border-white/10",
        "after:absolute after:top-0 after:left-4 after:right-4 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent",
        variants[variant],
        className
      )}
      {...animationProps}
    >
      {/* Corner accents */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-current opacity-60" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-current opacity-60" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-current opacity-60" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-current opacity-60" />
      
      {children}
    </Component>
  );
}

interface AviationPanelProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
  status?: "online" | "offline" | "warning" | "error";
}

export function AviationPanel({ title, className, children, status = "online" }: AviationPanelProps) {
  const statusColors = {
    online: "text-green-400",
    offline: "text-gray-400", 
    warning: "text-yellow-400",
    error: "text-red-400"
  };

  return (
    <AviationHUD className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between border-b border-current/20 pb-2">
        <h3 className="text-sm font-mono uppercase tracking-wider">{title}</h3>
        <div className={cn("flex items-center space-x-2", statusColors[status])}>
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span className="text-xs font-mono">{status.toUpperCase()}</span>
        </div>
      </div>
      {children}
    </AviationHUD>
  );
}

interface AviationMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  className?: string;
}

export function AviationMetric({ label, value, unit, trend, className }: AviationMetricProps) {
  const trendIcons = {
    up: "▲",
    down: "▼", 
    stable: "■"
  };

  const trendColors = {
    up: "text-green-400",
    down: "text-red-400",
    stable: "text-blue-400"
  };

  return (
    <div className={cn("flex justify-between items-center py-1", className)}>
      <span className="text-xs text-current/70 font-mono uppercase">{label}</span>
      <div className="flex items-center space-x-1">
        <span className="text-lg font-mono font-bold">{value}</span>
        {unit && <span className="text-xs text-current/70">{unit}</span>}
        {trend && (
          <span className={cn("text-xs ml-1", trendColors[trend])}>
            {trendIcons[trend]}
          </span>
        )}
      </div>
    </div>
  );
}

export function AviationGrid({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={cn(
      "grid gap-4 p-4",
      "bg-gradient-to-br from-slate-950/50 to-blue-950/30",
      "min-h-screen relative overflow-hidden",
      className
    )}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}