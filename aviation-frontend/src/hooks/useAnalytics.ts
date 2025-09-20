import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../config/api';

// Analytics API types
export interface FleetMetrics {
  total_aircraft: number;
  total_hours: number;
  avg_hours: number;
  compliance_rate: number;
  compliance_distribution: {
    compliant: number;
    warning: number;
    non_compliant: number;
  };
  upcoming_inspections: number;
  aircraft_by_type: Array<{
    type: string;
    count: number;
  }>;
  recent_inspections: number;
  last_updated: string;
}

export interface ComplianceTrend {
  date: string;
  compliant: number;
  warning: number;
  non_compliant: number;
  total: number;
}

export interface Alert {
  id: string;
  aircraft_id: string;
  aircraft_name: string;
  type: string;
  message: string;
  due_date: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'overdue' | 'due-soon' | 'approaching';
  days_overdue?: number;
  days_until_due?: number;
}

export interface PerformanceMetrics {
  utilization_rate: number;
  avg_monthly_hours: number;
  fleet_availability: number;
  maintenance_efficiency: number;
  cost_per_hour: number;
  total_operational_hours: number;
  aircraft_count: number;
}

export interface RequirementsSummary {
  total_requirements: number;
  priority_breakdown: Record<string, number>;
  authority_breakdown: Record<string, number>;
  coverage_rate: number;
  high_priority_requirements: number;
  aircraft_affected: number;
  last_review_date: string;
}

// Analytics Hooks
export const useFleetMetrics = () => {
  return useQuery<FleetMetrics>({
    queryKey: ['analytics', 'fleet-metrics'],
    queryFn: async () => {
      const response = await apiClient.get('/analytics/fleet-metrics');
      return response.data;
    },
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useComplianceTrends = (days: number = 30) => {
  return useQuery<ComplianceTrend[]>({
    queryKey: ['analytics', 'compliance-trends', days],
    queryFn: async () => {
      const response = await apiClient.get(`/analytics/compliance-trends?days=${days}`);
      return response.data;
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });
};

export const useAnalyticsAlerts = () => {
  return useQuery<Alert[]>({
    queryKey: ['analytics', 'alerts'],
    queryFn: async () => {
      const response = await apiClient.get('/analytics/alerts');
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const usePerformanceMetrics = () => {
  return useQuery<PerformanceMetrics>({
    queryKey: ['analytics', 'performance-metrics'],
    queryFn: async () => {
      const response = await apiClient.get('/analytics/performance-metrics');
      return response.data;
    },
    refetchInterval: 120000, // Refresh every 2 minutes
  });
};

export const useRequirementsSummary = () => {
  return useQuery<RequirementsSummary>({
    queryKey: ['analytics', 'requirements-summary'],
    queryFn: async () => {
      const response = await apiClient.get('/analytics/requirements-summary');
      return response.data;
    },
    refetchInterval: 600000, // Refresh every 10 minutes
  });
};