import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Plane,
  Settings,
  Pause,
  PlayCircle,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatusType = 
  | 'operational' 
  | 'maintenance' 
  | 'grounded' 
  | 'in-flight'
  | 'standby'
  | 'emergency'
  | 'offline'
  | 'pending'
  | 'active'
  | 'inactive';

export type StatusSize = 'sm' | 'md' | 'lg';
export type StatusVariant = 'dot' | 'badge' | 'icon' | 'full';

export interface StatusIndicatorProps {
  status: StatusType;
  size?: StatusSize;
  variant?: StatusVariant;
  label?: string;
  tooltip?: string;
  animate?: boolean;
  className?: string;
}

const statusConfig: Record<StatusType, {
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: React.ElementType;
  label: string;
  description: string;
}> = {
  operational: {
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    icon: CheckCircle,
    label: 'Operacional',
    description: 'Sistema funcionando normalmente'
  },
  maintenance: {
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
    icon: Settings,
    label: 'Manutenção',
    description: 'Em manutenção programada ou corretiva'
  },
  grounded: {
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    icon: XCircle,
    label: 'Em Solo',
    description: 'Indisponível para operação'
  },
  'in-flight': {
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    icon: Plane,
    label: 'Em Voo',
    description: 'Atualmente em operação de voo'
  },
  standby: {
    color: 'bg-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-700',
    icon: Pause,
    label: 'Standby',
    description: 'Aguardando próxima operação'
  },
  emergency: {
    color: 'bg-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    textColor: 'text-red-800',
    icon: AlertTriangle,
    label: 'Emergência',
    description: 'Situação de emergência ativa'
  },
  offline: {
    color: 'bg-gray-400',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-600',
    icon: XCircle,
    label: 'Offline',
    description: 'Sistema desconectado ou inativo'
  },
  pending: {
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    icon: Clock,
    label: 'Pendente',
    description: 'Aguardando ação ou aprovação'
  },
  active: {
    color: 'bg-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    icon: PlayCircle,
    label: 'Ativo',
    description: 'Ativamente em uso'
  },
  inactive: {
    color: 'bg-slate-500',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-700',
    icon: Pause,
    label: 'Inativo',
    description: 'Temporariamente inativo'
  }
};

const sizeConfig: Record<StatusSize, {
  dot: string;
  icon: string;
  text: string;
  badge: string;
}> = {
  sm: {
    dot: 'w-2 h-2',
    icon: 'w-3 h-3',
    text: 'text-xs',
    badge: 'text-xs px-2 py-0.5'
  },
  md: {
    dot: 'w-3 h-3',
    icon: 'w-4 h-4',
    text: 'text-sm',
    badge: 'text-sm px-2.5 py-1'
  },
  lg: {
    dot: 'w-4 h-4',
    icon: 'w-5 h-5',
    text: 'text-base',
    badge: 'text-base px-3 py-1.5'
  }
};

export function StatusIndicator({
  status,
  size = 'md',
  variant = 'badge',
  label,
  tooltip,
  animate = false,
  className
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const sizes = sizeConfig[size];
  const StatusIcon = config.icon;

  const displayLabel = label || config.label;
  const shouldAnimate = animate && (status === 'emergency' || status === 'in-flight' || status === 'active');

  const renderContent = () => {
    switch (variant) {
      case 'dot':
        return (
          <div
            className={cn(
              'rounded-full',
              config.color,
              sizes.dot,
              shouldAnimate && 'animate-pulse',
              className
            )}
            title={tooltip || config.description}
          />
        );

      case 'icon':
        return (
          <div
            className={cn(
              'flex items-center justify-center',
              config.textColor,
              className
            )}
            title={tooltip || config.description}
          >
            <StatusIcon 
              className={cn(
                sizes.icon,
                shouldAnimate && status === 'emergency' && 'animate-bounce',
                shouldAnimate && status === 'in-flight' && 'animate-pulse'
              )} 
            />
          </div>
        );

      case 'badge':
        return (
          <Badge
            className={cn(
              config.color,
              'text-white',
              sizes.badge,
              shouldAnimate && 'animate-pulse',
              className
            )}
            title={tooltip || config.description}
          >
            <StatusIcon className={cn(sizes.icon, 'mr-1')} />
            {displayLabel}
          </Badge>
        );

      case 'full':
        return (
          <div
            className={cn(
              'inline-flex items-center gap-2 px-3 py-2 rounded-lg border',
              config.bgColor,
              config.borderColor,
              config.textColor,
              sizes.text,
              shouldAnimate && 'animate-pulse',
              className
            )}
            title={tooltip || config.description}
          >
            <StatusIcon 
              className={cn(
                sizes.icon,
                shouldAnimate && status === 'emergency' && 'animate-bounce'
              )} 
            />
            <span className="font-medium">{displayLabel}</span>
            {status === 'emergency' && (
              <Activity className={cn(sizes.icon, 'animate-pulse')} />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return renderContent();
}

// Convenience components for common status types
export function OperationalStatus(props: Omit<StatusIndicatorProps, 'status'>) {
  return <StatusIndicator {...props} status="operational" />;
}

export function MaintenanceStatus(props: Omit<StatusIndicatorProps, 'status'>) {
  return <StatusIndicator {...props} status="maintenance" />;
}

export function EmergencyStatus(props: Omit<StatusIndicatorProps, 'status'>) {
  return <StatusIndicator {...props} status="emergency" animate={true} />;
}

export function FlightStatus(props: Omit<StatusIndicatorProps, 'status'>) {
  return <StatusIndicator {...props} status="in-flight" animate={true} />;
}