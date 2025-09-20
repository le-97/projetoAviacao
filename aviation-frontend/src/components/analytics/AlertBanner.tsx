import { AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface AlertItem {
  id: string;
  aircraftName: string;
  type: 'inspection' | 'maintenance' | 'certification' | 'compliance';
  message: string;
  dueDate: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'overdue' | 'due-soon' | 'upcoming' | 'completed';
}

interface AlertBannerProps {
  alerts: AlertItem[];
  title?: string;
  maxItems?: number;
}

const AlertBanner = ({ alerts, title = "Alertas e Notificações", maxItems = 5 }: AlertBannerProps) => {
  const getAlertIcon = (type: AlertItem['type'], status: AlertItem['status']) => {
    if (status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    
    switch (type) {
      case 'inspection':
        return <Clock className="h-5 w-5" />;
      case 'maintenance':
        return <AlertTriangle className="h-5 w-5" />;
      case 'certification':
        return <XCircle className="h-5 w-5" />;
      case 'compliance':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getAlertColor = (priority: AlertItem['priority'], status: AlertItem['status']) => {
    if (status === 'completed') {
      return 'bg-green-50 border-green-200 text-green-800';
    }
    
    switch (priority) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: AlertItem['priority']) => {
    const labels = {
      critical: 'Crítico',
      high: 'Alto',
      medium: 'Médio',
      low: 'Baixo'
    };
    return labels[priority];
  };

  const getDaysUntilDue = (dueDate: string) => {
    return differenceInDays(new Date(dueDate), new Date());
  };

  const getStatusMessage = (dueDate: string, status: AlertItem['status']) => {
    const days = getDaysUntilDue(dueDate);
    
    if (status === 'completed') {
      return 'Concluído';
    }
    
    if (days < 0) {
      return `Vencido há ${Math.abs(days)} dia${Math.abs(days) !== 1 ? 's' : ''}`;
    } else if (days === 0) {
      return 'Vence hoje';
    } else if (days <= 7) {
      return `Vence em ${days} dia${days !== 1 ? 's' : ''}`;
    } else {
      return `Vence em ${format(new Date(dueDate), 'dd/MM/yyyy')}`;
    }
  };

  const sortedAlerts = alerts
    .sort((a, b) => {
      // Sort by priority first, then by due date
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, maxItems);

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum alerta ativo no momento</p>
          <p className="text-sm text-gray-500 mt-1">Todas as aeronaves estão em dia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">
          {alerts.length} alerta{alerts.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="space-y-3">
        {sortedAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.priority, alert.status)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.type, alert.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">
                    {alert.aircraftName}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white bg-opacity-50">
                      {getPriorityLabel(alert.priority)}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm mt-1">
                  {alert.message}
                </p>
                
                <p className="text-xs mt-2 font-medium">
                  {getStatusMessage(alert.dueDate, alert.status)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {alerts.length > maxItems && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            E mais {alerts.length - maxItems} alerta{alerts.length - maxItems !== 1 ? 's' : ''}...
          </p>
        </div>
      )}
    </div>
  );
};

export default AlertBanner;