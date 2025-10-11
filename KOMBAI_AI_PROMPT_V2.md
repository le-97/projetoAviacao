# Prompt Otimizado para Kombai AI - Sistema de Compliance Aeronáutica Embraer

## 🎯 Contexto e Objetivo
Desenvolva um **frontend enterprise de alta fidelidade** para o Sistema de Compliance de Aviação da Embraer, combinando o profissionalismo corporativo da Embraer com princípios de design de sistemas aeroespaciais (inspirado em NASA e Airbus).

---

## 🛠️ Stack Tecnológica (Kombai-Optimized)

### Core Framework
- **React 18.2+** com **TypeScript 5.0+** (strict mode)
- **Vite 5.0+** como build tool e dev server
- **React Router v6.20+** para roteamento SPA

### Styling & Design System
- **Tailwind CSS 3.4+** com configuração customizada
- **Shadcn/UI** como base do design system
- **Framer Motion 10+** para animações fluidas
- **Lucide React** para iconografia consistente

### Estado & Dados
- **React Query (TanStack Query) v5** para gerenciamento de servidor state
- **Zustand** para client state global
- **Axios 1.6+** com interceptors configurados

### Qualidade de Código
- **ESLint** + **Prettier** + **TypeScript strict**
- **Vitest** para testes unitários
- **Playwright** para testes E2E

---

## 🎨 Sistema de Design Visual

### Paleta de Cores Corporativa Embraer

#### Cores Primárias
```css
--embraer-blue-primary: #0E1C59;    /* Pantone 2766 C - Azul Embraer oficial */
--embraer-blue-dark: #0A1440;       /* Variante escura para hover/active */
--embraer-blue-light: #1A2D7A;      /* Variante clara para backgrounds */
--embraer-accent: #003DA5;          /* Azul acentuado para CTAs */
```

#### Cores Funcionais (NASA-inspired)
```css
--nasa-red: #FC3D21;                /* Alertas críticos */
--success-green: #10B981;           /* Compliance aprovado */
--warning-amber: #F59E0B;           /* Atenção necessária */
--error-red: #EF4444;               /* Não conformidade */
```

#### Cores Neutras
```css
--neutral-50: #F9FAFB;              /* Background geral */
--neutral-100: #F3F4F6;             /* Cards e containers */
--neutral-200: #E5E7EB;             /* Borders sutis */
--neutral-300: #D1D5DB;             /* Borders padrão */
--neutral-400: #9CA3AF;             /* Texto secundário */
--neutral-500: #6B7280;             /* Texto terciário */
--neutral-600: #4B5563;             /* Texto principal */
--neutral-700: #374151;             /* Headings */
--neutral-800: #1F2937;             /* Dark mode backgrounds */
--neutral-900: #111827;             /* Dark mode text */
```

### Tipografia Profissional

#### Fontes Sistema
```css
/* Primary: Sans-serif moderna e legível */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Helvetica Neue', Arial, sans-serif;

/* Monospace: Dados técnicos */
font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

#### Escala Tipográfica
```typescript
const typography = {
  // Headings
  h1: { size: '3.75rem', weight: 700, lineHeight: 1.1 },  // 60px
  h2: { size: '3rem', weight: 600, lineHeight: 1.2 },     // 48px
  h3: { size: '2.25rem', weight: 600, lineHeight: 1.3 },  // 36px
  h4: { size: '1.875rem', weight: 600, lineHeight: 1.4 }, // 30px
  h5: { size: '1.5rem', weight: 500, lineHeight: 1.5 },   // 24px
  h6: { size: '1.25rem', weight: 500, lineHeight: 1.5 },  // 20px
  
  // Body
  bodyLarge: { size: '1.125rem', weight: 400, lineHeight: 1.75 }, // 18px
  body: { size: '1rem', weight: 400, lineHeight: 1.625 },         // 16px
  bodySmall: { size: '0.875rem', weight: 400, lineHeight: 1.5 },  // 14px
  
  // UI Elements
  caption: { size: '0.75rem', weight: 400, lineHeight: 1.4 },     // 12px
  overline: { size: '0.75rem', weight: 600, lineHeight: 1.2, letterSpacing: '0.05em' },
}
```

### Layout & Espaçamento

#### Grid System (12 colunas)
```typescript
const breakpoints = {
  xs: '0px',      // Mobile portrait
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablet portrait
  lg: '1024px',   // Tablet landscape / Small desktop
  xl: '1440px',   // Desktop
  '2xl': '1920px' // Large desktop
}

const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
}
```

#### Componentes de Layout
- **Sidebar**: 280px fixo (desktop), colapsável para 64px (ícones), drawer (mobile)
- **Topbar**: 64px altura, sticky com shadow em scroll
- **Content Area**: Max-width 1400px com padding responsivo
- **Cards**: Border-radius 12px, shadow-lg em hover

---

## 📱 Estrutura de Páginas Detalhada

### 1. Dashboard Executivo (`/`)

#### Layout Superior (Hero Stats)
```typescript
<DashboardHero className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatCard
    icon={<Plane className="w-6 h-6" />}
    label="Aeronaves Embraer"
    value="15"
    trend={{ value: "+2", direction: "up", period: "este mês" }}
    color="blue"
  />
  
  <StatCard
    icon={<CheckCircle2 className="w-6 h-6" />}
    label="Checks Realizados"
    value="1,247"
    trend={{ value: "+18%", direction: "up", period: "vs. mês anterior" }}
    color="green"
  />
  
  <StatCard
    icon={<AlertTriangle className="w-6 h-6" />}
    label="Pendências"
    value="8"
    trend={{ value: "-3", direction: "down", period: "últimos 7 dias" }}
    color="amber"
  />
  
  <StatCard
    icon={<TrendingUp className="w-6 h-6" />}
    label="Taxa de Compliance"
    value="98.3%"
    trend={{ value: "+0.5%", direction: "up", period: "este trimestre" }}
    color="emerald"
  />
</DashboardHero>
```

#### Gráficos e Visualizações
```typescript
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
  {/* Gráfico Principal - 2/3 da largura */}
  <Card className="lg:col-span-2">
    <CardHeader>
      <CardTitle>Evolução de Compliance (12 meses)</CardTitle>
      <CardDescription>Taxa de conformidade por categoria</CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={complianceData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="comercial" stroke="#0E1C59" strokeWidth={3} />
          <Line type="monotone" dataKey="executiva" stroke="#003DA5" strokeWidth={3} />
          <Line type="monotone" dataKey="defesa" stroke="#10B981" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
  
  {/* Distribuição por Categoria - 1/3 da largura */}
  <Card>
    <CardHeader>
      <CardTitle>Distribuição de Aeronaves</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={110}
            fill="#8884d8"
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        {categoryData.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-sm font-medium">{cat.name}</span>
            </div>
            <span className="text-sm text-neutral-600">{cat.value} ({cat.percentage}%)</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</div>
```

#### Verificações Recentes (Tabela)
```typescript
<Card className="mt-8">
  <CardHeader>
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>Verificações Recentes</CardTitle>
        <CardDescription>Últimos 10 compliance checks realizados</CardDescription>
      </div>
      <Button variant="outline" size="sm">
        Ver Todos <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </div>
  </CardHeader>
  <CardContent>
    <DataTable
      columns={[
        { accessorKey: 'date', header: 'Data' },
        { accessorKey: 'aircraft', header: 'Aeronave' },
        { accessorKey: 'country', header: 'País' },
        { accessorKey: 'status', header: 'Status', cell: StatusBadge },
        { accessorKey: 'actions', header: '', cell: ActionsMenu },
      ]}
      data={recentChecks}
      pagination
      sorting
    />
  </CardContent>
</Card>
```

### 2. Catálogo de Aeronaves (`/aeronaves`)

#### Painel de Filtros (Sidebar Lateral)
```typescript
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  {/* Filtros - 1 coluna */}
  <aside className="lg:col-span-1">
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="text-lg">Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categoria */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Categoria</Label>
          <div className="space-y-2">
            <Checkbox label="Comercial (7)" value="commercial" />
            <Checkbox label="Executiva (4)" value="executive" />
            <Checkbox label="Defesa (3)" value="defense" />
            <Checkbox label="Agrícola (1)" value="agriculture" />
          </div>
        </div>
        
        {/* Capacidade de Passageiros */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Capacidade</Label>
          <Slider
            range
            min={1}
            max={150}
            defaultValue={[1, 150]}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-neutral-500">
            <span>1</span>
            <span>150 passageiros</span>
          </div>
        </div>
        
        {/* Alcance */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Alcance</Label>
          <Slider
            range
            min={0}
            max={8000}
            step={500}
            defaultValue={[0, 8000]}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-neutral-500">
            <span>0 km</span>
            <span>8,000 km</span>
          </div>
        </div>
        
        {/* Status Operacional */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">Status</Label>
          <div className="space-y-2">
            <Checkbox label="Em operação" value="operational" />
            <Checkbox label="Em desenvolvimento" value="development" />
            <Checkbox label="Legacy" value="legacy" />
          </div>
        </div>
        
        {/* Botões */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" size="sm" className="flex-1">
            Limpar
          </Button>
          <Button size="sm" className="flex-1">
            Aplicar
          </Button>
        </div>
      </CardContent>
    </Card>
  </aside>
  
  {/* Grid de Aeronaves - 3 colunas */}
  <div className="lg:col-span-3">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">15 Aeronaves Embraer</h2>
        <p className="text-sm text-neutral-600 mt-1">Modelos completos com especificações técnicas</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Select defaultValue="name">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nome A-Z</SelectItem>
            <SelectItem value="capacity">Capacidade</SelectItem>
            <SelectItem value="range">Alcance</SelectItem>
            <SelectItem value="category">Categoria</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex border rounded-lg">
          <Button variant="ghost" size="icon" className="rounded-r-none">
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-l-none border-l">
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Card de Aeronave */}
      <AircraftCard
        image="/images/aircraft/e195-e2.jpg"
        model="E195-E2"
        category="Comercial"
        categoryColor="#0E1C59"
        badge="Nova Geração"
        specs={{
          capacity: "120-146 passageiros",
          range: "5,556 km",
          speed: "Mach 0.82",
          engines: "Pratt & Whitney PW1923G"
        }}
        highlights={[
          "Mais silencioso da categoria",
          "29% mais eficiente",
          "Filtros HEPA 99.7%"
        ]}
        onClick={() => navigate('/aeronaves/e195-e2')}
      />
      
      {/* Repetir para todos os 15 modelos... */}
    </div>
  </div>
</div>
```

#### Componente AircraftCard
```typescript
<Card className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
  {/* Imagem com Overlay */}
  <div className="relative h-48 overflow-hidden rounded-t-xl bg-gradient-to-br from-neutral-100 to-neutral-200">
    <img
      src={image}
      alt={model}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    
    {/* Badge de Categoria */}
    <div className="absolute top-4 left-4">
      <Badge style={{ backgroundColor: categoryColor }} className="text-white font-semibold">
        {category}
      </Badge>
    </div>
    
    {/* Badge de Destaque (se houver) */}
    {badge && (
      <div className="absolute top-4 right-4">
        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
          <Sparkles className="w-3 h-3 mr-1" />
          {badge}
        </Badge>
      </div>
    )}
  </div>
  
  <CardContent className="p-6">
    {/* Título */}
    <h3 className="text-xl font-bold text-neutral-900 mb-3">{model}</h3>
    
    {/* Especificações em Grid */}
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="flex items-center gap-2 text-sm">
        <Users className="w-4 h-4 text-neutral-500" />
        <span className="text-neutral-700">{specs.capacity}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Gauge className="w-4 h-4 text-neutral-500" />
        <span className="text-neutral-700">{specs.speed}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Navigation className="w-4 h-4 text-neutral-500" />
        <span className="text-neutral-700">{specs.range}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Settings className="w-4 h-4 text-neutral-500" />
        <span className="text-neutral-700 truncate">{specs.engines}</span>
      </div>
    </div>
    
    {/* Destaques */}
    {highlights && (
      <div className="border-t pt-4 space-y-2">
        {highlights.slice(0, 2).map((highlight, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-neutral-600">{highlight}</span>
          </div>
        ))}
      </div>
    )}
  </CardContent>
  
  <CardFooter className="p-6 pt-0">
    <Button className="w-full group-hover:bg-embraer-blue-dark transition-colors">
      Ver Detalhes
      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
    </Button>
  </CardFooter>
</Card>
```

### 3. Detalhes da Aeronave (`/aeronaves/:id`)

#### Hero Section
```typescript
<section className="relative h-[500px] bg-gradient-to-br from-embraer-blue-primary to-embraer-blue-dark overflow-hidden">
  {/* Background Pattern */}
  <div className="absolute inset-0 opacity-10">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Grid pattern SVG */}
    </svg>
  </div>
  
  {/* Conteúdo */}
  <div className="container mx-auto px-6 h-full flex items-center">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
      {/* Informações */}
      <div className="text-white space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb className="text-white/70">
          <BreadcrumbItem>
            <Link to="/aeronaves">Aeronaves</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link to="/aeronaves?category=commercial">Comercial</Link>
          </BreadcrumbItem>
          <BreadcrumbItem current>E195-E2</BreadcrumbItem>
        </Breadcrumb>
        
        {/* Título */}
        <div>
          <Badge className="bg-white/20 text-white mb-4">
            Aviação Comercial
          </Badge>
          <h1 className="text-5xl font-bold mb-3">Embraer E195-E2</h1>
          <p className="text-xl text-white/80">
            O jato regional mais silencioso e eficiente da categoria
          </p>
        </div>
        
        {/* Stats Rápidos */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold">146</div>
            <div className="text-sm text-white/70">Passageiros</div>
          </div>
          <div>
            <div className="text-3xl font-bold">5,556</div>
            <div className="text-sm text-white/70">km Alcance</div>
          </div>
          <div>
            <div className="text-3xl font-bold">0.82</div>
            <div className="text-sm text-white/70">Mach</div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-4">
          <Button size="lg" variant="secondary">
            <FileText className="mr-2 w-5 h-5" />
            Download Specs
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
            <Share2 className="mr-2 w-5 h-5" />
            Compartilhar
          </Button>
        </div>
      </div>
      
      {/* Imagem 3D/Render */}
      <div className="relative">
        <img
          src="/images/aircraft/e195-e2-hero.png"
          alt="E195-E2"
          className="w-full h-auto drop-shadow-2xl"
        />
      </div>
    </div>
  </div>
</section>
```

#### Tabs de Conteúdo
```typescript
<Tabs defaultValue="specs" className="mt-8">
  <TabsList className="grid w-full grid-cols-5">
    <TabsTrigger value="specs">Especificações</TabsTrigger>
    <TabsTrigger value="regulations">Regulamentações</TabsTrigger>
    <TabsTrigger value="compliance">Compliance</TabsTrigger>
    <TabsTrigger value="docs">Documentação</TabsTrigger>
    <TabsTrigger value="history">Histórico</TabsTrigger>
  </TabsList>
  
  {/* Tab: Especificações Técnicas */}
  <TabsContent value="specs" className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Especificações Técnicas Completas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Capacidade */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-embraer-blue-primary" />
              Capacidade
            </h4>
            <dl className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <dt className="text-neutral-600">Configuração típica</dt>
                <dd className="font-semibold">2+2 (sem assento do meio)</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-neutral-600">Mínimo</dt>
                <dd className="font-semibold">120 passageiros</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-neutral-600">Máximo</dt>
                <dd className="font-semibold">146 passageiros</dd>
              </div>
            </dl>
          </div>
          
          {/* Performance */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-embraer-blue-primary" />
              Performance
            </h4>
            <dl className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <dt className="text-neutral-600">Velocidade de cruzeiro</dt>
                <dd className="font-semibold">870 km/h (Mach 0.82)</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-neutral-600">Altitude máxima</dt>
                <dd className="font-semibold">41,000 ft</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-neutral-600">Alcance máximo</dt>
                <dd className="font-semibold">5,556 km (3,000 nm)</dd>
              </div>
            </dl>
          </div>
          
          {/* Dimensões */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-embraer-blue-primary" />
              Dimensões
            </h4>
            <dl className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <dt className="text-neutral-600">Comprimento</dt>
                <dd className="font-semibold">41.50 m</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-neutral-600">Envergadura</dt>
                <dd className="font-semibold">35.10 m</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-neutral-600">Altura</dt>
                <dd className="font-semibold">10.92 m</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-neutral-600">Peso máximo</dt>
                <dd className="font-semibold">62,500 kg</dd>
              </div>
            </dl>
          </div>
          
          {/* Motores */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-embraer-blue-primary" />
              Propulsão
            </h4>
            <dl className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <dt className="text-neutral-600">Tipo</dt>
                <dd className="font-semibold">Turbofan Geared</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-neutral-600">Fabricante</dt>
                <dd className="font-semibold">Pratt & Whitney</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-neutral-600">Modelo</dt>
                <dd className="font-semibold">PW1923G</dd>
              </div>
              <div className="flex justify-between border-b pb-2">
                <dt className="text-neutral-600">Quantidade</dt>
                <dd className="font-semibold">2 motores</dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Destaques Tecnológicos */}
        <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
          <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            Destaques Tecnológicos
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div>
                <div className="font-semibold">29% Mais Eficiente</div>
                <div className="text-sm text-neutral-600">Redução de consumo por assento</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div>
                <div className="font-semibold">68% Menos Ruído</div>
                <div className="text-sm text-neutral-600">Mais silencioso da categoria</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div>
                <div className="font-semibold">Filtros HEPA</div>
                <div className="text-sm text-neutral-600">99.7% de eficácia</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </TabsContent>
  
  {/* Outras tabs... */}
</Tabs>
```

### 4. Verificador de Compliance (`/compliance/verificar`)

```typescript
<div className="max-w-4xl mx-auto py-8">
  {/* Progress Indicator */}
  <div className="mb-8">
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all",
              currentStep > index && "bg-emerald-500 text-white",
              currentStep === index && "bg-embraer-blue-primary text-white ring-4 ring-blue-200",
              currentStep < index && "bg-neutral-200 text-neutral-500"
            )}>
              {currentStep > index ? (
                <Check className="w-6 h-6" />
              ) : (
                index + 1
              )}
            </div>
            <span className={cn(
              "text-sm mt-2 font-medium",
              currentStep >= index ? "text-neutral-900" : "text-neutral-400"
            )}>
              {step.label}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div className={cn(
              "flex-1 h-1 mx-4 rounded-full transition-all",
              currentStep > index ? "bg-emerald-500" : "bg-neutral-200"
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
  
  {/* Step Content */}
  <Card>
    <CardHeader>
      <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
      <CardDescription>{steps[currentStep].description}</CardDescription>
    </CardHeader>
    
    <CardContent className="min-h-[400px]">
      {/* Step 1: Seleção de Aeronave */}
      {currentStep === 0 && (
        <div className="space-y-6">
          <div>
            <Label htmlFor="aircraft-search" className="text-base font-semibold mb-3 block">
              Buscar Aeronave Embraer
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                id="aircraft-search"
                type="text"
                placeholder="Digite o modelo (ex: E195-E2, Phenom 300E, KC-390...)"
                className="pl-10 h-12 text-lg"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Ou selecione da lista (15 modelos disponíveis)
            </Label>
            <ScrollArea className="h-[300px] rounded-lg border">
              <div className="p-4 space-y-2">
                {embraerAircraft.map((aircraft) => (
                  <button
                    key={aircraft.id}
                    onClick={() => selectAircraft(aircraft)}
                    className={cn(
                      "w-full p-4 rounded-lg border-2 transition-all text-left",
                      "hover:border-embraer-blue-primary hover:bg-blue-50",
                      selectedAircraft?.id === aircraft.id && "border-embraer-blue-primary bg-blue-50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-lg">{aircraft.model}</div>
                        <div className="text-sm text-neutral-600 mt-1">
                          {aircraft.category} • {aircraft.capacity} • {aircraft.range}
                        </div>
                      </div>
                      {selectedAircraft?.id === aircraft.id && (
                        <CheckCircle2 className="w-6 h-6 text-embraer-blue-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          {selectedAircraft && (
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                <span className="font-semibold">{selectedAircraft.model}</span> selecionada. 
                Especificações técnicas completas serão consideradas na verificação.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
      
      {/* Step 2: Seleção de País/Autoridade */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Selecione um ou mais países para verificar compliance
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {authorities.map((authority) => (
                <Card
                  key={authority.code}
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedAuthorities.includes(authority.code) && "ring-2 ring-embraer-blue-primary"
                  )}
                  onClick={() => toggleAuthority(authority.code)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <img
                          src={authority.flag}
                          alt={authority.country}
                          className="w-12 h-8 object-cover rounded shadow"
                        />
                        <div>
                          <div className="font-semibold text-lg">{authority.country}</div>
                          <div className="text-sm text-neutral-600 mt-1">{authority.name}</div>
                          <Badge variant="outline" className="mt-2">
                            {authority.regulationsCount} regulamentações
                          </Badge>
                        </div>
                      </div>
                      <Checkbox
                        checked={selectedAuthorities.includes(authority.code)}
                        onCheckedChange={() => toggleAuthority(authority.code)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Step 3: Tipo de Voo */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Tipo de operação de voo
            </Label>
            <RadioGroup value={flightType} onValueChange={setFlightType}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flightTypes.map((type) => (
                  <Card
                    key={type.value}
                    className={cn(
                      "cursor-pointer transition-all",
                      flightType === type.value && "ring-2 ring-embraer-blue-primary"
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                        <label htmlFor={type.value} className="cursor-pointer flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {type.icon}
                            <span className="font-semibold text-lg">{type.label}</span>
                          </div>
                          <p className="text-sm text-neutral-600">{type.description}</p>
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          </div>
          
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              O tipo de operação determina quais regulamentações e requisitos específicos 
              serão aplicados na verificação de compliance.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Step 4: Resultados */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {/* Status Geral */}
          <Alert className={cn(
            complianceResult.status === 'compliant' && "bg-emerald-50 border-emerald-200",
            complianceResult.status === 'partial' && "bg-amber-50 border-amber-200",
            complianceResult.status === 'non-compliant' && "bg-red-50 border-red-200"
          )}>
            <div className="flex items-center gap-3">
              {complianceResult.status === 'compliant' && (
                <>
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  <div>
                    <AlertTitle className="text-lg font-bold text-emerald-900">
                      ✅ Totalmente Conforme
                    </AlertTitle>
                    <AlertDescription className="text-emerald-800">
                      A aeronave {selectedAircraft.model} está em conformidade com todas as 
                      regulamentações aplicáveis para os países selecionados.
                    </AlertDescription>
                  </div>
                </>
              )}
              {/* Outros status... */}
            </div>
          </Alert>
          
          {/* Regulamentações Aplicáveis */}
          <Card>
            <CardHeader>
              <CardTitle>Regulamentações Aplicáveis</CardTitle>
              <CardDescription>
                {complianceResult.regulations.length} regulamentações verificadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {complianceResult.regulations.map((regulation, index) => (
                  <AccordionItem key={index} value={`regulation-${index}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-3">
                          <Badge>{regulation.authority}</Badge>
                          <span className="font-semibold">{regulation.reference}</span>
                        </div>
                        <Badge variant={regulation.compliant ? "success" : "destructive"}>
                          {regulation.compliant ? "Conforme" : "Não Conforme"}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-4">
                        <div>
                          <h5 className="font-semibold mb-2">{regulation.title}</h5>
                          <p className="text-sm text-neutral-600">{regulation.description}</p>
                        </div>
                        
                        <div>
                          <h6 className="font-semibold text-sm mb-2">Requisitos:</h6>
                          <ul className="space-y-2">
                            {regulation.requirements.map((req, reqIndex) => (
                              <li key={reqIndex} className="flex items-start gap-2 text-sm">
                                {req.met ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                                )}
                                <span className={req.met ? "" : "text-red-700 font-medium"}>
                                  {req.description}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      )}
    </CardContent>
    
    <CardFooter className="flex justify-between border-t pt-6">
      <Button
        variant="outline"
        onClick={previousStep}
        disabled={currentStep === 0}
      >
        <ChevronLeft className="mr-2 w-4 h-4" />
        Voltar
      </Button>
      
      <div className="flex gap-3">
        {currentStep === 3 && (
          <>
            <Button variant="outline">
              <Download className="mr-2 w-4 h-4" />
              Exportar PDF
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 w-4 h-4" />
              Compartilhar
            </Button>
          </>
        )}
        
        <Button
          onClick={nextStep}
          disabled={!canProceed()}
          className="min-w-[120px]"
        >
          {currentStep === 3 ? (
            "Nova Verificação"
          ) : (
            <>
              Continuar
              <ChevronRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </CardFooter>
  </Card>
</div>
```

---

## 🎭 Componentes UI Customizados

### Badges de Status
```typescript
const StatusBadge = ({ status }: { status: ComplianceStatus }) => {
  const variants = {
    compliant: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: <CheckCircle2 className="w-3 h-3" />
    },
    partial: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: <AlertTriangle className="w-3 h-3" />
    },
    "non-compliant": {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: <XCircle className="w-3 h-3" />
    }
  }
  
  const variant = variants[status]
  
  return (
    <Badge className={cn(
      "inline-flex items-center gap-1.5 font-semibold border",
      variant.bg,
      variant.text,
      variant.border
    )}>
      {variant.icon}
      {status === 'compliant' && 'Conforme'}
      {status === 'partial' && 'Parcial'}
      {status === 'non-compliant' && 'Não Conforme'}
    </Badge>
  )
}
```

---

## 🚀 Integração com API

### Configuração Axios
```typescript
// lib/api.ts
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://aviation-compliance-api.azurewebsites.net/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add loading state
    document.body.classList.add('loading')
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Remove loading state
    document.body.classList.remove('loading')
    
    return response
  },
  (error: AxiosError) => {
    // Remove loading state
    document.body.classList.remove('loading')
    
    // Handle errors globally
    if (error.response) {
      const status = error.response.status
      
      switch (status) {
        case 401:
          toast.error('Sessão expirada. Faça login novamente.')
          // Redirect to login
          window.location.href = '/login'
          break
        case 403:
          toast.error('Você não tem permissão para acessar este recurso.')
          break
        case 404:
          toast.error('Recurso não encontrado.')
          break
        case 500:
          toast.error('Erro interno do servidor. Tente novamente mais tarde.')
          break
        default:
          toast.error('Ocorreu um erro inesperado.')
      }
    } else if (error.request) {
      toast.error('Erro de conexão. Verifique sua internet.')
    }
    
    return Promise.reject(error)
  }
)

// API functions
export const aircraftAPI = {
  getAll: () => api.get<Aircraft[]>('/aircraft'),
  getById: (id: string) => api.get<Aircraft>(`/aircraft/${id}`),
  getManufacturers: () => api.get<string[]>('/aircraft/manufacturers'),
  getCategories: () => api.get<string[]>('/aircraft/categories'),
}

export const complianceAPI = {
  check: (data: ComplianceCheckRequest) => api.post<ComplianceCheckResponse>('/compliance/check', data),
  getHistory: () => api.get<ComplianceCheck[]>('/compliance/history'),
  getHistoryById: (id: string) => api.get<ComplianceCheck>(`/compliance/history/${id}`),
}

export const regulationsAPI = {
  getAll: (params?: RegulationParams) => api.get<Regulation[]>('/regulations', { params }),
  getById: (id: string) => api.get<Regulation>(`/regulations/${id}`),
  getAuthorities: () => api.get<Authority[]>('/regulations/authorities'),
}

export const reportsAPI = {
  generate: (data: ReportRequest) => api.post<ReportResponse>('/reports/generate', data),
  download: (id: string) => api.get(`/reports/${id}/download`, { responseType: 'blob' }),
}
```

---

## ⚡ Performance & Otimizações

### Code Splitting
```typescript
// App.tsx
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoadingSpinner } from './components/ui/loading-spinner'

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'))
const AircraftCatalog = lazy(() => import('./pages/AircraftCatalog'))
const AircraftDetails = lazy(() => import('./pages/AircraftDetails'))
const ComplianceChecker = lazy(() => import('./pages/ComplianceChecker'))
const Regulations = lazy(() => import('./pages/Regulations'))
const History = lazy(() => import('./pages/History'))

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner fullscreen />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/aeronaves" element={<AircraftCatalog />} />
          <Route path="/aeronaves/:id" element={<AircraftDetails />} />
          <Route path="/compliance/verificar" element={<ComplianceChecker />} />
          <Route path="/regulamentacoes" element={<Regulations />} />
          <Route path="/historico" element={<History />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
```

### React Query Configuration
```typescript
// lib/react-query.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// Custom hooks
export function useAircraft() {
  return useQuery({
    queryKey: ['aircraft'],
    queryFn: () => aircraftAPI.getAll(),
  })
}

export function useAircraftDetails(id: string) {
  return useQuery({
    queryKey: ['aircraft', id],
    queryFn: () => aircraftAPI.getById(id),
    enabled: !!id,
  })
}
```

---

## 🌐 Internacionalização (i18n)

```typescript
// lib/i18n.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': {
        translation: {
          // ... traduções
        }
      },
      'en-US': {
        translation: {
          // ... translations
        }
      },
      'es-ES': {
        translation: {
          // ... traducciones
        }
      }
    },
    lng: 'pt-BR',
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false,
    },
  })
```

---

## 📦 Entregáveis Finais

### Estrutura de Arquivos
```
aviation-compliance-frontend/
├── public/
│   ├── images/
│   │   └── aircraft/          # Imagens das aeronaves
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/               # Shadcn components
│   │   ├── layout/
│   │   ├── features/
│   │   └── shared/
│   ├── hooks/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   ├── i18n.ts
│   │   └── react-query.ts
│   ├── pages/
│   ├── stores/
│   ├── types/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

---

## ✅ Checklist de Qualidade

- [ ] **Design System**: Shadcn/UI + Tailwind totalmente integrados
- [ ] **Tipografia**: Inter carregada, hierarquia clara
- [ ] **Paleta Embraer**: Cores oficiais aplicadas consistentemente
- [ ] **Responsive**: Funcional em 320px até 2560px
- [ ] **Dark Mode**: Implementado com persistência
- [ ] **Acessibilidade**: WCAG 2.1 AA compliant
- [ ] **Performance**: Lighthouse Score > 90
- [ ] **TypeScript**: Strict mode sem erros
- [ ] **Testes**: Cobertura > 80%
- [ ] **API Integration**: Todos endpoints conectados
- [ ] **15 Modelos Embraer**: Dados completos implementados
- [ ] **i18n**: PT-BR, EN-US, ES-ES funcionais
- [ ] **PWA**: Service worker e manifest configurados
- [ ] **Analytics**: GA4 eventos rastreados

---

**🎯 Objetivo Final**: Frontend enterprise-grade que reflete a excelência da marca Embraer, combinando design corporativo sofisticado com funcionalidade robusta e performance excepcional.
