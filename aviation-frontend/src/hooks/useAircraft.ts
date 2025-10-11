import { useQuery } from '@tanstack/react-query';
import { embraerAircraft } from '../mocks/aircraftData';
import type { Aircraft } from '../types/aircraft';

// For now, using mock data. Replace with API calls when backend is ready
export function useAircraft() {
  return useQuery({
    queryKey: ['aircraft'],
    queryFn: async (): Promise<Aircraft[]> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return embraerAircraft;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAircraftDetails(id: string) {
  return useQuery({
    queryKey: ['aircraft', id],
    queryFn: async (): Promise<Aircraft | undefined> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return embraerAircraft.find((aircraft) => aircraft.id === id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}