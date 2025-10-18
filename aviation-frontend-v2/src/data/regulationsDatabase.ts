/**
 * Base de dados completa de regulações aeronáuticas
 * Inclui regulações da FAA, EASA e ANAC
 */

export interface Regulation {
  id: string;
  reference: string;
  title: string;
  description: string;
  authority: "FAA" | "EASA" | "ANAC";
  category:
    | "CERTIFICATION"
    | "OPERATION"
    | "MAINTENANCE"
    | "SAFETY"
    | "ENVIRONMENTAL"
    | "SECURITY";
  severity: "CRITICAL" | "MAJOR" | "MINOR" | "INFO";
  applicableTo: string[]; // Lista de categorias de aeronaves (e.g., 'COMMERCIAL', 'EXECUTIVE', 'MILITARY')
  requirements: string[];
  verificationMethod: string;
  documentationRequired: string[];
}

export const regulations: Regulation[] = [
  // FAA Regulations
  {
    id: "faa-far-25",
    reference: "14 CFR Part 25",
    title: "Airworthiness Standards: Transport Category Airplanes",
    description:
      "Estabelece padrões de aeronavegabilidade para aviões de categoria de transporte",
    authority: "FAA",
    category: "CERTIFICATION",
    severity: "CRITICAL",
    applicableTo: ["COMMERCIAL"],
    requirements: [
      "Estrutura deve suportar cargas limite com fator de segurança de 1.5",
      "Sistemas de controle de voo devem ter redundância",
      "Sistemas de proteção contra gelo em superfícies críticas",
      "Teste de fadiga estrutural para vida útil projetada",
      "Certificação de motores segundo FAR Part 33",
      "Sistema de oxigênio para operação acima de 10.000 pés",
      "Proteção contra raios e descargas eletrostáticas",
    ],
    verificationMethod:
      "Testes de certificação, análise estrutural, voos de teste",
    documentationRequired: [
      "Type Certificate Data Sheet (TCDS)",
      "Flight Manual",
      "Maintenance Manual",
      "Structural Repair Manual",
    ],
  },
  {
    id: "faa-far-23",
    reference: "14 CFR Part 23",
    title: "Airworthiness Standards: Normal Category Airplanes",
    description:
      "Padrões de aeronavegabilidade para aviões de categoria normal",
    authority: "FAA",
    category: "CERTIFICATION",
    severity: "CRITICAL",
    applicableTo: ["EXECUTIVE", "AGRICULTURAL"],
    requirements: [
      "Velocidade de stall não superior a 61 knots CAS",
      "Peso máximo de decolagem até 19.000 lbs (8.618 kg)",
      "Máximo de 19 assentos",
      "Sistema de controle deve permitir operação segura em todas as condições",
      "Proteção contra perda de controle por stall",
    ],
    verificationMethod: "Testes de voo, análise de desempenho",
    documentationRequired: [
      "Type Certificate",
      "Airplane Flight Manual",
      "Maintenance Instructions",
    ],
  },
  {
    id: "faa-far-91",
    reference: "14 CFR Part 91",
    title: "General Operating and Flight Rules",
    description: "Regras gerais de operação e voo para aeronaves civis",
    authority: "FAA",
    category: "OPERATION",
    severity: "MAJOR",
    applicableTo: ["COMMERCIAL", "EXECUTIVE", "MILITARY", "AGRICULTURAL"],
    requirements: [
      "Inspeções anuais obrigatórias",
      "Manutenção conforme programa aprovado",
      "Equipamentos de emergência requeridos",
      "Instrumentos de voo e navegação operacionais",
      "Registro e certificado de aeronavegabilidade válidos",
      "ELT (Emergency Locator Transmitter) instalado e operacional",
    ],
    verificationMethod: "Inspeção anual, verificação de registros",
    documentationRequired: [
      "Airworthiness Certificate",
      "Registration Certificate",
      "Operating Limitations",
      "Weight and Balance Data",
    ],
  },
  {
    id: "faa-far-121",
    reference: "14 CFR Part 121",
    title:
      "Operating Requirements: Domestic, Flag, and Supplemental Operations",
    description: "Requisitos operacionais para operações comerciais regulares",
    authority: "FAA",
    category: "OPERATION",
    severity: "CRITICAL",
    applicableTo: ["COMMERCIAL"],
    requirements: [
      "Programa de manutenção aprovado pela FAA",
      "Tripulação treinada e certificada",
      "Sistemas de comunicação redundantes",
      "Gravadores de voo (FDR e CVR) operacionais",
      "Sistema de alerta de proximidade do solo (GPWS)",
      "Sistema anticolisão (TCAS II)",
      "Navegação de precisão (RNP)",
      "Programa de gerenciamento de segurança operacional (SMS)",
    ],
    verificationMethod: "Auditorias regulares, inspeções de linha",
    documentationRequired: [
      "Operations Specifications",
      "Training Program Manual",
      "Maintenance Program",
      "Emergency Procedures Manual",
    ],
  },
  {
    id: "faa-far-135",
    reference: "14 CFR Part 135",
    title: "Operating Requirements: Commuter and On Demand Operations",
    description: "Requisitos para operações de táxi aéreo e fretamento",
    authority: "FAA",
    category: "OPERATION",
    severity: "MAJOR",
    applicableTo: ["EXECUTIVE"],
    requirements: [
      "Certificado de operador aéreo (AOC)",
      "Programa de manutenção aprovado",
      "Pilotos com certificação comercial",
      "Equipamentos de navegação IFR",
      "Seguro de responsabilidade civil",
      "Manual de operações aprovado",
    ],
    verificationMethod: "Auditoria de certificação, inspeções periódicas",
    documentationRequired: [
      "Air Operator Certificate",
      "Operations Manual",
      "Training Manual",
      "Maintenance Manual",
    ],
  },
  {
    id: "faa-ac-43-13-1b",
    reference: "AC 43-13-1B",
    title:
      "Acceptable Methods, Techniques, and Practices - Aircraft Inspection and Repair",
    description: "Métodos aceitáveis para inspeção e reparo de aeronaves",
    authority: "FAA",
    category: "MAINTENANCE",
    severity: "MAJOR",
    applicableTo: ["COMMERCIAL", "EXECUTIVE", "MILITARY", "AGRICULTURAL"],
    requirements: [
      "Inspeções programadas conforme manual do fabricante",
      "Registros de manutenção completos e atualizados",
      "Peças de reposição certificadas (PMA ou OEM)",
      "Técnicos certificados (A&P ou IA)",
      "Procedimentos de inspeção não destrutiva (NDI)",
      "Controle de corrosão e fadiga",
    ],
    verificationMethod: "Auditoria de registros, inspeção física",
    documentationRequired: [
      "Maintenance Logs",
      "Inspection Reports",
      "Repair Records",
      "Parts Traceability",
    ],
  },
  {
    id: "faa-tso-c179",
    reference: "TSO-C179",
    title: "Traffic Alert and Collision Avoidance System (TCAS) II",
    description: "Especificação técnica para sistemas anticolisão",
    authority: "FAA",
    category: "SAFETY",
    severity: "CRITICAL",
    applicableTo: ["COMMERCIAL"],
    requirements: [
      "TCAS II versão 7.1 ou superior instalado",
      "Integração com transponder Modo S",
      "Display de tráfego para pilotos",
      "Alertas de resolução (RA) funcionais",
      "Testes operacionais periódicos",
    ],
    verificationMethod: "Teste em voo, verificação de software",
    documentationRequired: [
      "Installation Certificate",
      "Test Reports",
      "Software Version",
    ],
  },
  {
    id: "faa-ac-120-92b",
    reference: "AC 120-92B",
    title: "Safety Management Systems for Aviation Service Providers",
    description:
      "Sistemas de gerenciamento de segurança para provedores de serviços",
    authority: "FAA",
    category: "SAFETY",
    severity: "MAJOR",
    applicableTo: ["COMMERCIAL", "EXECUTIVE"],
    requirements: [
      "Política de segurança documentada",
      "Gerenciamento de riscos de segurança",
      "Garantia de segurança operacional",
      "Promoção da segurança",
      "Treinamento em SMS para funcionários",
      "Relatório de incidentes e acidentes",
    ],
    verificationMethod: "Auditoria de sistema, análise de registros",
    documentationRequired: [
      "SMS Manual",
      "Risk Assessments",
      "Safety Reports",
      "Training Records",
    ],
  },

  // EASA Regulations
  {
    id: "easa-cs-25",
    reference: "CS-25",
    title: "Certification Specifications for Large Aeroplanes",
    description: "Especificações de certificação para aviões grandes",
    authority: "EASA",
    category: "CERTIFICATION",
    severity: "CRITICAL",
    applicableTo: ["COMMERCIAL"],
    requirements: [
      "Conformidade com requisitos de resistência estrutural",
      "Sistemas de controle com redundância adequada",
      "Proteção contra condições atmosféricas adversas",
      "Certificação de motores conforme CS-E",
      "Sistemas de proteção contra fogo",
      "Requisitos de desempenho em emergências",
      "Compatibilidade eletromagnética (EMC)",
    ],
    verificationMethod: "Testes de certificação EASA, análise de conformidade",
    documentationRequired: [
      "Type Certificate",
      "Flight Manual (AFM)",
      "Maintenance Planning Document",
      "Master Minimum Equipment List (MMEL)",
    ],
  },
  {
    id: "easa-cs-23",
    reference: "CS-23",
    title:
      "Certification Specifications for Normal, Utility, Aerobatic, and Commuter Category Aeroplanes",
    description:
      "Especificações para aeronaves de categorias normal e utilitária",
    authority: "EASA",
    category: "CERTIFICATION",
    severity: "CRITICAL",
    applicableTo: ["EXECUTIVE", "AGRICULTURAL"],
    requirements: [
      "Peso máximo certificado até 8.618 kg",
      "Capacidade máxima de 19 assentos",
      "Requisitos de estabilidade e controle",
      "Desempenho em condições críticas",
      "Proteção contra perda de controle",
    ],
    verificationMethod: "Testes de voo, análise estrutural",
    documentationRequired: [
      "EASA Type Certificate",
      "Aircraft Flight Manual",
      "Maintenance Manual",
    ],
  },
  {
    id: "easa-part-m",
    reference: "Part-M (Regulation (EU) 1321/2014)",
    title: "Continuing Airworthiness Requirements",
    description: "Requisitos de aeronavegabilidade continuada",
    authority: "EASA",
    category: "MAINTENANCE",
    severity: "CRITICAL",
    applicableTo: ["COMMERCIAL", "EXECUTIVE", "MILITARY", "AGRICULTURAL"],
    requirements: [
      "Organização de gerenciamento de aeronavegabilidade continuada (CAMO)",
      "Programa de manutenção aprovado",
      "Registros técnicos completos",
      "Certificado de revisão de aeronavegabilidade (ARC)",
      "Inspeções conforme cronograma aprovado",
      "Gerenciamento de diretrizes de aeronavegabilidade (ADs)",
    ],
    verificationMethod: "Auditoria CAMO, inspeção de registros",
    documentationRequired: [
      "Airworthiness Review Certificate",
      "Aircraft Technical Log",
      "Maintenance Program",
      "AD Compliance Record",
    ],
  },
  {
    id: "easa-part-145",
    reference: "Part-145 (Regulation (EU) 1321/2014)",
    title: "Approved Maintenance Organisations",
    description: "Requisitos para organizações de manutenção aprovadas",
    authority: "EASA",
    category: "MAINTENANCE",
    severity: "MAJOR",
    applicableTo: ["COMMERCIAL", "EXECUTIVE", "MILITARY", "AGRICULTURAL"],
    requirements: [
      "Certificado Part-145 válido",
      "Instalações e ferramentas adequadas",
      "Pessoal certificado e qualificado",
      "Sistema de qualidade implementado",
      "Procedimentos de manutenção aprovados",
      "Controle de peças e materiais",
      "Gestão de dados técnicos",
    ],
    verificationMethod: "Auditoria EASA, inspeções periódicas",
    documentationRequired: [
      "Part-145 Approval Certificate",
      "Maintenance Organisation Exposition (MOE)",
      "Quality Manual",
      "Training Records",
    ],
  },
  {
    id: "easa-part-ops",
    reference: "Part-CAT (Regulation (EU) 965/2012)",
    title: "Commercial Air Transport Operations",
    description: "Requisitos operacionais para transporte aéreo comercial",
    authority: "EASA",
    category: "OPERATION",
    severity: "CRITICAL",
    applicableTo: ["COMMERCIAL"],
    requirements: [
      "Certificado de operador aéreo (AOC) EASA",
      "Operations Manual aprovado",
      "Programa de treinamento de tripulação",
      "Sistema de gerenciamento de segurança (SMS)",
      "Equipamentos de navegação e comunicação",
      "Gravadores de voo (FDR/CVR)",
      "Sistema ACAS II (TCAS)",
      "GPWS/EGPWS operacional",
    ],
    verificationMethod: "Auditoria de certificação, inspeções em rampa",
    documentationRequired: [
      "Air Operator Certificate",
      "Operations Manual",
      "Training Program",
      "Safety Management Manual",
    ],
  },
  {
    id: "easa-part-ncc",
    reference: "Part-NCC (Regulation (EU) 965/2012)",
    title: "Non-Commercial Operations with Complex Motor-Powered Aircraft",
    description: "Operações não comerciais com aeronaves complexas",
    authority: "EASA",
    category: "OPERATION",
    severity: "MAJOR",
    applicableTo: ["EXECUTIVE"],
    requirements: [
      "Declaração de operador",
      "Operations Manual",
      "Tripulação qualificada",
      "Equipamentos de segurança",
      "Programa de manutenção",
      "Seguro adequado",
    ],
    verificationMethod: "Verificação de documentação, inspeções",
    documentationRequired: [
      "Operations Manual",
      "Crew Training Records",
      "Insurance Certificate",
      "Maintenance Program",
    ],
  },
  {
    id: "easa-cs-acns",
    reference: "CS-ACNS",
    title: "Airborne Communications, Navigation and Surveillance",
    description:
      "Requisitos para sistemas de comunicação, navegação e vigilância",
    authority: "EASA",
    category: "SAFETY",
    severity: "MAJOR",
    applicableTo: ["COMMERCIAL", "EXECUTIVE"],
    requirements: [
      "Equipamentos de comunicação VHF/HF",
      "Sistemas de navegação GPS/GNSS",
      "Transponder Modo S com ADS-B Out",
      "Sistema de vigilância TCAS/ACAS",
      "Conformidade com espaço aéreo europeu",
      "Link de dados (CPDLC) quando requerido",
    ],
    verificationMethod: "Certificação de equipamentos, testes funcionais",
    documentationRequired: [
      "Equipment Certificates",
      "Installation Approval",
      "Test Reports",
    ],
  },
  {
    id: "easa-annexiv-env",
    reference: "Annex IV - Environmental Protection",
    title: "Environmental Protection Requirements",
    description: "Requisitos de proteção ambiental para aeronaves",
    authority: "EASA",
    category: "ENVIRONMENTAL",
    severity: "MAJOR",
    applicableTo: ["COMMERCIAL", "EXECUTIVE"],
    requirements: [
      "Certificação de ruído conforme ICAO Annex 16",
      "Emissões de motores dentro dos limites CAEP",
      "Certificado de ruído válido",
      "Conformidade com regulamentos locais de ruído",
      "Plano de redução de emissões",
    ],
    verificationMethod: "Testes de ruído, análise de emissões",
    documentationRequired: [
      "Noise Certificate",
      "Emissions Certificate",
      "ICAO Annex 16 Compliance",
    ],
  },

  // ANAC Regulations
  {
    id: "anac-rbac-25",
    reference: "RBAC 25",
    title: "Requisitos de Aeronavegabilidade: Aviões Categoria Transporte",
    description: "Requisitos brasileiros para aviões de transporte",
    authority: "ANAC",
    category: "CERTIFICATION",
    severity: "CRITICAL",
    applicableTo: ["COMMERCIAL"],
    requirements: [
      "Conformidade com requisitos estruturais RBAC 25",
      "Sistemas de controle com redundância",
      "Proteção contra condições meteorológicas severas",
      "Certificação de motores conforme RBAC 33",
      "Sistemas de proteção contra fogo e gelo",
      "Testes de resistência e fadiga",
      "Compatibilidade eletromagnética",
    ],
    verificationMethod: "Certificação ANAC, testes de voo",
    documentationRequired: [
      "Certificado de Tipo (CT)",
      "Manual de Voo (AFM)",
      "Manual de Manutenção",
      "Lista Mestra de Equipamentos Mínimos (MMEL)",
    ],
  },
  {
    id: "anac-rbac-23",
    reference: "RBAC 23",
    title: "Requisitos de Aeronavegabilidade: Aviões Categoria Normal",
    description: "Requisitos brasileiros para aviões de categoria normal",
    authority: "ANAC",
    category: "CERTIFICATION",
    severity: "CRITICAL",
    applicableTo: ["EXECUTIVE", "AGRICULTURAL"],
    requirements: [
      "Peso máximo de decolagem até 8.618 kg",
      "Capacidade máxima de 19 assentos",
      "Requisitos de desempenho em decolagem e pouso",
      "Estabilidade e controle adequados",
      "Proteção contra perda de controle",
    ],
    verificationMethod: "Certificação ANAC, testes de desempenho",
    documentationRequired: [
      "Certificado de Tipo ANAC",
      "Manual de Voo da Aeronave",
      "Manual de Manutenção",
    ],
  },
  {
    id: "anac-rbac-91",
    reference: "RBAC 91",
    title: "Requisitos Gerais de Operação para Aeronaves Civis",
    description: "Regras gerais de operação no Brasil",
    authority: "ANAC",
    category: "OPERATION",
    severity: "MAJOR",
    applicableTo: ["COMMERCIAL", "EXECUTIVE", "MILITARY", "AGRICULTURAL"],
    requirements: [
      "Certificado de Aeronavegabilidade (CA) válido",
      "Certificado de Matrícula (CM)",
      "Inspeções anuais obrigatórias",
      "Manutenção conforme programa aprovado",
      "Equipamentos de emergência conforme regulamento",
      "ELT instalado e operacional",
      "Seguro RETA válido",
    ],
    verificationMethod: "Inspeção anual ANAC, verificação documental",
    documentationRequired: [
      "Certificado de Aeronavegabilidade",
      "Certificado de Matrícula",
      "Caderneta Individual da Aeronave (CIA)",
      "Apólice de Seguro RETA",
    ],
  },
  {
    id: "anac-rbac-121",
    reference: "RBAC 121",
    title:
      "Requisitos Operacionais: Operações Domésticas, de Bandeira e Suplementares",
    description: "Requisitos para operações de transporte aéreo regular",
    authority: "ANAC",
    category: "OPERATION",
    severity: "CRITICAL",
    applicableTo: ["COMMERCIAL"],
    requirements: [
      "Certificado de Operador Aéreo (COA) válido",
      "Especificações Operativas aprovadas",
      "Programa de manutenção aprovado pela ANAC",
      "Sistema de Gerenciamento da Segurança Operacional (SGSO)",
      "Gravadores de voo (FDR e CVR) operacionais",
      "Sistema TCAS II instalado",
      "GPWS/EGPWS operacional",
      "Tripulação treinada e certificada pela ANAC",
    ],
    verificationMethod: "Auditorias ANAC, inspeções em rampa (RAMP)",
    documentationRequired: [
      "Certificado de Operador Aéreo",
      "Especificações Operativas",
      "Manual Geral de Operações (MGO)",
      "Programa de Treinamento",
    ],
  },
  {
    id: "anac-rbac-135",
    reference: "RBAC 135",
    title: "Requisitos Operacionais: Operações Complementares e por Demanda",
    description: "Requisitos para táxi aéreo e operações por demanda",
    authority: "ANAC",
    category: "OPERATION",
    severity: "MAJOR",
    applicableTo: ["EXECUTIVE"],
    requirements: [
      "Certificado de Operador Aéreo (COA) RBAC 135",
      "Manual Geral de Operações aprovado",
      "Programa de manutenção aprovado",
      "Pilotos com CHT (Certificado de Habilitação Técnica)",
      "Equipamentos de navegação IFR",
      "Seguro RETA com cobertura adequada",
    ],
    verificationMethod: "Certificação ANAC, auditorias periódicas",
    documentationRequired: [
      "COA RBAC 135",
      "Manual Geral de Operações",
      "Programa de Treinamento",
      "Programa de Manutenção",
    ],
  },
  {
    id: "anac-rbac-43",
    reference: "RBAC 43",
    title: "Manutenção, Manutenção Preventiva, Recondicionamento e Alterações",
    description: "Requisitos para manutenção de aeronaves no Brasil",
    authority: "ANAC",
    category: "MAINTENANCE",
    severity: "MAJOR",
    applicableTo: ["COMMERCIAL", "EXECUTIVE", "MILITARY", "AGRICULTURAL"],
    requirements: [
      "Manutenção por organização homologada (RBAC 145)",
      "Registros de manutenção completos na CIA",
      "Peças de reposição aprovadas",
      "Mecânicos certificados pela ANAC",
      "Inspeções programadas conforme fabricante",
      "Cumprimento de Diretrizes de Aeronavegabilidade (DA)",
    ],
    verificationMethod: "Auditoria de registros, inspeção física",
    documentationRequired: [
      "Caderneta Individual da Aeronave",
      "Ordens de Serviço",
      "Relatórios de Inspeção",
      "Certificados de Peças",
    ],
  },
  {
    id: "anac-rbac-145",
    reference: "RBAC 145",
    title: "Organizações de Manutenção de Produto Aeronáutico",
    description: "Requisitos para oficinas de manutenção homologadas",
    authority: "ANAC",
    category: "MAINTENANCE",
    severity: "MAJOR",
    applicableTo: ["COMMERCIAL", "EXECUTIVE", "MILITARY", "AGRICULTURAL"],
    requirements: [
      "Certificado de Homologação de Empresa (CHE) válido",
      "Instalações adequadas e equipamentos calibrados",
      "Sistema de qualidade implementado",
      "Pessoal certificado (mecânicos e inspetores)",
      "Biblioteca técnica atualizada",
      "Controle de peças e materiais",
      "Procedimentos de manutenção aprovados",
    ],
    verificationMethod: "Auditoria ANAC, inspeções periódicas",
    documentationRequired: [
      "Certificado de Homologação",
      "Manual de Organização de Manutenção (MOM)",
      "Programa de Treinamento",
      "Certificados de Pessoal",
    ],
  },
  {
    id: "anac-rbha-11",
    reference: "RBHA 11 (IS 11-002)",
    title: "Procedimentos e Normas para Certificados de Tipo",
    description: "Procedimentos para certificação de tipo no Brasil",
    authority: "ANAC",
    category: "CERTIFICATION",
    severity: "CRITICAL",
    applicableTo: ["COMMERCIAL", "EXECUTIVE"],
    requirements: [
      "Base de certificação aprovada pela ANAC",
      "Demonstração de conformidade",
      "Plano de ensaios em voo aprovado",
      "Relatórios de conformidade",
      "Certificado de Tipo emitido pela ANAC",
      "Validação de certificados estrangeiros quando aplicável",
    ],
    verificationMethod: "Processo de certificação ANAC",
    documentationRequired: [
      "Certificado de Tipo",
      "Especificações de Certificado de Tipo",
      "Manual de Voo Aprovado",
      "Dados de Certificação",
    ],
  },
  {
    id: "anac-sgso",
    reference: "RBAC 121/135 - SGSO",
    title: "Sistema de Gerenciamento da Segurança Operacional",
    description: "Requisitos de SGSO para operadores aéreos brasileiros",
    authority: "ANAC",
    category: "SAFETY",
    severity: "CRITICAL",
    applicableTo: ["COMMERCIAL", "EXECUTIVE"],
    requirements: [
      "Política de segurança operacional documentada",
      "Gestão de riscos à segurança operacional",
      "Garantia da segurança operacional",
      "Promoção da segurança operacional",
      "Investigação de incidentes e acidentes",
      "Programa de prevenção de acidentes",
      "Treinamento em SGSO para colaboradores",
    ],
    verificationMethod: "Auditoria de SGSO, análise de indicadores",
    documentationRequired: [
      "Manual de SGSO",
      "Política de Segurança",
      "Relatórios de Análise de Risco",
      "Registros de Ocorrências",
    ],
  },
  {
    id: "anac-rbac-137",
    reference: "RBAC 137",
    title: "Operações Aeroagrícolas",
    description: "Requisitos para operações de aviação agrícola",
    authority: "ANAC",
    category: "OPERATION",
    severity: "MAJOR",
    applicableTo: ["AGRICULTURAL"],
    requirements: [
      "Certificado de Operador Aéreo específico para aeroagrícola",
      "Aeronaves certificadas para operação agrícola",
      "Equipamentos de aplicação homologados",
      "Pilotos com habilitação aeroagrícola",
      "Plano de voo específico para operação",
      "Equipamentos de proteção individual (EPI)",
      "Procedimentos de emergência para derramamento",
    ],
    verificationMethod: "Inspeção de operações, auditoria documental",
    documentationRequired: [
      "COA Aeroagrícola",
      "Certificado de Homologação de Equipamentos",
      "Manual de Operações Aeroagrícolas",
      "Registros de Aplicação",
    ],
  },
];

/**
 * Obtém regulações por autoridade
 */
export function getRegulationsByAuthority(
  authority: "FAA" | "EASA" | "ANAC",
): Regulation[] {
  return regulations.filter((reg) => reg.authority === authority);
}

/**
 * Obtém regulações aplicáveis a uma categoria de aeronave
 */
export function getRegulationsByCategory(category: string): Regulation[] {
  return regulations.filter((reg) => reg.applicableTo.includes(category));
}

/**
 * Obtém regulações por categoria regulatória
 */
export function getRegulationsByRegulatoryCategory(
  category: Regulation["category"],
): Regulation[] {
  return regulations.filter((reg) => reg.category === category);
}

/**
 * Obtém regulações críticas
 */
export function getCriticalRegulations(): Regulation[] {
  return regulations.filter((reg) => reg.severity === "CRITICAL");
}

/**
 * Busca regulações por texto
 */
export function searchRegulations(query: string): Regulation[] {
  const lowerQuery = query.toLowerCase();
  return regulations.filter(
    (reg) =>
      reg.title.toLowerCase().includes(lowerQuery) ||
      reg.description.toLowerCase().includes(lowerQuery) ||
      reg.reference.toLowerCase().includes(lowerQuery),
  );
}
