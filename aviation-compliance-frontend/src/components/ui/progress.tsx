import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'aviation' | 'success' | 'warning' | 'danger'
  showValue?: boolean
  animated?: boolean
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value = 0, 
    max = 100, 
    size = 'default', 
    variant = 'default',
    showValue = false,
    animated = false,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const sizes = {
      sm: 'h-2',
      default: 'h-3',
      lg: 'h-4'
    }

    const variants = {
      default: 'bg-aviation-600',
      aviation: 'aviation-gradient',
      success: 'bg-compliant-600',
      warning: 'bg-warning-600',
      danger: 'bg-danger-600'
    }

    return (
      <div className="w-full">
        {showValue && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso</span>
            <span className="text-sm font-medium text-gray-900">{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          ref={ref}
          className={cn(
            'w-full bg-gray-200 rounded-full overflow-hidden',
            sizes[size],
            className
          )}
          {...props}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              variants[variant],
              animated && 'animate-pulse-slow'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress, type ProgressProps }