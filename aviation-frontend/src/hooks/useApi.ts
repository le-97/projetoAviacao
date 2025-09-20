import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../config/api';
import type { 
  Aircraft, 
  ComplianceReport, 
  HealthStatus, 
  CreateAircraftRequest,
  ComplianceRequirement 
} from '../types/api';

// Health Check Query
export const useHealthCheck = () => {
  return useQuery<HealthStatus>({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await apiClient.get('/health');
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

// Aircraft Queries
export const useAircraft = () => {
  return useQuery<Aircraft[]>({
    queryKey: ['aircraft'],
    queryFn: async () => {
      const response = await apiClient.get('/aircraft');
      return response.data;
    },
  });
};

export const useAircraftById = (id: string) => {
  return useQuery<Aircraft>({
    queryKey: ['aircraft', id],
    queryFn: async () => {
      const response = await apiClient.get(`/aircraft/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Compliance Queries
export const useComplianceReport = (aircraftId: string) => {
  return useQuery<ComplianceReport>({
    queryKey: ['compliance', aircraftId],
    queryFn: async () => {
      const response = await apiClient.get(`/compliance/${aircraftId}`);
      return response.data;
    },
    enabled: !!aircraftId,
  });
};

export const useComplianceRequirements = () => {
  return useQuery<ComplianceRequirement[]>({
    queryKey: ['requirements'],
    queryFn: async () => {
      const response = await apiClient.get('/requirements');
      return response.data;
    },
  });
};

// Aircraft Mutations
export const useCreateAircraft = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (aircraftData: CreateAircraftRequest) => {
      const response = await apiClient.post('/aircraft', aircraftData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch aircraft list
      queryClient.invalidateQueries({ queryKey: ['aircraft'] });
    },
  });
};

export const useUpdateAircraft = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateAircraftRequest> }) => {
      const response = await apiClient.put(`/aircraft/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific aircraft and list
      queryClient.invalidateQueries({ queryKey: ['aircraft'] });
      queryClient.invalidateQueries({ queryKey: ['aircraft', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['compliance', variables.id] });
    },
  });
};

export const useDeleteAircraft = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/aircraft/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aircraft'] });
    },
  });
};