// TypeScript interfaces for Aviation Compliance API

export interface Aircraft {
  id: string;
  name: string;
  aircraft_type: string;
  current_hours: number;
  last_inspection: string;
  registration: string;
}

export interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  authority: string;
  frequency_hours: number;
  aircraft_types: string[];
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface ComplianceReport {
  aircraft_id: string;
  aircraft_name: string;
  requirements: ComplianceCheckResult[];
  overall_status: "COMPLIANT" | "NON_COMPLIANT" | "WARNING";
  next_inspection_due: string | null;
}

export interface ComplianceCheckResult {
  requirement_id: string;
  title: string;
  status: "COMPLIANT" | "NON_COMPLIANT" | "WARNING";
  hours_until_due: number | null;
  last_completed: string | null;
  authority: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface HealthStatus {
  status: "healthy" | "unhealthy";
  version: string;
  timestamp: string;
  database_connected: boolean;
  total_aircraft: number;
  total_requirements: number;
  uptime_seconds: number;
}

export interface APIError {
  detail: string;
  status_code: number;
}

export interface CreateAircraftRequest {
  name: string;
  aircraft_type: string;
  current_hours: number;
  last_inspection: string;
  registration: string;
}