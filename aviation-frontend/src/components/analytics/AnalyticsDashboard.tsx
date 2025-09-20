import { useState, useMemo } from 'react';
import { 
  Plane, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react';
import { useHealthCheck } from '../../hooks/useApi';
import { 
  useFleetMetrics, 
  useComplianceTrends, 
  useAnalyticsAlerts
} from '../../hooks/useAnalytics';
import MetricCard from './MetricCard';
import ComplianceChart from './ComplianceChart';
import TrendChart from './TrendChart';
import AlertBanner from './AlertBanner';
import LoadingSpinner from '../LoadingSpinner';
import ErrorDisplay from '../ErrorDisplay';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const { data: healthStatus } = useHealthCheck();
  
  // Use real analytics endpoints
  const { data: fleetMetrics, isLoading: metricsLoading, error: metricsError } = useFleetMetrics();
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
  const { data: trendData, isLoading: trendsLoading } = useComplianceTrends(days);
  const { data: alerts, isLoading: alertsLoading } = useAnalyticsAlerts();

  // Prepare compliance chart data
  const complianceChartData = useMemo(() => {
    if (!fleetMetrics?.compliance_distribution) return [];
    
    const dist = fleetMetrics.compliance_distribution;
    return [
      { name: 'Conforme', value: dist.compliant, color: '#10b981' },
      { name: 'Atenção', value: dist.warning, color: '#f59e0b' },
      { name: 'Não Conforme', value: dist.non_compliant, color: '#ef4444' }
    ];
  }, [fleetMetrics]);

  // Convert backend trend data to frontend format
  const convertedTrendData = useMemo(() => {
    if (!trendData) return [];
    
    return trendData.map(item => ({
      date: item.date,
      compliant: item.compliant,
      warning: item.warning,
      nonCompliant: item.non_compliant,
      total: item.total
    }));
  }, [trendData]);

  // Convert backend alerts to frontend format
  const convertedAlerts = useMemo(() => {
    if (!alerts) return [];
    
    return alerts.map(alert => ({
      id: alert.id,
      aircraftName: alert.aircraft_name,
      type: alert.type as 'inspection' | 'maintenance' | 'certification' | 'compliance',
      message: alert.message,
      dueDate: alert.due_date,
      priority: alert.priority,
      status: alert.status as 'overdue' | 'due-soon' | 'upcoming' | 'completed'
    }));
  }, [alerts]);

  const isLoading = metricsLoading || trendsLoading || alertsLoading;
  const hasError = metricsError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ErrorDisplay error="Erro ao carregar dados do dashboard" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Analytics</h1>
          <p className="text-gray-600 mt-1">Visão analítica da sua frota</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-aviation-500 focus:border-aviation-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
        </div>
      </div>

      {/* Status da API */}
      {healthStatus && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-800 font-medium">
              API Status: {healthStatus.status} - Versão {healthStatus.version}
            </span>
          </div>
        </div>
      )}

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Aeronaves"
          value={fleetMetrics?.total_aircraft || 0}
          icon={<Plane className="h-6 w-6" />}
          color="blue"
          trend={{
            value: 0,
            direction: 'stable',
            label: 'sem mudanças'
          }}
        />
        
        <MetricCard
          title="Horas de Voo Total"
          value={fleetMetrics?.total_hours.toLocaleString() || '0'}
          unit="h"
          icon={<Clock className="h-6 w-6" />}
          color="purple"
          trend={{
            value: 5.2,
            direction: 'up',
            label: 'este mês'
          }}
        />
        
        <MetricCard
          title="Taxa de Compliance"
          value={`${fleetMetrics?.compliance_rate.toFixed(1) || '0'}%`}
          icon={<CheckCircle className="h-6 w-6" />}
          color={
            !fleetMetrics 
              ? 'gray' 
              : fleetMetrics.compliance_rate > 80 
                ? 'green' 
                : fleetMetrics.compliance_rate > 60 
                  ? 'yellow' 
                  : 'red'
          }
          trend={{
            value: 2.1,
            direction: 'up',
            label: 'vs mês anterior'
          }}
        />
        
        <MetricCard
          title="Inspeções Próximas"
          value={fleetMetrics?.upcoming_inspections || 0}
          icon={<Calendar className="h-6 w-6" />}
          color="yellow"
          trend={{
            value: -1,
            direction: 'down',
            label: 'vs semana anterior'
          }}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplianceChart 
          data={complianceChartData}
          title="Distribuição de Status"
        />
        
        <TrendChart 
          data={convertedTrendData}
          title="Tendência de Compliance"
          type="area"
        />
      </div>

      {/* Alertas */}
      <AlertBanner alerts={convertedAlerts} />

      {/* KPIs Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Média de Horas por Aeronave"
          value={fleetMetrics?.avg_hours.toFixed(0) || '0'}
          unit="h"
          icon={<Activity className="h-6 w-6" />}
          color="gray"
          size="sm"
        />
        
        <MetricCard
          title="Aeronaves Críticas"
          value={fleetMetrics?.compliance_distribution.non_compliant || 0}
          icon={<AlertTriangle className="h-6 w-6" />}
          color="red"
          size="sm"
        />
        
        <MetricCard
          title="Custo Estimado Manutenção"
          value="R$ 45.230"
          icon={<DollarSign className="h-6 w-6" />}
          color="green"
          size="sm"
          trend={{
            value: -8.5,
            direction: 'down',
            label: 'vs mês anterior'
          }}
        />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;