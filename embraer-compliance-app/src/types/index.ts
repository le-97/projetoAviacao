export type AircraftCategory = 'commercial' | 'executive' | 'defense' | 'agriculture';

export type ComplianceStatus = 'compliant' | 'non-compliant' | 'partial' | 'pending';

export type AuthorityType = 'FAA' | 'EASA' | 'ANAC' | 'ICAO';

export type FlightType = 'commercial' | 'private' | 'cargo' | 'instruction';

export interface Aircraft {
  id: string;
  manufacturer: string;
  model: string;
  variant?: string;
  category: AircraftCategory;
  capacity: {
    passengers?: number;
    cargo?: number;
    crew?: number;
  };
  range: {
    value: number;
    unit: 'km' | 'nm';
  };
  speed: {
    cruise: number;
    max: number;
    unit: 'km/h' | 'kt' | 'mach';
  };
  engines: {
    type: string;
    count: number;
  };
  specs: {
    altitude?: number;
    wingspan?: number;
    length?: number;
    height?: number;
    mtow?: number;
    [key: string]: string | number | undefined;
  };
  features?: string[];
  image?: string;
  status: 'active' | 'development' | 'legacy';
  certifications?: string[];
  created_at: string;
  updated_at: string;
}

export interface Regulation {
  id: string;
  authority_id: string;
  authority: AuthorityType;
  reference: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'superseded' | 'withdrawn';
  effective_date: string;
  last_updated: string;
  url?: string;
}

export interface Requirement {
  id: string;
  regulation_id: string;
  title: string;
  description: string;
  mandatory: boolean;
  status: ComplianceStatus;
  notes?: string;
}

export interface ComplianceCheck {
  id: string;
  aircraft_id: string;
  aircraft?: Aircraft;
  country: string;
  countries?: string[];
  flight_type: FlightType;
  status: ComplianceStatus;
  regulations: Regulation[];
  requirements: Requirement[];
  checked_at: string;
  checked_by?: string;
  notes?: string;
}

export interface DashboardStats {
  total_aircraft: number;
  pending_checks: number;
  compliance_rate: number;
  total_alerts: number;
  recent_checks: ComplianceCheck[];
  compliance_trend: {
    month: string;
    rate: number;
  }[];
  category_distribution: {
    category: AircraftCategory;
    count: number;
  }[];
}

export interface Authority {
  id: string;
  code: AuthorityType;
  name: string;
  country: string;
  website: string;
  description: string;
}

export interface Report {
  id: string;
  compliance_check_id: string;
  format: 'pdf' | 'excel' | 'json';
  generated_at: string;
  download_url: string;
}