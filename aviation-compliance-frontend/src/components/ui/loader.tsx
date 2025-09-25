import * as React from "react"
import { cn } from "@/lib/utils"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg' | 'xl'
  variant?: 'default' | 'aviation' | 'dots' | 'pulse'
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size = 'default', variant = 'default', ...props }, ref) => {
    const sizes = {
      sm: 'w-4 h-4',
      default: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    }

    if (variant === 'dots') {
      return (
        <div
          ref={ref}
          className={cn('flex items-center justify-center space-x-1', className)}
          {...props}
        >
          <div className={cn('bg-aviation-600 rounded-full animate-bounce', sizes[size])} style={{ animationDelay: '0ms' }}></div>
          <div className={cn('bg-aviation-600 rounded-full animate-bounce', sizes[size])} style={{ animationDelay: '150ms' }}></div>
          <div className={cn('bg-aviation-600 rounded-full animate-bounce', sizes[size])} style={{ animationDelay: '300ms' }}></div>
        </div>
      )
    }

    if (variant === 'pulse') {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-full bg-aviation-600 animate-pulse-slow',
            sizes[size],
            className
          )}
          {...props}
        />
      )
    }

    const spinnerVariants = {
      default: 'border-gray-200 border-t-aviation-600',
      aviation: 'border-aviation-200 border-t-aviation-600'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'animate-spin rounded-full border-2',
          sizes[size],
          spinnerVariants[variant === 'aviation' ? 'aviation' : 'default'],
          className
        )}
        {...props}
      />
    )
  }
)
Loader.displayName = "Loader"

export { Loader, type LoaderProps }