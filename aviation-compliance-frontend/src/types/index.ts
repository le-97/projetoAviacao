// Aviation Compliance System Types

export interface Aircraft {
  id: string
  registration: string // Tail number
  model: string
  manufacturer: string
  type: 'commercial' | 'executive' | 'military' | 'cargo'
  capacity: number
  year: number
  status: 'operational' | 'maintenance' | 'grounded'
  lastInspection?: string
  nextInspectionDue?: string
  complianceStatus: ComplianceStatus
  certificates: Certificate[]
  specifications: AircraftSpecifications
  operationalHistory: OperationalRecord[]
}

export interface AircraftSpecifications {
  maxTakeoffWeight: number
  maxLandingWeight: number
  fuelCapacity: number
  range: number
  cruiseSpeed: number
  maxAltitude: number
  engines: EngineSpecification[]
}

export interface EngineSpecification {
  type: string
  manufacturer: string
  model: string
  thrust: number
  count: number
}

export interface Certificate {
  id: string
  type: CertificateType
  authority: RegulatoryAuthority
  number: string
  issuedDate: string
  expiryDate?: string
  status: 'valid' | 'expired' | 'suspended' | 'pending'
  document?: string // URL to certificate document
}

export type CertificateType = 
  | 'airworthiness'
  | 'type_certificate'
  | 'registration'
  | 'radio_license'
  | 'noise_certificate'
  | 'export_certificate'
  | 'conformity_of_production'

export interface RegulatoryAuthority {
  code: string
  name: string
  country: string
  flag: string
  region: string
}

export interface ComplianceStatus {
  overall: 'compliant' | 'non-compliant' | 'pending' | 'in-progress'
  riskLevel: 'low' | 'medium' | 'high'
  lastChecked: string
  nextCheckDue?: string
  score: number // 0-100
  details: ComplianceDetail[]
}

export interface ComplianceDetail {
  authority: string
  regulation: string
  status: 'compliant' | 'non-compliant' | 'pending'
  completionPercentage: number
  requirements: Requirement[]
  pendingItems: string[]
  lastVerified: string
}

export interface Requirement {
  id: string
  description: string
  category: string
  mandatory: boolean
  status: 'met' | 'not-met' | 'partial' | 'not-applicable'
  evidence?: string[]
  notes?: string
}

export interface ComplianceReport {
  id: string
  aircraft: string
  originCountry: string
  targetCountry: string
  generatedAt: string
  overallStatus: 'compliant' | 'non-compliant' | 'pending'
  riskLevel: 'low' | 'medium' | 'high'
  estimatedCompletionDays?: number
  regulations: RegulationDetail[]
  summary: ReportSummary
  recommendations: string[]
}

export interface AIComplianceReport extends ComplianceReport {
  aiInsights: AIInsight[]
  successProbability: number
  estimatedTimeline: string
  alternativeApproaches?: string[]
  riskMitigation: RiskMitigationPlan[]
}

export interface AIInsight {
  type: 'recommendation' | 'warning' | 'optimization' | 'trend'
  title: string
  description: string
  confidence: number // 0-1
  priority: 'low' | 'medium' | 'high'
  actionable: boolean
  estimatedImpact?: string
}

export interface RiskMitigationPlan {
  risk: string
  severity: 'low' | 'medium' | 'high'
  probability: number
  mitigationActions: string[]
  estimatedCost?: number
  estimatedTime?: string
}

export interface RegulationDetail {
  authority: string
  country: string
  status: 'compliant' | 'non-compliant' | 'pending'
  completionPercentage: number
  requirements: string[]
  pendingItems: string[]
  estimatedCompletionTime?: string
}

export interface ReportSummary {
  totalRequirements: number
  compliantRequirements: number
  pendingRequirements: number
  nonCompliantRequirements: number
  overallScore: number
}

export interface OperationalRecord {
  id: string
  date: string
  type: 'flight' | 'maintenance' | 'inspection' | 'incident'
  description: string
  location?: string
  duration?: number // in hours
  cost?: number
  technician?: string
  status: 'completed' | 'in-progress' | 'scheduled'
}

export interface GapAnalysis {
  id: string
  aircraftId: string
  targetMarket: string
  analysisDate: string
  gaps: Gap[]
  totalEstimatedCost: number
  totalEstimatedTime: string
  priority: 'low' | 'medium' | 'high'
  status: 'draft' | 'in-progress' | 'completed'
}

export interface Gap {
  id: string
  category: string
  requirement: string
  currentStatus: string
  targetStatus: string
  actions: Action[]
  estimatedCost: number
  estimatedTime: string
  risk: 'low' | 'medium' | 'high'
  dependencies: string[]
}

export interface Action {
  id: string
  description: string
  responsible: string
  dueDate: string
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked'
  cost: number
  dependencies: string[]
  notes?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'operator' | 'viewer'
  permissions: Permission[]
  avatar?: string
  lastLogin?: string
  organization: string
}

export interface Permission {
  resource: string
  actions: ('create' | 'read' | 'update' | 'delete')[]
}

export interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  actionLabel?: string
}

export interface DashboardStats {
  totalAircraft: number
  operationalAircraft: number
  complianceRate: number
  activeAlerts: number
  upcomingInspections: number
  recentActivity: Activity[]
}

export interface Activity {
  id: string
  type: 'compliance_check' | 'inspection' | 'certificate_update' | 'gap_analysis'
  aircraftRegistration: string
  description: string
  timestamp: string
  status: 'completed' | 'in-progress' | 'failed'
  user: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

// Form Types
export interface AircraftFormData {
  registration: string
  model: string
  manufacturer: string
  type: Aircraft['type']
  capacity: number
  year: number
  specifications: Partial<AircraftSpecifications>
}

export interface ComplianceCheckFormData {
  aircraftIds: string[]
  targetCountries: string[]
  checkType: 'full' | 'partial' | 'specific'
  specificRegulations?: string[]
  scheduledDate?: string
  recurring?: boolean
  recurringInterval?: 'weekly' | 'monthly' | 'quarterly' | 'annually'
}

// Chart Data Types
export interface ChartDataPoint {
  name: string
  value: number
  color?: string
  percentage?: number
}

export interface TimeSeriesDataPoint {
  date: string
  value: number
  category?: string
}

// Filter and Search Types
export interface AircraftFilters {
  status?: Aircraft['status'][]
  type?: Aircraft['type'][]
  manufacturer?: string[]
  complianceStatus?: ComplianceStatus['overall'][]
  registrationPattern?: string
  yearRange?: [number, number]
}

export interface ComplianceFilters {
  status?: ComplianceStatus['overall'][]
  riskLevel?: ComplianceStatus['riskLevel'][]
  authority?: string[]
  dateRange?: [string, string]
  scoreRange?: [number, number]
}

export interface SearchResult<T> {
  items: T[]
  totalCount: number
  query: string
  facets?: SearchFacet[]
}

export interface SearchFacet {
  field: string
  label: string
  values: Array<{
    value: string
    label: string
    count: number
  }>
}