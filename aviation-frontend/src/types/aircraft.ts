export type AircraftCategory = 'commercial' | 'executive' | 'defense' | 'agriculture';

export type ComplianceStatus = 'compliant' | 'partial' | 'non-compliant';

export interface Aircraft {
  id: string;
  model: string;
  category: AircraftCategory;
  categoryLabel: string;
  categoryColor: string;
  badge?: string;
  image: string;
  heroImage?: string;
  description: string;
  specs: {
    capacity: string;
    range: string;
    speed: string;
    engines: string;
    length?: string;
    wingspan?: string;
    height?: string;
    maxWeight?: string;
    cruiseSpeed?: string;
    maxAltitude?: string;
  };
  highlights: string[];
  technologicalFeatures?: {
    title: string;
    description: string;
  }[];
  status: 'operational' | 'development' | 'legacy';
}

export interface Authority {
  code: string;
  country: string;
  name: string;
  flag: string;
  regulationsCount: number;
}

export interface Regulation {
  id: string;
  authority: string;
  reference: string;
  title: string;
  description: string;
  compliant: boolean;
  requirements: {
    description: string;
    met: boolean;
  }[];
}

export interface ComplianceCheckRequest {
  aircraftId: string;
  authorities: string[];
  flightType: string;
}

export interface ComplianceCheckResponse {
  status: ComplianceStatus;
  regulations: Regulation[];
  summary: {
    total: number;
    compliant: number;
    nonCompliant: number;
  };
}

export interface ComplianceCheck {
  id: string;
  date: string;
  aircraft: string;
  country: string;
  status: ComplianceStatus;
}

export interface DashboardStats {
  totalAircraft: number;
  checksCompleted: number;
  pendingItems: number;
  complianceRate: number;
}

export interface ChartData {
  month: string;
  comercial: number;
  executiva: number;
  defesa: number;
}

export interface CategoryData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}