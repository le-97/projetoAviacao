# Prompt para Kombat AI - Frontend Sistema de Compliance Aeronáutica Embraer

## Contexto do Projeto
Crie um frontend moderno e profissional para o **Sistema de Compliance de Aviação da Embraer**, focado em conformidade regulatória de aeronaves comerciais, executivas, defesa e agrícolas.

## Stack Tecnológica Solicitada
- **Framework**: React 18+ com TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 3+ com animações suaves
- **UI Components**: Shadcn/UI (design system consistente)
- **Biblioteca de Ícones**: Lucide React
- **Gráficos**: Recharts para visualizações de dados
- **Estado Global**: Zustand ou React Query
- **Roteamento**: React Router v6+
- **HTTP Client**: Axios com interceptors

## Especificações de Design

### Tema Visual Embraer
- **Paleta de Cores Primárias**:
  - Azul Embraer: `#003DA5` (principal)
  - Azul Escuro: `#002366` (acentos)
  - Cinza Claro: `#F5F7FA` (background)
  - Branco: `#FFFFFF` (cards)
  - Verde Sucesso: `#10B981`
  - Vermelho Alerta: `#EF4444`
  - Amarelo Aviso: `#F59E0B`

- **Tipografia**:
  - Fonte Principal: Inter ou sistema (sans-serif)
  - Títulos: Font weight 600-700
  - Corpo: Font weight 400-500
  - Hierarquia visual clara

### Layout Responsivo
- Desktop-first com adaptação mobile
- Breakpoints: 1920px, 1440px, 1024px, 768px, 640px
- Grid system com 12 colunas
- Sidebar colapsável em mobile

## Estrutura de Páginas

### 1. Dashboard Principal
**Rota**: `/`

**Funcionalidades**:
- Cards de estatísticas (total de aeronaves, checks pendentes, compliance rate)
- Gráfico de linha: evolução de compliance nos últimos 12 meses
- Gráfico de pizza: distribuição por categoria de aeronave
- Lista de verificações recentes com status visual
- Alertas e notificações prioritárias

**Componentes**:
```typescript
<Dashboard>
  <StatsCards />
  <ComplianceChart />
  <CategoryDistribution />
  <RecentChecks />
  <AlertsPanel />
</Dashboard>
```

### 2. Catálogo de Aeronaves Embraer
**Rota**: `/aeronaves`

**Modelos a Implementar** (dados completos):

#### Aviação Comercial - E-Jets E2 (Nova Geração)
1. **E175-E2**
   - Capacidade: 80-90 passageiros
   - Alcance: 3,700 km (2,000 nm)
   - Categoria: Regional Jet
   - Motores: Pratt & Whitney PW1700G
   - Status: Em desenvolvimento

2. **E190-E2**
   - Capacidade: 97-114 passageiros (2x2)
   - Alcance: 5,278 km (2,850 nm)
   - Velocidade: Mach 0.82
   - Motores: Pratt & Whitney PW1919G
   - Redução de ruído: 68% vs geração anterior
   - Eficiência: 29% melhor por assento

3. **E195-E2**
   - Capacidade: 120-146 passageiros (2x2)
   - Alcance: 5,556 km (3,000 nm)
   - Velocidade: Mach 0.82
   - Motores: Pratt & Whitney PW1923G
   - Filtros HEPA: 99.7% eficácia
   - WiFi e streaming integrados

#### Aviação Comercial - E-Jets (Geração Anterior)
4. **E170**
   - Capacidade: 70-80 passageiros
   - Alcance: 3,700 km
   - Status: Em operação (legacy)

5. **E175**
   - Capacidade: 78-88 passageiros
   - Alcance: 3,900 km
   - Motores: GE CF34-8E

6. **E190**
   - Capacidade: 96-114 passageiros
   - Alcance: 4,800 km
   - Motores: GE CF34-10E

7. **E195**
   - Capacidade: 108-124 passageiros
   - Alcance: 4,200 km

#### Aviação Executiva
8. **Phenom 100EX**
   - Categoria: Very Light Jet
   - Capacidade: 4-6 passageiros
   - Alcance: 2,182 km (1,178 nm)
   - Velocidade: 732 km/h (395 kt)
   - Altitude máxima: 41,000 ft

9. **Phenom 300E**
   - Categoria: Light Jet
   - Capacidade: 6-9 passageiros
   - Alcance: 3,650 km (1,971 nm)
   - Velocidade: 839 km/h (453 kt)
   - Altitude máxima: 45,000 ft
   - Jato leve mais vendido do mundo

10. **Praetor 500**
    - Categoria: Midsize Jet
    - Capacidade: 7-9 passageiros
    - Alcance: 6,019 km (3,250 nm)
    - Velocidade: 863 km/h (466 kt)
    - Altitude máxima: 45,000 ft
    - Full fly-by-wire

11. **Praetor 600**
    - Categoria: Super Midsize Jet
    - Capacidade: 8-12 passageiros
    - Alcance: 7,778 km (4,200 nm)
    - Velocidade: 863 km/h (466 kt)
    - Altitude máxima: 45,000 ft
    - Maior alcance da categoria

#### Defesa & Segurança
12. **KC-390 Millennium**
    - Categoria: Transporte militar multimissão
    - Capacidade: 80 soldados / 26 ton carga
    - Alcance: 5,900 km
    - Velocidade: 870 km/h
    - Reabastecimento aéreo

13. **Super Tucano (EMB-314)**
    - Categoria: Aeronave de ataque leve
    - Tripulação: 2
    - Alcance: 720 km (combate)
    - Armamento: metralhadoras, foguetes, bombas

14. **P-99 / P-99A**
    - Categoria: Patrulha marítima
    - Baseado em: EMB-145
    - Missões: Vigilância, SAR

#### Aviação Agrícola
15. **Ipanema**
    - Categoria: Agrícola monomotor
    - Combustível: Etanol (100% certificado ANAC)
    - Capacidade: 900L de agroquímicos
    - Autonomia: 5 décadas em operação
    - Status: Único certificado para biocombustível

**Interface da Página**:
```typescript
<AircraftCatalog>
  <FilterPanel>
    - Categoria (Comercial, Executivo, Defesa, Agrícola)
    - Fabricante (Embraer)
    - Capacidade de passageiros
    - Alcance (km)
    - Status (Em operação, Em desenvolvimento)
  </FilterPanel>
  
  <AircraftGrid>
    {aircrafts.map(aircraft => (
      <AircraftCard
        image={aircraft.image}
        model={aircraft.model}
        category={aircraft.category}
        capacity={aircraft.capacity}
        range={aircraft.range}
        specs={aircraft.specs}
        onClick={() => navigate(`/aeronaves/${aircraft.id}`)}
      />
    ))}
  </AircraftGrid>
</AircraftCatalog>
```

### 3. Detalhes da Aeronave
**Rota**: `/aeronaves/:id`

**Seções**:
- Hero section com imagem 3D/render da aeronave
- Especificações técnicas completas (tabela)
- Regulamentações aplicáveis (tabs por autoridade)
- Histórico de compliance checks
- Documentação técnica (downloads)
- Gráfico de desempenho de compliance

### 4. Verificação de Compliance
**Rota**: `/compliance/verificar`

**Formulário Interativo**:
```typescript
<ComplianceChecker>
  <StepIndicator currentStep={step} />
  
  <Step1>
    <AircraftSelector
      models={embraerModels}
      searchable
      withSpecs
    />
  </Step1>
  
  <Step2>
    <CountrySelector
      countries={authorities}
      multiSelect
    />
  </Step2>
  
  <Step3>
    <FlightTypeSelector
      options={['Comercial', 'Privado', 'Carga', 'Instrução']}
    />
  </Step3>
  
  <ResultsPanel>
    <ComplianceStatus status={result.status} />
    <RegulationsList regulations={result.regulations} />
    <RequirementChecklist items={result.requirements} />
    <ActionButtons>
      - Gerar relatório PDF
      - Exportar JSON
      - Compartilhar
      - Salvar histórico
    </ActionButtons>
  </ResultsPanel>
</ComplianceChecker>
```

### 5. Regulamentações
**Rota**: `/regulamentacoes`

**Funcionalidades**:
- Busca full-text em regulamentações
- Filtros por autoridade (FAA, EASA, ANAC, ICAO)
- Filtros por categoria
- Timeline de atualizações
- Comparação entre regulamentações
- Sistema de favoritos

### 6. Histórico e Relatórios
**Rota**: `/historico`

**Features**:
- Tabela de checks realizados (paginação, ordenação)
- Filtros avançados (data, aeronave, status)
- Exportação em múltiplos formatos (PDF, Excel, JSON)
- Estatísticas de compliance por período
- Gráficos de tendências

## Componentes Reutilizáveis

### Design System
```typescript
// Componentes base do Shadcn/UI
- Button (variants: default, destructive, outline, ghost)
- Card (com Header, Content, Footer)
- Badge (status indicators)
- Input, Select, Textarea
- Dialog, Sheet (modais)
- Toast (notificações)
- Tabs, Accordion
- DataTable (com sorting, filtering, pagination)
- Avatar, Tooltip
- Progress Bar
- Skeleton (loading states)

// Componentes customizados
<AircraftCard />
<ComplianceStatusBadge />
<RegulationCard />
<StatCard />
<ChartContainer />
<FilterPanel />
<SearchBar />
<PageHeader />
<Sidebar />
<TopNav />
```

## Integrações de API

### Endpoints Esperados
```typescript
// Base URL
const API_BASE = 'https://aviation-compliance-api.azurewebsites.net/api/v1'

// Aircraft
GET    /aircraft                    // Lista de aeronaves
GET    /aircraft/:id                // Detalhes
GET    /aircraft/manufacturers      // Fabricantes
GET    /aircraft/categories         // Categorias

// Compliance
POST   /compliance/check            // Verificar compliance
GET    /compliance/history          // Histórico
GET    /compliance/history/:id      // Detalhes do check

// Regulations
GET    /regulations                 // Lista de regulamentações
GET    /regulations/:id             // Detalhes
GET    /regulations/authorities     // Autoridades

// Reports
POST   /reports/generate            // Gerar relatório
GET    /reports/:id/download        // Download PDF
```

### Axios Configuration
```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptors para loading, erros, autenticação
api.interceptors.request.use(config => {
  // Add loading state
  // Add auth token
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    // Handle errors globally
    // Show toast notifications
    return Promise.reject(error)
  }
)
```

## Experiência do Usuário (UX)

### Performance
- Lazy loading de rotas
- Imagens otimizadas (WebP, srcset)
- Code splitting por rota
- Virtual scrolling para listas grandes
- Debounce em buscas
- Cache de requisições (React Query)

### Acessibilidade (WCAG 2.1 AA)
- Contraste adequado (4.5:1 para texto)
- Navegação por teclado
- ARIA labels e roles
- Focus visible
- Skip links
- Screen reader friendly

### Animações
- Framer Motion para transições suaves
- Loading skeletons
- Micro-interações em botões
- Scroll animations
- Page transitions

### Estados de Loading e Erro
```typescript
// Loading states
<Skeleton /> // Durante carregamento inicial
<Spinner /> // Para ações rápidas
<Progress /> // Para uploads/downloads

// Empty states
<EmptyState
  icon={<Plane />}
  title="Nenhuma aeronave encontrada"
  description="Ajuste os filtros ou adicione uma nova aeronave"
  action={<Button>Adicionar Aeronave</Button>}
/>

// Error states
<ErrorBoundary fallback={<ErrorPage />}>
  <Routes />
</ErrorBoundary>
```

## Configurações de Projeto

### Estrutura de Pastas
```
src/
├── assets/
│   ├── images/
│   └── icons/
├── components/
│   ├── ui/                  # Shadcn components
│   ├── layout/              # Layout components
│   ├── features/            # Feature-specific
│   └── shared/              # Shared components
├── hooks/                   # Custom hooks
├── lib/                     # Utilities
│   ├── api.ts
│   ├── utils.ts
│   └── constants.ts
├── pages/                   # Route pages
├── stores/                  # Zustand stores
├── types/                   # TypeScript types
└── App.tsx
```

### TypeScript Types
```typescript
interface Aircraft {
  id: string
  manufacturer: string
  model: string
  variant?: string
  category: 'commercial' | 'executive' | 'defense' | 'agriculture'
  capacity: {
    passengers?: number
    cargo?: number
  }
  range: {
    value: number
    unit: 'km' | 'nm'
  }
  speed: {
    cruise: number
    max: number
  }
  specs: Record<string, any>
  image: string
  created_at: string
}

interface ComplianceCheck {
  id: string
  aircraft_id: string
  country: string
  flight_type: string
  status: 'compliant' | 'non-compliant' | 'partial'
  regulations: Regulation[]
  requirements: Requirement[]
  checked_at: string
}

interface Regulation {
  id: string
  authority_id: string
  reference: string
  title: string
  description: string
  category: string
  status: 'active' | 'superseded' | 'withdrawn'
  effective_date: string
}
```

## Requisitos Especiais

### Multi-idioma (i18n)
- Português (BR) - padrão
- Inglês (US)
- Espanhol (ES)

### Dark Mode
- Toggle no header
- Persistência no localStorage
- Cores adaptadas para contraste

### PWA (Progressive Web App)
- Service worker
- Offline mode básico
- Cache de assets
- Install prompt

### Analytics
- Google Analytics 4
- Eventos customizados:
  - compliance_check_completed
  - aircraft_viewed
  - regulation_searched
  - report_generated

## Entregáveis Finais

1. **Código Fonte**
   - Repository estruturado
   - README.md detalhado
   - ESLint + Prettier configurados
   - Testes unitários (Vitest)
   - Testes E2E (Playwright)

2. **Documentação**
   - Component storybook
   - API integration guide
   - Deployment guide
   - Style guide

3. **Build de Produção**
   - Bundle otimizado
   - Environment variables
   - Docker support (opcional)

## Referências Visuais
- Site oficial Embraer: https://www.embraer.com
- Material Design 3
- Airbus Skywise (inspiração UX)
- FlightAware (dashboards)

---

**Nota**: Este é um sistema enterprise-grade focado em segurança aeronáutica. Priorize clareza, precisão de dados e confiabilidade sobre recursos fancy. Todos os 15 modelos de aeronaves Embraer devem estar completamente implementados com dados reais e verificáveis.
