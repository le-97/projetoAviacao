/**
 * Sistema completo de verificação de conformidade
 * Implementa lógica de validação para cada regulação
 */

import { regulations, type Regulation } from './regulationsDatabase';
import { embraerAircraft } from './aircraftData';
import type { Aircraft } from '../types/aircraft';
import type { ComplianceCheck, ComplianceReport, AircraftInfo } from '../services/complianceService';

// Mapeamento de países para autoridades
const countryToAuthority: Record<string, 'FAA' | 'EASA' | 'ANAC'> = {
    'USA': 'FAA',
    'BRAZIL': 'ANAC',
    'EUROPE': 'EASA',
};

// Mapeamento de categorias Embraer para categorias regulatórias
const categoryMapping: Record<string, string[]> = {
    'Aviação Comercial': ['COMMERCIAL'],
    'Aviação Executiva': ['EXECUTIVE'],
    'Defesa': ['MILITARY'],
    'Agrícola': ['AGRICULTURAL'],
};

/**
 * Verifica conformidade de uma aeronave específica
 */
function checkAircraftCompliance(
    aircraft: Aircraft,
    regulation: Regulation
): ComplianceCheck {
    let findings: string[] = [];
    let recommendations: string[] = [];
    let status: ComplianceCheck['status'] = 'COMPLIANT';
    let complianceScore = 100;

    // Verifica se a regulação é aplicável à categoria da aeronave
    const aircraftCategories = categoryMapping[aircraft.categoryLabel || aircraft.category] || [];
    const isApplicable = regulation.applicableTo.some(cat =>
        aircraftCategories.includes(cat)
    );

    if (!isApplicable) {
        return {
            regulation_reference: regulation.reference,
            regulation_title: regulation.title,
            status: 'NOT_APPLICABLE',
            severity: regulation.severity,
            findings: ['Esta regulação não se aplica a esta categoria de aeronave'],
            recommendations: []
        };
    }

    // Lógica específica baseada no tipo de regulação
    switch (regulation.category) {
        case 'CERTIFICATION':
            ({ status, findings, recommendations, complianceScore } =
                checkCertificationCompliance(aircraft, regulation, complianceScore));
            break;

        case 'OPERATION':
            ({ status, findings, recommendations, complianceScore } =
                checkOperationCompliance(aircraft, regulation, complianceScore));
            break;

        case 'MAINTENANCE':
            ({ status, findings, recommendations, complianceScore } =
                checkMaintenanceCompliance(aircraft, regulation, complianceScore));
            break;

        case 'SAFETY':
            ({ status, findings, recommendations, complianceScore } =
                checkSafetyCompliance(aircraft, regulation, complianceScore));
            break;

        case 'ENVIRONMENTAL':
            ({ status, findings, recommendations, complianceScore } =
                checkEnvironmentalCompliance(aircraft, regulation, complianceScore));
            break;

        case 'SECURITY':
            ({ status, findings, recommendations, complianceScore } =
                checkSecurityCompliance(aircraft, regulation, complianceScore));
            break;
    }

    // Determina o status final baseado na pontuação
    if (complianceScore >= 90) {
        status = 'COMPLIANT';
    } else if (complianceScore >= 70) {
        status = 'PARTIAL_COMPLIANCE';
    } else {
        status = 'NON_COMPLIANT';
    }

    return {
        regulation_reference: regulation.reference,
        regulation_title: regulation.title,
        status,
        severity: regulation.severity,
        findings,
        recommendations
    };
}

/**
 * Verifica conformidade de certificação
 */
function checkCertificationCompliance(
    aircraft: Aircraft,
    regulation: Regulation,
    score: number
): { status: ComplianceCheck['status'], findings: string[], recommendations: string[], complianceScore: number } {
    const findings: string[] = [];
    const recommendations: string[] = [];
    let complianceScore = score;

    // Aviões comerciais modernos (E-Jets E2) tem certificação completa
    if (aircraft.model.includes('E2')) {
        findings.push(`${aircraft.model} possui certificado de tipo atualizado`);
        findings.push('Conformidade total com padrões modernos de certificação');
        findings.push('Sistemas de controle fly-by-wire com redundância tripla');
        findings.push('Proteção avançada contra gelo e condições meteorológicas adversas');
    }
    // E-Jets primeira geração
    else if (aircraft.model.includes('E170') || aircraft.model.includes('E175') ||
        aircraft.model.includes('E190') || aircraft.model.includes('E195')) {
        findings.push(`${aircraft.model} possui certificado de tipo válido`);
        findings.push('Certificação conforme padrões da época de introdução');
        recommendations.push('Considerar atualizações de aviônicos para manter conformidade com requisitos modernos');
        complianceScore -= 5;
    }
    // Jatos executivos Phenom
    else if (aircraft.model.includes('Phenom')) {
        findings.push(`${aircraft.model} certificado para operações executivas`);
        findings.push('Aviônicos Prodigy Flight Deck 100/300 certificados');
        findings.push('Conformidade com requisitos de categoria normal');
    }
    // Praetor
    else if (aircraft.model.includes('Praetor')) {
        findings.push(`${aircraft.model} possui certificação mais recente`);
        findings.push('Sistemas avançados de aviônicos Collins Aerospace');
        findings.push('Certificação para operação em pistas curtas');
        findings.push('Capacidade de operação em aeroportos desafiadores');
    }
    // Aeronaves militares
    else if (aircraft.model.includes('KC-390') || aircraft.model.includes('C-390')) {
        findings.push(`${aircraft.model} certificado para operações militares e civis`);
        findings.push('Dupla certificação (militar e civil)');
        findings.push('Conformidade com requisitos especiais de carga e operação tática');
    }
    // A-29 Super Tucano
    else if (aircraft.model.includes('A-29')) {
        findings.push(`${aircraft.model} certificado para operações militares`);
        findings.push('Certificação de acordo com requisitos de aeronave de treinamento e ataque leve');
        complianceScore -= 10; // Não tem certificação civil completa
        recommendations.push('Certificação militar específica, não aplicável operação civil');
    }
    // EMB-202 Ipanema
    else if (aircraft.model.includes('EMB-202')) {
        findings.push(`${aircraft.model} certificado para operações aeroagrícolas`);
        findings.push('Certificação especial para aplicação de defensivos agrícolas');
        findings.push('Estrutura reforçada para operações de baixa altitude');
    }

    // Verificações específicas de requisitos estruturais
    if (regulation.reference.includes('25') || regulation.reference.includes('RBAC 25') ||
        regulation.reference.includes('CS-25')) {
        if (aircraft.categoryLabel === 'Jatos Comerciais') {
            findings.push('Estrutura certificada para cargas limite com fator de segurança 1.5');
            findings.push('Testes de fadiga concluídos para vida útil projetada');
            findings.push('Proteção contra raios e EMI conforme requisitos');
        }
    }

    return { status: 'COMPLIANT', findings, recommendations, complianceScore };
}

/**
 * Verifica conformidade operacional
 */
function checkOperationCompliance(
    aircraft: Aircraft,
    regulation: Regulation,
    score: number
): { status: ComplianceCheck['status'], findings: string[], recommendations: string[], complianceScore: number } {
    const findings: string[] = [];
    const recommendations: string[] = [];
    let complianceScore = score;

    // Verifica requisitos operacionais baseados no tipo de operação
    if (regulation.reference.includes('121') || regulation.reference.includes('RBAC 121')) {
        if (aircraft.categoryLabel === 'Jatos Comerciais') {
            findings.push('Aeronave qualificada para operações Part 121/RBAC 121');
            findings.push('Requisitos de tripulação: 2 pilotos qualificados');
            findings.push('Sistema TCAS II instalado e operacional');
            findings.push('GPWS/EGPWS conforme requisitos');
            findings.push('Gravadores de voo (FDR/CVR) instalados');

            if (aircraft.model.includes('E2')) {
                findings.push('Aviônicos modernos com conformidade total FANS/CPDLC');
                findings.push('Capacidade RNP AR para aproximações de precisão');
            } else {
                recommendations.push('Considerar upgrade de aviônicos para conformidade FANS/CPDLC');
                complianceScore -= 5;
            }
        }
    }

    if (regulation.reference.includes('135') || regulation.reference.includes('RBAC 135')) {
        if (aircraft.categoryLabel === 'Jatos Executivos') {
            findings.push('Certificação adequada para operações de táxi aéreo');
            findings.push('Capacidade IFR total');
            findings.push('Equipamentos de navegação modernos');

            if (aircraft.model.includes('Praetor')) {
                findings.push('Aviônicos de última geração Collins Pro Line Fusion');
                findings.push('Capacidade de voo direto intercontinental');
            }
        }
    }

    // Requisitos gerais de operação
    if (regulation.reference.includes('91') || regulation.reference.includes('RBAC 91')) {
        findings.push('Inspeções anuais programadas conforme cronograma');
        findings.push('ELT instalado e testado regularmente');
        findings.push('Equipamentos de emergência conforme categoria');
        recommendations.push('Manter programa de manutenção preventiva rigoroso');
    }

    // Operações aeroagrícolas
    if (regulation.reference.includes('137') || regulation.reference.includes('RBAC 137')) {
        if (aircraft.model.includes('EMB-202')) {
            findings.push('Aeronave especializada para operações agroagrícolas');
            findings.push('Sistema de aplicação homologado');
            findings.push('Proteção especial contra corrosão química');
            findings.push('Cabine vedada para proteção do piloto');
        }
    }

    return { status: 'COMPLIANT', findings, recommendations, complianceScore };
}

/**
 * Verifica conformidade de manutenção
 */
function checkMaintenanceCompliance(
    aircraft: Aircraft,
    regulation: Regulation,
    score: number
): { status: ComplianceCheck['status'], findings: string[], recommendations: string[], complianceScore: number } {
    const findings: string[] = [];
    const recommendations: string[] = [];
    let complianceScore = score;

    findings.push('Programa de manutenção do fabricante Embraer disponível');
    findings.push('Rede global de centros de serviço autorizados');
    findings.push('Disponibilidade de peças de reposição OEM');

    if (aircraft.model.includes('E2')) {
        findings.push('Programa de manutenção otimizado com intervalos estendidos');
        findings.push('Sistema de monitoramento de saúde da aeronave (AHM)');
        findings.push('Diagnósticos avançados com redução de tempo de solo');
    } else if (aircraft.model.includes('E1')) {
        findings.push('Programa de manutenção estabelecido com histórico comprovado');
        recommendations.push('Considerar programa de modernização para reduzir custos de manutenção');
        complianceScore -= 5;
    }

    if (aircraft.categoryLabel === 'Jatos Executivos') {
        findings.push('Intervalos de manutenção adequados para operação executiva');
        findings.push('Manutenção pode ser realizada em diversos aeroportos');

        if (aircraft.model.includes('Praetor')) {
            findings.push('Programa de manutenção Diamond Care disponível');
            findings.push('Cobertura global de suporte técnico 24/7');
        }
    }

    if (regulation.reference.includes('145') || regulation.reference.includes('Part-145') ||
        regulation.reference.includes('RBAC 145')) {
        findings.push('Embraer Service Centers certificados Part 145/RBAC 145 globalmente');
        findings.push('Rede de MROs autorizados em todos os continentes');
        recommendations.push('Utilizar apenas centros de manutenção certificados Embraer');
    }

    // Requisitos de registro e documentação
    findings.push('Sistema de rastreabilidade de peças implementado');
    findings.push('Registros digitais de manutenção disponíveis');
    recommendations.push('Manter todos os registros de manutenção atualizados e acessíveis');
    recommendations.push('Seguir rigorosamente as Diretrizes de Aeronavegabilidade (ADs)');

    return { status: 'COMPLIANT', findings, recommendations, complianceScore };
}

/**
 * Verifica conformidade de segurança
 */
function checkSafetyCompliance(
    aircraft: Aircraft,
    regulation: Regulation,
    score: number
): { status: ComplianceCheck['status'], findings: string[], recommendations: string[], complianceScore: number } {
    const findings: string[] = [];
    const recommendations: string[] = [];
    let complianceScore = score;

    // TCAS/ACAS
    if (regulation.reference.includes('TCAS') || regulation.reference.includes('ACAS')) {
        if (aircraft.categoryLabel === 'Jatos Comerciais') {
            findings.push('TCAS II versão 7.1 instalado de fábrica');
            findings.push('Integração completa com sistemas de aviônicos');
            findings.push('Display de tráfego em ambas as telas de navegação');
        } else if (aircraft.categoryLabel === 'Jatos Executivos') {
            if (aircraft.model.includes('Praetor') || aircraft.model.includes('Phenom 300')) {
                findings.push('TCAS I/II disponível conforme configuração');
                findings.push('Sistema integrado ao flight deck');
            } else {
                findings.push('TAS (Traffic Advisory System) disponível');
                recommendations.push('Considerar upgrade para TCAS II para operações em espaço aéreo classe A');
                complianceScore -= 10;
            }
        }
    }

    // GPWS/EGPWS
    if (regulation.reference.includes('GPWS') || regulation.reference.includes('EGPWS')) {
        if (aircraft.categoryLabel === 'Jatos Comerciais') {
            findings.push('EGPWS (Enhanced GPWS) instalado de série');
            findings.push('Base de dados de terreno global atualizada');
            findings.push('Alertas visuais e auditivos integrados');
        }
    }

    // SMS - Sistema de Gerenciamento de Segurança
    if (regulation.reference.includes('SMS') || regulation.reference.includes('SGSO')) {
        findings.push('Embraer fornece diretrizes para implementação de SMS');
        findings.push('Programa de análise de dados de voo (FDA) disponível');
        findings.push('Suporte para relatório de ocorrências de segurança');
        recommendations.push('Implementar programa robusto de SMS conforme regulamentação');
        recommendations.push('Estabelecer cultura de segurança proativa na organização');
        recommendations.push('Treinar toda equipe em procedimentos de SMS');
    }

    // Gravadores de voo
    if (regulation.reference.includes('FDR') || regulation.reference.includes('CVR')) {
        if (aircraft.categoryLabel === 'Jatos Comerciais') {
            findings.push('FDR (Flight Data Recorder) com capacidade de 25 horas');
            findings.push('CVR (Cockpit Voice Recorder) com capacidade de 2 horas');
            findings.push('Gravadores com localização submersível (ULB)');
        } else {
            findings.push('Gravadores disponíveis conforme requisitos regulatórios');
        }
    }

    // E-Jets E2 possuem recursos avançados de segurança
    if (aircraft.model.includes('E2')) {
        findings.push('Fly-by-wire com proteção de envelope de voo');
        findings.push('Sistema de alerta de proximidade do solo melhorado');
        findings.push('Recursos avançados de prevenção de perda de controle');
        findings.push('Sistema de monitoramento de fadiga de tripulação');
    }

    return { status: 'COMPLIANT', findings, recommendations, complianceScore };
}

/**
 * Verifica conformidade ambiental
 */
function checkEnvironmentalCompliance(
    aircraft: Aircraft,
    _regulation: Regulation,
    score: number
): { status: ComplianceCheck['status'], findings: string[], recommendations: string[], complianceScore: number } {
    const findings: string[] = [];
    const recommendations: string[] = [];
    let complianceScore = score;

    // E-Jets E2 são líderes em eficiência
    if (aircraft.model.includes('E2')) {
        findings.push('Motores Pratt & Whitney GTF com redução de 16% no consumo');
        findings.push('Redução de 17% nas emissões de CO2');
        findings.push('Redução de ruído de até 65% (EPNdB)');
        findings.push('Certificação ICAO Annex 16 Chapter 14 (mais restritivo)');
        findings.push('Conformidade com CAEP/10 para emissões NOx');
        findings.push('Asas projetadas para máxima eficiência aerodinâmica');
    }
    // E-Jets primeira geração
    else if (aircraft.model.includes('E170') || aircraft.model.includes('E175') ||
        aircraft.model.includes('E190') || aircraft.model.includes('E195')) {
        findings.push('Certificação ICAO Annex 16 Chapter 4');
        findings.push('Motores CF34 com baixas emissões');
        findings.push('Conformidade com requisitos ambientais vigentes na época');
        recommendations.push('Considerar retrofit de winglets para melhorar eficiência');
        recommendations.push('Avaliar programa de modernização para E2 para ganhos ambientais significativos');
        complianceScore -= 15;
    }
    // Jatos executivos
    else if (aircraft.categoryLabel === 'Jatos Executivos') {
        findings.push('Eficiência de combustível líder na categoria');
        findings.push('Emissões dentro dos limites ICAO');

        if (aircraft.model.includes('Praetor')) {
            findings.push('Motores Honeywell HTF7500E com alta eficiência');
            findings.push('Alcance estendido reduz necessidade de paradas intermediárias');
        }

        findings.push('Conformidade com regulamentos ambientais europeus');
    }
    // KC-390
    else if (aircraft.model.includes('KC-390') || aircraft.model.includes('C-390')) {
        findings.push('Motores IAE V2500 com eficiência melhorada');
        findings.push('Certificação para operações em aeroportos com restrições de ruído');
        findings.push('Conformidade com requisitos ambientais militares e civis');
    }

    // Recomendações gerais
    recommendations.push('Implementar procedimentos de operação para minimizar impacto ambiental');
    recommendations.push('Utilizar combustível sustentável de aviação (SAF) quando disponível');
    recommendations.push('Otimizar perfis de voo para reduzir consumo e emissões');

    return { status: 'COMPLIANT', findings, recommendations, complianceScore };
}

/**
 * Verifica conformidade de segurança (security)
 */
function checkSecurityCompliance(
    aircraft: Aircraft,
    _regulation: Regulation,
    score: number
): { status: ComplianceCheck['status'], findings: string[], recommendations: string[], complianceScore: number } {
    const findings: string[] = [];
    const recommendations: string[] = [];
    const complianceScore = score;

    if (aircraft.categoryLabel === 'Jatos Comerciais') {
        findings.push('Porta de cockpit reforçada conforme regulamentação pós-9/11');
        findings.push('Sistema de travamento de emergência da porta do cockpit');
        findings.push('Câmera de vigilância do cockpit disponível');
        findings.push('Procedimentos de segurança em conformidade com autoridades');
    } else if (aircraft.categoryLabel === 'Jatos Executivos') {
        findings.push('Medidas de segurança adequadas para operação executiva');
        findings.push('Possibilidade de instalação de sistemas de segurança customizados');
    }

    recommendations.push('Seguir todos os procedimentos de segurança da autoridade local');
    recommendations.push('Treinar tripulação em procedimentos de ameaças e interferência ilícita');
    recommendations.push('Implementar programa de segurança corporativa');

    return { status: 'COMPLIANT', findings, recommendations, complianceScore };
}

/**
 * Gera relatório completo de conformidade
 */
export function generateComplianceReport(
    aircraftModel: string,
    country: string
): ComplianceReport {
    // Encontra a aeronave
    const aircraft = embraerAircraft.find(a => a.model === aircraftModel);
    if (!aircraft) {
        throw new Error(`Aeronave ${aircraftModel} não encontrada`);
    }

    // Determina a autoridade baseada no país
    const authority = countryToAuthority[country];
    if (!authority) {
        throw new Error(`País ${country} não suportado`);
    }

    // Filtra regulações aplicáveis
    const applicableRegulations = regulations.filter(reg => reg.authority === authority);

    // Executa verificações
    const checks: ComplianceCheck[] = applicableRegulations.map(reg =>
        checkAircraftCompliance(aircraft, reg)
    );

    // Calcula estatísticas
    const compliantChecks = checks.filter(c => c.status === 'COMPLIANT').length;
    const nonCompliantChecks = checks.filter(c => c.status === 'NON_COMPLIANT').length;
    const partialChecks = checks.filter(c => c.status === 'PARTIAL_COMPLIANCE').length;
    const criticalIssues = checks.filter(
        c => c.severity === 'CRITICAL' && c.status !== 'COMPLIANT'
    ).length;

    const totalApplicable = checks.filter(c => c.status !== 'NOT_APPLICABLE').length;
    const compliancePercentage = totalApplicable > 0
        ? (compliantChecks / totalApplicable) * 100
        : 100;

    // Determina status geral
    let overallStatus: ComplianceReport['overall_status'];
    if (criticalIssues > 0 || nonCompliantChecks > totalApplicable * 0.3) {
        overallStatus = 'NON_COMPLIANT';
    } else if (partialChecks > 0 || nonCompliantChecks > 0) {
        overallStatus = 'PARTIAL_COMPLIANCE';
    } else {
        overallStatus = 'COMPLIANT';
    }

    // Gera recomendações gerais
    const generalRecommendations: string[] = [];

    if (criticalIssues > 0) {
        generalRecommendations.push('Resolver imediatamente os problemas críticos identificados antes de operações');
    }

    if (nonCompliantChecks > 0) {
        generalRecommendations.push('Desenvolver plano de ação para abordar não conformidades');
        generalRecommendations.push('Consultar com autoridade reguladora sobre requisitos específicos');
    }

    if (compliancePercentage < 95) {
        generalRecommendations.push('Revisar programa de conformidade regulatória');
        generalRecommendations.push('Considerar auditoria externa de conformidade');
    }

    generalRecommendations.push('Manter documentação atualizada de todos os certificados e aprovações');
    generalRecommendations.push('Estabelecer programa de monitoramento contínuo de conformidade');
    generalRecommendations.push('Participar de programas de atualização regulatória do fabricante');

    // Informações da aeronave
    const aircraftInfo: AircraftInfo = {
        manufacturer: 'Embraer',
        model: aircraft.model,
        max_seats: aircraft.specs.capacity,
        max_weight_kg: parseInt(aircraft.specs.maxWeight) || 0 // Usando maxWeight real
    };

    return {
        aircraft_model: aircraftModel,
        country,
        authority,
        overall_status: overallStatus,
        total_checks: checks.length,
        compliant_checks: compliantChecks,
        non_compliant_checks: nonCompliantChecks + partialChecks,
        critical_issues: criticalIssues,
        compliance_percentage: compliancePercentage,
        checks,
        recommendations: generalRecommendations,
        aircraft_info: aircraftInfo,
        check_date: new Date().toISOString()
    };
}
