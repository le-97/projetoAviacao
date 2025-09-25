import * as React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'aviation' | 'outline'
  size?: 'sm' | 'default' | 'lg'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseClasses = "inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    
    const variants = {
      default: "bg-aviation-100 text-aviation-800 border border-aviation-200",
      secondary: "bg-gray-100 text-gray-800 border border-gray-200",
      success: "bg-compliant-100 text-compliant-800 border border-compliant-200",
      warning: "bg-warning-100 text-warning-800 border border-warning-200", 
      danger: "bg-danger-100 text-danger-800 border border-danger-200",
      aviation: "aviation-gradient text-white shadow-aviation",
      outline: "text-aviation-700 border border-aviation-300 bg-transparent"
    }

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      default: "px-2.5 py-1 text-sm",
      lg: "px-3 py-1.5 text-base"
    }

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge, type BadgeProps }