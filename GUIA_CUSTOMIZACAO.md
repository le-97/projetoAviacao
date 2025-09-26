# 🎨 Guia de Customização - Landing Page Embraer

## 📋 **ÍNDICE DE CUSTOMIZAÇÕES**

1. [🎨 Cores e Identidade Visual](#cores)
2. [📝 Textos e Conteúdo](#textos)
3. [🖼️ Imagens e Mídia](#imagens)
4. [✈️ Dados de Aeronaves](#aeronaves)
5. [📊 Estatísticas e Métricas](#estatisticas)
6. [🗺️ Países e Certificações](#paises)
7. [💰 Preços e Planos](#precos)
8. [📞 Informações de Contato](#contato)
9. [🎭 Animações e Efeitos](#animacoes)
10. [📱 Layout e Responsividade](#layout)

---

## 🎨 **1. CORES E IDENTIDADE VISUAL** {#cores}

### 📍 **Arquivo**: `tailwind.config.js`

```javascript
// CORES PRINCIPAIS - PERSONALIZE AQUI
colors: {
  // 🔵 Cor principal da marca (azul aviação)
  'aviation-blue': '#003366',     // ← MUDE AQUI
  
  // 🟡 Cor de destaque (dourado Embraer)
  'embraer-gold': '#FFB000',      // ← MUDE AQUI
  
  // 🟢 Cor de sucesso (verde certificação)
  'success-green': '#10B981',     // ← MUDE AQUI
  
  // 🌈 Gradiente de céu (cores secundárias)
  'sky-gradient': {
    '50': '#f0f9ff',   // Mais claro
    '100': '#e0f2fe',
    '200': '#bae6fd',
    '300': '#7dd3fc',
    '400': '#38bdf8',  // Médio
    '500': '#0ea5e9',
    '600': '#0284c7',
    '700': '#0369a1',
    '800': '#075985',
    '900': '#0c4a6e',  // Mais escuro
  }
}
```

### 🎨 **Gradientes Personalizados**
```javascript
backgroundImage: {
  // 🌅 Gradiente principal da aviação
  'aviation-gradient': 'linear-gradient(135deg, #003366 0%, #0ea5e9 50%, #FFB000 100%)',
  
  // 🌤️ Gradiente do céu
  'sky-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}
```

### **🔧 Como Customizar Cores:**
1. **Para sua marca**: Substitua `#003366` pela cor principal da sua empresa
2. **Cor de destaque**: Mude `#FFB000` para sua cor secundária
3. **Sucesso/Status**: Altere `#10B981` para sua cor de aprovação

---

## 📝 **2. TEXTOS E CONTEÚDO** {#textos}

### 🏠 **Hero Section** - `components/HeroSection.tsx`

```tsx
// 📍 LINHA 15-17 - TÍTULO PRINCIPAL
<h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
  Certificação Aeronáutica Internacional com IA  {/* ← MUDE AQUI */}
</h1>

// 📍 LINHA 18-20 - SUBTÍTULO/DESCRIÇÃO
<p className="text-xl md:text-2xl mb-8 opacity-90">
  Simplifique processos complexos de certificação Embraer em 60+ países com análise inteligente e gap analysis automatizado  {/* ← MUDE AQUI */}
</p>

// 📍 LINHA 27-29 - BOTÃO PRINCIPAL
<motion.a href="#contact" className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3 px-6 rounded-lg text-center transition duration-300">
  Iniciar Análise Gratuita  {/* ← MUDE AQUI */}
</motion.a>

// 📍 LINHA 35-37 - BOTÃO SECUNDÁRIO
<motion.a href="#demo" className="bg-white hover:bg-gray-100 text-blue-900 font-bold py-3 px-6 rounded-lg text-center transition duration-300">
  Ver Demo Interativa  {/* ← MUDE AQUI */}
</motion.a>
```

### 🧭 **Navegação** - `components/Navigation.tsx`

```tsx
// 📍 LINHA 10-16 - ITENS DO MENU
const menuItems = [
  { href: '#features', label: 'Recursos' },      // ← MUDE AQUI
  { href: '#aircrafts', label: 'Aeronaves' },    // ← MUDE AQUI
  { href: '#countries', label: 'Países' },       // ← MUDE AQUI
  { href: '#testimonials', label: 'Clientes' },  // ← MUDE AQUI
  { href: '#pricing', label: 'Preços' },         // ← MUDE AQUI
]

// 📍 LINHA 28 - NOME DA EMPRESA
<span className="ml-2 text-xl font-bold text-blue-900">EmbraerCert</span>  {/* ← MUDE AQUI */}

// 📍 LINHA 44 - BOTÃO CTA NAVEGAÇÃO
<a href="#contact" className="...">
  Iniciar Análise  {/* ← MUDE AQUI */}
</a>
```

### **🔧 Como Customizar Textos:**
1. **Busque por comentários** `{/* ← MUDE AQUI */}`
2. **Substitua o conteúdo** entre as tags mantendo a estrutura
3. **Mantenha as classes CSS** para preservar o estilo

---

## 🖼️ **3. IMAGENS E MÍDIA** {#imagens}

### 🏠 **Hero Section** - `components/HeroSection.tsx`

```tsx
// 📍 LINHA 49-53 - IMAGEM PRINCIPAL
<img 
  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"  {/* ← MUDE AQUI */}
  alt="Embraer Aircraft"  {/* ← MUDE AQUI */}
  className="w-full h-auto"
/>
```

### **📁 Onde Colocar Suas Imagens:**
```
landing-page/
├── public/
│   └── images/
│       ├── hero-aircraft.jpg      // ← SUA IMAGEM PRINCIPAL
│       ├── logo.png               // ← SEU LOGO
│       ├── aircraft/
│       │   ├── e170.jpg          // ← IMAGENS DE AERONAVES
│       │   ├── e175.jpg
│       │   └── ...
│       └── testimonials/
│           ├── client1.jpg        // ← FOTOS DE CLIENTES
│           └── client2.jpg
```

### **🔧 Como Trocar Imagens:**
```tsx
// ANTES (Unsplash)
src="https://images.unsplash.com/photo-..."

// DEPOIS (Sua imagem)
src="/images/hero-aircraft.jpg"
```

---

## ✈️ **4. DADOS DE AERONAVES** {#aeronaves}

### 📍 **Arquivo**: `components/AircraftGrid.tsx` - **LINHA 19-142**

```tsx
const aircraftData: Aircraft[] = [
  // 🛩️ EXEMPLO DE AERONAVE - COPIE E MODIFIQUE
  {
    id: 'e170',                                    // ← ID único
    name: 'E170',                                  // ← Nome da aeronave
    model: 'Regional Jet',                         // ← Modelo/Categoria
    category: 'commercial',                        // ← commercial | executive | military
    seats: '70-80',                               // ← Capacidade de assentos
    range: '3,700 km',                            // ← Alcance
    status: 'certified',                          // ← certified | in-progress | planned
    countries: 45,                                // ← Número de países certificados
    description: 'Jato regional eficiente para rotas de média distância',  // ← Descrição
    features: ['Baixo consumo', 'Conforto superior', 'Manutenção reduzida']  // ← Características
  },
  
  // 🆕 ADICIONE SUAS AERONAVES AQUI
  {
    id: 'sua-aeronave',
    name: 'Sua Aeronave',
    model: 'Seu Modelo',
    category: 'commercial',  // ou 'executive' ou 'military'
    seats: 'XX-XX',
    range: 'X,XXX km',
    status: 'certified',
    countries: XX,
    description: 'Sua descrição aqui',
    features: ['Característica 1', 'Característica 2', 'Característica 3']
  }
]
```

### **🏷️ Categorias Disponíveis:**
- `'commercial'` - Aviação Comercial
- `'executive'` - Aviação Executiva  
- `'military'` - Aviação Militar

### **📊 Status Disponíveis:**
- `'certified'` - Certificado (verde)
- `'in-progress'` - Em Processo (dourado)
- `'planned'` - Planejado (cinza)

---

## 📊 **5. ESTATÍSTICAS E MÉTRICAS** {#estatisticas}

### 📍 **Arquivo**: `components/StatsSection.tsx` - **LINHA 8-39**

```tsx
const stats = [
  {
    icon: Globe,
    number: 60,                    // ← MUDE O NÚMERO
    suffix: '+',                   // ← SUFIXO (+ , % , k, etc.)
    label: 'Países Suportados',    // ← MUDE O TEXTO
    color: 'text-blue-600'        // ← COR DO ÍCONE
  },
  {
    icon: GraduationCap,
    number: 15,                    // ← MUDE O NÚMERO
    suffix: '+',
    label: 'Modelos Certificados', // ← MUDE O TEXTO
    color: 'text-green-600'
  },
  {
    icon: BarChart3,
    number: 95,                    // ← MUDE O NÚMERO
    suffix: '%',
    label: 'Taxa de Sucesso',      // ← MUDE O TEXTO
    color: 'text-purple-600'
  },
  {
    icon: Clock,
    number: 48,                    // ← MUDE O NÚMERO
    suffix: 'h',
    label: 'Tempo Médio',          // ← MUDE O TEXTO
    color: 'text-orange-600'
  },
  {
    icon: DollarSign,
    number: 50,                    // ← MUDE O NÚMERO
    suffix: 'k+',
    label: 'Economia Média',       // ← MUDE O TEXTO
    color: 'text-yellow-600'
  },
  {
    icon: Users,
    number: 500,                   // ← MUDE O NÚMERO
    suffix: '+',
    label: 'Clientes Ativos',      // ← MUDE O TEXTO
    color: 'text-indigo-600'
  }
]
```

---

## 🗺️ **6. PAÍSES E CERTIFICAÇÕES** {#paises}

### 📍 **Arquivo**: `components/WorldMap.tsx`

```tsx
// EXEMPLO DE COMO ADICIONAR PAÍSES
const certifiedCountries = [
  // 🌎 AMÉRICAS
  { code: 'BR', name: 'Brasil', status: 'certified' },
  { code: 'US', name: 'Estados Unidos', status: 'certified' },
  { code: 'CA', name: 'Canadá', status: 'certified' },
  
  // 🌍 EUROPA
  { code: 'DE', name: 'Alemanha', status: 'certified' },
  { code: 'FR', name: 'França', status: 'in-progress' },
  { code: 'GB', name: 'Reino Unido', status: 'certified' },
  
  // 🌏 ÁSIA-PACÍFICO
  { code: 'CN', name: 'China', status: 'in-progress' },
  { code: 'JP', name: 'Japão', status: 'certified' },
  { code: 'AU', name: 'Austrália', status: 'certified' },
  
  // ➕ ADICIONE MAIS PAÍSES AQUI
]
```

### **🏷️ Status de Certificação:**
- `'certified'` - Certificado (verde)
- `'in-progress'` - Em processo (amarelo)
- `'planned'` - Planejado (azul claro)

---

## 💰 **7. PREÇOS E PLANOS** {#precos}

### 📍 **Arquivo**: `components/PricingSection.tsx`

```tsx
const pricingPlans = [
  // 📦 PLANO BÁSICO
  {
    name: 'Starter',                           // ← NOME DO PLANO
    price: 99,                                 // ← PREÇO
    period: 'mês',                            // ← PERÍODO
    description: 'Para análises básicas',     // ← DESCRIÇÃO
    features: [                               // ← RECURSOS
      'Até 3 análises por mês',
      'Relatórios básicos',
      'Suporte por email',
      '5 países suportados'
    ],
    popular: false,                           // ← PLANO POPULAR?
    cta: 'Começar Grátis'                    // ← TEXTO DO BOTÃO
  },
  
  // 📦 PLANO PROFISSIONAL  
  {
    name: 'Professional',
    price: 299,
    period: 'mês',
    description: 'Para empresas médias',
    features: [
      'Análises ilimitadas',
      'Relatórios avançados',
      'Suporte prioritário',
      'Todos os países',
      'API personalizada'
    ],
    popular: true,                           // ← DESTAQUE
    cta: 'Teste Grátis 14 Dias'
  },
  
  // 📦 PLANO ENTERPRISE
  {
    name: 'Enterprise',
    price: 999,
    period: 'mês',
    description: 'Para grandes corporações',
    features: [
      'Tudo do Professional',
      'Consultor dedicado',
      'Integração personalizada',
      'SLA garantido',
      'Treinamento da equipe'
    ],
    popular: false,
    cta: 'Falar com Vendas'
  }
]
```

---

## 📞 **8. INFORMAÇÕES DE CONTATO** {#contato}

### 📍 **Arquivo**: `components/ContactForm.tsx`

```tsx
// 📧 INFORMAÇÕES DA EMPRESA
const companyInfo = {
  name: 'EmbraerCert Solutions',              // ← NOME DA EMPRESA
  email: 'contato@embraercert.com',           // ← EMAIL
  phone: '+55 (11) 1234-5678',              // ← TELEFONE
  address: 'São José dos Campos, SP - Brasil', // ← ENDEREÇO
  website: 'www.embraercert.com'              // ← WEBSITE
}
```

### 📍 **Arquivo**: `components/Footer.tsx`

```tsx
// 🏢 INFORMAÇÕES DO RODAPÉ
const footerInfo = {
  company: {
    name: 'EmbraerCert',                      // ← NOME DA EMPRESA
    description: 'Certificação aeronáutica inteligente para o futuro da aviação.',  // ← DESCRIÇÃO
    copyright: '© 2025 EmbraerCert. Todos os direitos reservados.'  // ← COPYRIGHT
  },
  
  // 📱 REDES SOCIAIS
  social: {
    linkedin: 'https://linkedin.com/company/embraercert',  // ← LINKEDIN
    twitter: 'https://twitter.com/embraercert',            // ← TWITTER
    youtube: 'https://youtube.com/embraercert'             // ← YOUTUBE
  },
  
  // 📞 CONTATOS
  contact: {
    email: 'contato@embraercert.com',          // ← EMAIL
    phone: '+55 (11) 1234-5678',             // ← TELEFONE
    address: 'São José dos Campos, SP'        // ← CIDADE
  }
}
```

---

## 🎭 **9. ANIMAÇÕES E EFEITOS** {#animacoes}

### 📍 **Arquivo**: `tailwind.config.js` - **Seção Animation**

```javascript
animation: {
  // 🌊 ANIMAÇÃO DE FLUTUAÇÃO
  'float': 'float 6s ease-in-out infinite',        // ← DURAÇÃO: 6s
  
  // ⬆️ SLIDE DE ENTRADA
  'slide-up': 'slideUp 0.5s ease-out',            // ← DURAÇÃO: 0.5s
  
  // 💫 FADE IN
  'fade-in': 'fadeIn 0.8s ease-out',              // ← DURAÇÃO: 0.8s
  
  // 🏀 BOUNCE LENTO
  'bounce-slow': 'bounce 2s infinite',            // ← DURAÇÃO: 2s
  
  // 💓 PULSE LENTO
  'pulse-slow': 'pulse 3s infinite',              // ← DURAÇÃO: 3s
}
```

### **🎛️ Customizar Velocidades das Animações:**

```javascript
// ⚡ MAIS RÁPIDO
'fade-in': 'fadeIn 0.4s ease-out',    // Era 0.8s, agora 0.4s

// 🐌 MAIS LENTO  
'float': 'float 10s ease-in-out infinite',  // Era 6s, agora 10s

// 🎯 PERSONALIZADO
'custom-spin': 'spin 0.3s linear infinite',  // Sua animação
```

### 📍 **Animações Framer Motion** - Em qualquer componente

```tsx
// 🎬 ANIMAÇÃO DE ENTRADA
<motion.div
  initial={{ opacity: 0, y: 50 }}        // ← ESTADO INICIAL
  whileInView={{ opacity: 1, y: 0 }}     // ← ESTADO FINAL
  transition={{ duration: 0.8 }}         // ← DURAÇÃO
  viewport={{ once: true }}              // ← ANIMAR APENAS UMA VEZ
>
  Seu conteúdo aqui
</motion.div>

// 🖱️ ANIMAÇÃO DE HOVER
<motion.button
  whileHover={{ scale: 1.05 }}           // ← ESCALA NO HOVER
  whileTap={{ scale: 0.95 }}             // ← ESCALA NO CLIQUE
>
  Botão Animado
</motion.button>
```

---

## 📱 **10. LAYOUT E RESPONSIVIDADE** {#layout}

### 🖥️ **Breakpoints Tailwind**

```javascript
// 📱 MOBILE (padrão)
className="text-lg"              // Aplicado em todas as telas

// 📱 SMALL (640px+)
className="sm:text-xl"           // A partir de 640px

// 💻 MEDIUM (768px+)  
className="md:text-2xl"          // A partir de 768px

// 🖥️ LARGE (1024px+)
className="lg:text-3xl"          // A partir de 1024px

// 🖥️ EXTRA LARGE (1280px+)
className="xl:text-4xl"          // A partir de 1280px
```

### 📐 **Grids Responsivos**

```tsx
// 📱→💻→🖥️ GRID ADAPTATIVO
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 
  Mobile: 1 coluna
  Tablet: 2 colunas  
  Desktop: 3 colunas
  */}
</div>

// 📏 ESPAÇAMENTOS RESPONSIVOS
<div className="px-4 sm:px-6 lg:px-8">
  {/*
  Mobile: 16px padding
  Small: 24px padding
  Large: 32px padding
  */}
</div>
```

---

## 🛠️ **GUIA RÁPIDO DE CUSTOMIZAÇÃO**

### ✅ **Checklist de Personalização:**

- [ ] **Cores** - Altere `aviation-blue` e `embraer-gold` no `tailwind.config.js`
- [ ] **Logo/Nome** - Mude "EmbraerCert" em `Navigation.tsx` 
- [ ] **Título Principal** - Edite o H1 em `HeroSection.tsx`
- [ ] **Estatísticas** - Atualize números em `StatsSection.tsx`
- [ ] **Aeronaves** - Modifique `aircraftData` em `AircraftGrid.tsx`
- [ ] **Preços** - Ajuste `pricingPlans` em `PricingSection.tsx`
- [ ] **Contatos** - Altere emails e telefones nos componentes
- [ ] **Imagens** - Substitua URLs por suas imagens em `/public/images/`
- [ ] **Meta Tags** - Edite `layout.tsx` para SEO
- [ ] **Favicon** - Substitua em `/public/favicon.ico`

### 🎯 **Arquivos Mais Importantes:**
1. `tailwind.config.js` - Cores e estilos
2. `components/HeroSection.tsx` - Seção principal
3. `components/Navigation.tsx` - Menu e navegação
4. `components/AircraftGrid.tsx` - Dados das aeronaves
5. `components/StatsSection.tsx` - Estatísticas
6. `components/PricingSection.tsx` - Planos e preços

### 🔧 **Comandos Úteis:**

```bash
# 🚀 Iniciar desenvolvimento
cd landing-page
npm run dev

# 🏗️ Build para produção
npm run build

# 🔍 Verificar erros
npm run lint

# 📦 Instalar dependências
npm install
```

---

## 🆘 **TROUBLESHOOTING**

### ❌ **Problemas Comuns:**

**🎨 Cores não aparecem:**
```bash
# Limpar e recompilar Tailwind
rm -rf .next
npm run dev
```

**🖼️ Imagens não carregam:**
```tsx
// Verificar se a imagem está em /public/
// CORRETO:
src="/images/sua-imagem.jpg"

// INCORRETO:
src="src/images/sua-imagem.jpg"
```

**📱 Responsividade quebrada:**
```tsx
// Sempre use mobile-first
// CORRETO:
className="text-base md:text-lg lg:text-xl"

// INCORRETO:  
className="lg:text-xl md:text-lg text-base"
```

---

**🎉 Pronto! Agora você tem controle total sobre todos os aspectos da landing page!**

**💡 Dica:** Faça as alterações gradualmente e teste em `npm run dev` para ver os resultados em tempo real.

*Guia criado em: 24 de Setembro de 2025*
*Versão: 1.0.0*