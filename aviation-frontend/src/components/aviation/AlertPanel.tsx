import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle,
  X,
  Clock,
  User,
  MapPin,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type AlertType = 'critical' | 'warning' | 'info' | 'success';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface Alert {
  id: string;
  type: AlertType;
  status: AlertStatus;
  title: string;
  description: string;
  location?: string;
  timestamp: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  category: string;
  priority: number; // 1-5, where 1 is highest
}

interface AlertPanelProps {
  alerts: Alert[];
  onAcknowledge?: (alertId: string) => void;
  onResolve?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  variant?: 'default' | 'compact' | 'detailed';
  showResolved?: boolean;
  maxHeight?: string;
  className?: string;
}

const alertConfig: Record<AlertType, {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ElementType;
  label: string;
}> = {
  critical: {
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: AlertTriangle,
    label: 'Crítico'
  },
  warning: {
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    icon: AlertCircle,
    label: 'Atenção'
  },
  info: {
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Info,
    label: 'Informação'
  },
  success: {
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle,
    label: 'Sucesso'
  }
};

const statusLabels: Record<AlertStatus, string> = {
  active: 'Ativo',
  acknowledged: 'Reconhecido',
  resolved: 'Resolvido'
};

export function AlertPanel({
  alerts,
  onAcknowledge,
  onResolve,
  onDismiss,
  variant = 'default',
  showResolved = false,
  maxHeight = '400px',
  className
}: AlertPanelProps) {
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());

  const filteredAlerts = alerts
    .filter(alert => showResolved || alert.status !== 'resolved')
    .sort((a, b) => {
      // Sort by priority first (1 = highest), then by timestamp (newest first)
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const toggleExpanded = (alertId: string) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(alertId)) {
      newExpanded.delete(alertId);
    } else {
      newExpanded.add(alertId);
    }
    setExpandedAlerts(newExpanded);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  const isCompact = variant === 'compact';
  const isDetailed = variant === 'detailed';

  const criticalCount = filteredAlerts.filter(a => a.type === 'critical' && a.status === 'active').length;
  const warningCount = filteredAlerts.filter(a => a.type === 'warning' && a.status === 'active').length;

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className={cn('pb-3', isCompact && 'pb-2')}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Central de Alertas
          </CardTitle>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {criticalCount} Críticos
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge className="bg-yellow-500 text-white">
                {warningCount} Avisos
              </Badge>
            )}
            <Badge variant="outline">
              {filteredAlerts.length} Total
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div 
          className="space-y-2 overflow-y-auto px-6 pb-6"
          style={{ maxHeight }}
        >
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-500" />
              <p className="font-medium">Nenhum alerta ativo</p>
              <p className="text-sm">Sistema operando normalmente</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const config = alertConfig[alert.type];
              const AlertIcon = config.icon;
              const isExpanded = expandedAlerts.has(alert.id);
              const canAcknowledge = alert.status === 'active' && onAcknowledge;
              const canResolve = alert.status !== 'resolved' && onResolve;

              return (
                <div
                  key={alert.id}
                  className={cn(
                    'border rounded-lg transition-all duration-200',
                    config.bgColor,
                    config.borderColor,
                    alert.status === 'active' && 'shadow-sm',
                    alert.status === 'resolved' && 'opacity-60'
                  )}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertIcon className={cn(
                        'h-5 w-5 flex-shrink-0 mt-0.5',
                        config.color
                      )} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={cn(
                                'text-sm font-medium',
                                config.color
                              )}>
                                {alert.title}
                              </span>
                              <Badge 
                                variant="outline" 
                                className={cn('text-xs', config.color)}
                              >
                                {config.label}
                              </Badge>
                              {alert.priority === 1 && (
                                <Badge className="bg-red-600 text-white text-xs">
                                  URGENTE
                                </Badge>
                              )}
                            </div>
                            
                            <p className={cn(
                              'text-sm',
                              config.color,
                              !isCompact && !isExpanded && 'line-clamp-2'
                            )}>
                              {alert.description}
                            </p>
                            
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTime(alert.timestamp)}
                                <span className="ml-1">({getTimeAgo(alert.timestamp)})</span>
                              </div>
                              
                              {alert.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {alert.location}
                                </div>
                              )}
                              
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className="text-xs">
                                  {alert.category}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {!isCompact && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleExpanded(alert.id)}
                                className="h-8 w-8 p-0"
                              >
                                {isExpanded ? 
                                  <EyeOff className="h-4 w-4" /> : 
                                  <Eye className="h-4 w-4" />
                                }
                              </Button>
                            )}
                            
                            {onDismiss && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDismiss(alert.id)}
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {(isExpanded || isDetailed) && (
                          <div className="mt-3 pt-3 border-t border-current/10 space-y-2">
                            <div className="text-xs text-muted-foreground">
                              <div><strong>Status:</strong> {statusLabels[alert.status]}</div>
                              <div><strong>Prioridade:</strong> {alert.priority}/5</div>
                              <div><strong>ID do Alerta:</strong> {alert.id}</div>
                            </div>
                            
                            {alert.acknowledgedBy && (
                              <div className="text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  Reconhecido por {alert.acknowledgedBy} em {formatTime(alert.acknowledgedAt!)}
                                </div>
                              </div>
                            )}
                            
                            {alert.resolvedBy && (
                              <div className="text-xs text-green-600">
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Resolvido por {alert.resolvedBy} em {formatTime(alert.resolvedAt!)}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        {(canAcknowledge || canResolve) && (
                          <div className="flex items-center gap-2 mt-3">
                            {canAcknowledge && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onAcknowledge(alert.id)}
                                className="text-xs"
                              >
                                Reconhecer
                              </Button>
                            )}
                            
                            {canResolve && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onResolve(alert.id)}
                                className="text-xs"
                              >
                                Resolver
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}