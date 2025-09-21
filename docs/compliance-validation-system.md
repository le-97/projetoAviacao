# Sistema de Validação de Conformidade Real

## Visão Geral

O sistema de validação de conformidade foi atualizado para implementar validações reais baseadas em:

- **Especificações técnicas das aeronaves Embraer**
- **Regulamentações específicas por país/autoridade**
- **Requisitos de certificação internacionais**
- **Acordos bilaterais de aviação**

## Arquitetura do Sistema

### ComplianceService (`src/services/complianceService.ts`)

#### Componentes Principais:

1. **Base de Dados de Regulamentações (`countryRegulations`)**
   - Requisitos específicos por país/autoridade
   - Regras especiais (ruído, emissões, certificações)
   - Acordos bilaterais (BASA, Mercosul, etc.)

2. **Especificações de Aeronaves (`aircraftSpecifications`)**
   - Dados técnicos reais dos modelos Embraer
   - Peso máximo de decolagem (MTOW)
   - Níveis de ruído (EPNdB)
   - Classe de emissões (CAEP)
   - Certificações existentes

3. **Motor de Validação (`validateCompliance`)**
   - Primeira tentativa: API backend
   - Fallback: Validação local inteligente
   - Análise de conformidade baseada em dados reais

## Modelos de Aeronaves Suportados

### E190 - Embraer E190
- **Categoria**: Comercial regional
- **Capacidade**: 96-114 passageiros
- **MTOW**: 56,000 kg
- **Nível de Ruído**: 85.7 EPNdB
- **Certificações**: ANAC, FAA, EASA

### E195 - Embraer E195
- **Categoria**: Comercial regional
- **Capacidade**: 124-146 passageiros
- **MTOW**: 61,900 kg
- **Nível de Ruído**: 87.2 EPNdB
- **Certificações**: ANAC, FAA, EASA

### Phenom 300
- **Categoria**: Business jet
- **Capacidade**: Até 11 passageiros
- **MTOW**: 8,150 kg
- **Nível de Ruído**: 78.5 EPNdB
- **Certificações**: ANAC, FAA, EASA

### Legacy 500
- **Categoria**: Business jet
- **Capacidade**: Até 12 passageiros
- **MTOW**: 14,200 kg
- **Nível de Ruído**: 82.1 EPNdB
- **Certificações**: ANAC, FAA, EASA

### KC-390 Millennium
- **Categoria**: Militar/Civil
- **Capacidade**: Até 80 passageiros
- **MTOW**: 87,000 kg
- **Nível de Ruído**: 92.5 EPNdB
- **Certificações**: ANAC, FAA

## Países e Regulamentações

### Estados Unidos (FAA)
- **Requisitos**: Type Certificate, Airworthiness Certificate, Aircraft Registration, Noise Certificate
- **Regras Especiais**: Restrições de ruído, limites de emissão
- **Acordos**: BASA (Brasil-EUA)

### União Europeia (EASA)
- **Requisitos**: EASA Type Certificate, Certificate of Airworthiness, Noise Certificate, Emission Certificate
- **Regras Especiais**: Conformidade ICAO Annex 16
- **Acordos**: BASA (Brasil-UE)

### Reino Unido (CAA)
- **Requisitos**: UK Type Certificate, Certificate of Airworthiness, Brexit Documentation
- **Status**: Requer documentação pós-Brexit específica
- **Complexidade**: Alta devido a mudanças regulatórias

### Canadá (Transport Canada)
- **Requisitos**: Type Certificate, Certificate of Airworthiness
- **Acordos**: BASA (Brasil-Canadá)

### Argentina (ANAC)
- **Requisitos**: Certificado de Tipo, Certificado de Aeronavegabilidade
- **Acordos**: Mercosul

## Algoritmo de Validação

### 1. Verificação de Certificações Existentes
```typescript
const hasBaseCertification = aircraft.certifications.some(cert => 
  cert === regulation.authority || 
  (regulation.authority === 'EASA' && cert === 'EASA') ||
  (regulation.authority === 'FAA' && cert === 'FAA')
);
```

### 2. Análise de Requisitos Específicos
- **Ruído**: Verifica se nível excede 90 EPNdB
- **Emissões**: Valida classe de emissões para regulamentações civis
- **Categoria Militar**: Requisitos especiais (ITAR, licenças de exportação)

### 3. Cálculo de Conformidade
- **Compliant (95%+)**: Certificação existente + requisitos atendidos
- **Pending (30-80%)**: Certificação existente + alguns requisitos pendentes
- **Non-compliant (<30%)**: Sem certificação + múltiplos requisitos

### 4. Estimativa de Tempo
- **Compliant**: Sem tempo adicional necessário
- **Pending**: 15 dias por item pendente + 30 dias base
- **Non-compliant**: 30 dias por item + 60 dias base

## Casos Especiais

### Brexit (Reino Unido)
- Requer documentação específica pós-Brexit
- Status padrão: Non-compliant
- Tempo estimado: 120+ dias

### Aeronaves Militares (KC-390)
- Requisitos ITAR para EUA
- Licenças de exportação militar
- Complexidade adicional para certificação civil

### Países sem Acordo Bilateral
- Processo de validação mais longo
- Requisitos adicionais de documentação
- Maior complexidade regulatória

## Integração com Backend

O sistema tenta primeiro conectar com a API backend:
```typescript
const response = await fetch(`${this.apiBaseUrl}/api/compliance/validate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ aircraft: aircraftModel, targetCountry: targetCountryCode })
});
```

Em caso de falha, utiliza a validação local como fallback.

## Melhorias Futuras

1. **Base de Dados Expandida**
   - Mais países e regulamentações
   - Acordos bilaterais atualizados
   - Requisitos específicos por região

2. **Validação Dinâmica**
   - Consulta em tempo real a bases de dados oficiais
   - Verificação automática de mudanças regulatórias
   - Alertas sobre novas exigências

3. **Machine Learning**
   - Predição de tempos de aprovação
   - Identificação de padrões de conformidade
   - Otimização de processos de certificação

4. **Integração com Sistemas Oficiais**
   - APIs das autoridades de aviação civil
   - Sistemas de certificação online
   - Verificação automática de status

## Deployment

O sistema está disponível em:
- **Desenvolvimento**: http://localhost:5173/
- **Produção**: https://purple-forest-0e3ce441e.1.azurestaticapps.net/

Para testar:
1. Selecione um modelo de aeronave
2. Escolha o país de destino
3. Clique em "Validar Conformidade"
4. Analise o relatório detalhado gerado