"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const aviationButtonVariants = cva(
  [
    "relative inline-flex items-center justify-center whitespace-nowrap font-mono font-semibold",
    "transition-all duration-300 ease-out transform-gpu cursor-pointer",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "overflow-hidden border-2",
    "uppercase tracking-wider text-sm",
    "backdrop-blur-sm",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800",
          "border-blue-400/50 text-blue-50",
          "shadow-lg shadow-blue-900/50",
          "hover:shadow-xl hover:shadow-blue-900/70",
          "focus-visible:ring-blue-400",
        ],
        secondary: [
          "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800",
          "border-slate-400/50 text-slate-50",
          "shadow-lg shadow-slate-900/50",
          "hover:shadow-xl hover:shadow-slate-900/70",
          "focus-visible:ring-slate-400",
        ],
        danger: [
          "bg-gradient-to-br from-red-600 via-red-700 to-red-800",
          "border-red-400/50 text-red-50",
          "shadow-lg shadow-red-900/50",
          "hover:shadow-xl hover:shadow-red-900/70",
          "focus-visible:ring-red-400",
        ],
      },
      size: {
        sm: "h-10 px-4 py-2 text-xs gap-2 rounded-md",
        md: "h-12 px-6 py-3 text-sm gap-3 rounded-lg",
        lg: "h-14 px-8 py-4 text-base gap-4 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const buttonVariants: Variants = {
  initial: {
    scale: 1,
    rotateX: 0,
    rotateY: 0,
  },
  hover: {
    scale: 1.02,
    rotateX: -2,
    rotateY: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.98,
    rotateX: 2,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
};

const glowVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  hover: {
    opacity: 1,
    scale: 1.1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const shimmerVariants: Variants = {
  initial: {
    x: "-100%",
    opacity: 0,
  },
  animate: {
    x: "100%",
    opacity: [0, 1, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatDelay: 3,
      ease: "easeInOut",
    },
  },
};

const scanlineVariants: Variants = {
  initial: {
    y: "-100%",
    opacity: 0,
  },
  animate: {
    y: "100%",
    opacity: [0, 0.8, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatDelay: 4,
      ease: "linear",
    },
  },
};

const loadingVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export interface AviationButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'>,
    VariantProps<typeof aviationButtonVariants> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  enableAnimations?: boolean;
}

const AviationButton = React.forwardRef<HTMLButtonElement, AviationButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      loading = false,
      enableAnimations = true,
      className,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();
    const shouldAnimate = enableAnimations && !shouldReduceMotion;
    const [isHovered, setIsHovered] = React.useState(false);
    const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
      }, 800);

      onClick?.(event);
    };

    const getVariantColors = () => {
      switch (variant) {
        case "primary":
          return {
            glow: "rgba(59, 130, 246, 0.4)",
            shimmer: "rgba(147, 197, 253, 0.6)",
            scanline: "rgba(59, 130, 246, 0.8)",
          };
        case "secondary":
          return {
            glow: "rgba(148, 163, 184, 0.4)",
            shimmer: "rgba(203, 213, 225, 0.6)",
            scanline: "rgba(148, 163, 184, 0.8)",
          };
        case "danger":
          return {
            glow: "rgba(239, 68, 68, 0.4)",
            shimmer: "rgba(252, 165, 165, 0.6)",
            scanline: "rgba(239, 68, 68, 0.8)",
          };
        default:
          return {
            glow: "rgba(59, 130, 246, 0.4)",
            shimmer: "rgba(147, 197, 253, 0.6)",
            scanline: "rgba(59, 130, 246, 0.8)",
          };
      }
    };

    const colors = getVariantColors();
    const isDisabled = loading || disabled;

    const LoadingSpinner = () => (
      <motion.div
        variants={shouldAnimate ? loadingVariants : {}}
        animate={shouldAnimate ? "animate" : {}}
        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
      />
    );

    return (
      <motion.button
        ref={ref}
        className={cn(aviationButtonVariants({ variant, size }), className)}
        variants={shouldAnimate ? buttonVariants : {}}
        initial={shouldAnimate ? "initial" : {}}
        whileHover={!isDisabled && shouldAnimate ? "hover" : {}}
        whileTap={!isDisabled && shouldAnimate ? "tap" : {}}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleClick}
        disabled={isDisabled}
        style={{ perspective: "1000px" }}
        {...props}
      >
        {/* Background glow effect */}
        {shouldAnimate && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
              filter: "blur(8px)",
            }}
            variants={glowVariants}
            initial="initial"
            animate={isHovered ? "hover" : "initial"}
          />
        )}

        {/* Shimmer effect */}
        {shouldAnimate && (
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <motion.div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent, ${colors.shimmer}, transparent)`,
                width: "30%",
                height: "100%",
              }}
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          </div>
        )}

        {/* Scanline effect */}
        {shouldAnimate && isHovered && (
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <motion.div
              className="absolute inset-x-0 h-0.5"
              style={{
                background: `linear-gradient(90deg, transparent, ${colors.scanline}, transparent)`,
                boxShadow: `0 0 10px ${colors.scanline}`,
              }}
              variants={scanlineVariants}
              initial="initial"
              animate="animate"
            />
          </div>
        )}

        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-10 rounded-lg"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '8px 8px',
          }}
        />

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {loading ? (
            <LoadingSpinner />
          ) : (
            icon && iconPosition === "left" && (
              <motion.span
                initial={shouldAnimate ? { x: -2, opacity: 0 } : {}}
                animate={shouldAnimate ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                {icon}
              </motion.span>
            )
          )}

          <motion.span
            initial={shouldAnimate ? { y: 1, opacity: 0 } : {}}
            animate={shouldAnimate ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="font-mono font-semibold"
          >
            {children}
          </motion.span>

          {!loading && icon && iconPosition === "right" && (
            <motion.span
              initial={shouldAnimate ? { x: 2, opacity: 0 } : {}}
              animate={shouldAnimate ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.2, delay: 0.15 }}
            >
              {icon}
            </motion.span>
          )}
        </span>

        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/20 pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
            initial={{
              width: 0,
              height: 0,
              x: "-50%",
              y: "-50%",
              opacity: 1,
            }}
            animate={{
              width: 120,
              height: 120,
              opacity: 0,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Corner indicators */}
        <div className="absolute top-1 right-1 w-1 h-1 bg-current opacity-60 rounded-full" />
        <div className="absolute bottom-1 left-1 w-1 h-1 bg-current opacity-60 rounded-full" />
      </motion.button>
    );
  }
);

AviationButton.displayName = "AviationButton";

export { AviationButton, aviationButtonVariants };