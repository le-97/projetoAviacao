import axios from 'axios';
import { generateComplianceReport as generateLocalReport } from '../data/complianceEngine';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Flag para forçar uso do sistema local
const USE_LOCAL_COMPLIANCE = import.meta.env.VITE_USE_LOCAL_COMPLIANCE !== 'false';

// Tipos
export interface ComplianceCheck {
    regulation_reference: string;
    regulation_title: string;
    status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL_COMPLIANCE' | 'NOT_APPLICABLE';
    severity: 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO';
    findings: string[];
    recommendations: string[];
}

export interface AircraftInfo {
    manufacturer: string;
    model: string;
    variant?: string;
    type_certificate?: string;
    max_seats?: number;
    max_weight_kg?: number;
}

export interface ComplianceReport {
    aircraft_model: string;
    country: string;
    overall_status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL_COMPLIANCE';
    total_checks: number;
    compliant_checks: number;
    non_compliant_checks: number;
    critical_issues: number;
    checks: ComplianceCheck[];
    recommendations: string[];
    aircraft_info?: AircraftInfo;
    compliance_percentage?: number;
    authority?: string;
    check_date?: string;
}

export interface Authority {
    name: string;
    country: string;
    description: string;
}

export interface AircraftModel {
    id: string;
    model: string;
    variant?: string;
    manufacturer: string;
    description: string;
    supported: boolean;
}

// Funções da API

/**
 * Verifica conformidade de uma aeronave para um país específico
 * Usa sistema local completo se API não estiver disponível
 */
export async function checkCompliance(
    model: string,
    country: string
): Promise<ComplianceReport> {
    // Tenta usar sistema local primeiro se configurado
    if (USE_LOCAL_COMPLIANCE) {
        try {
            console.log('Usando sistema de conformidade local completo');
            return generateLocalReport(model, country);
        } catch (error) {
            console.error('Erro no sistema local:', error);
            throw error;
        }
    }

    // Fallback para API
    try {
        const response = await apiClient.get<ComplianceReport>(
            `/compliance/check/${encodeURIComponent(model)}/${encodeURIComponent(country)}`
        );
        return response.data;
    } catch (error) {
        // Se API falhar, tenta sistema local
        console.log('API indisponível, usando sistema local');
        try {
            return generateLocalReport(model, country);
        } catch (localError) {
            if (axios.isAxiosError(error)) {
                throw new Error(
                    error.response?.data?.error?.message ||
                    'Erro ao verificar conformidade'
                );
            }
            throw error;
        }
    }
}

/**
 * Lista todas as autoridades reguladoras disponíveis
 */
export async function getAuthorities(): Promise<Authority[]> {
    try {
        const response = await apiClient.get<Authority[]>('/authorities');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar autoridades:', error);
        return [];
    }
}

/**
 * Lista todos os modelos de aeronaves suportados
 */
export async function getAircraftModels(): Promise<AircraftModel[]> {
    try {
        const response = await apiClient.get<AircraftModel[]>('/models');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar modelos:', error);
        return [];
    }
}

/**
 * Verifica se a API está disponível
 */
export async function checkApiHealth(): Promise<boolean> {
    try {
        const response = await apiClient.get('/health');
        return response.status === 200;
    } catch (error) {
        return false;
    }
}

export default {
    checkCompliance,
    getAuthorities,
    getAircraftModels,
    checkApiHealth,
};
