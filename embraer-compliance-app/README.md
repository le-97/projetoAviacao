# Embraer Aviation Compliance System

Sistema moderno de compliance aeronáutica desenvolvido para a Embraer, focado em conformidade regulatória de aeronaves comerciais, executivas, defesa e agrícolas.

## 🚀 Stack Tecnológica

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite (Rolldown)
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v6
- **HTTP Client**: Axios

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar servidor de desenvolvimento
npm run dev
```

## 🏗️ Estrutura do Projeto

```
src/
├── assets/          # Imagens e ícones
├── components/
│   ├── ui/         # Componentes Shadcn
│   ├── layout/     # Layout (Sidebar, TopNav)
│   ├── features/   # Componentes específicos
│   └── shared/     # Componentes compartilhados
├── hooks/          # Custom hooks
├── lib/            # Utilitários e configurações
├── pages/          # Páginas da aplicação
├── stores/         # Zustand stores
├── types/          # TypeScript types
└── App.tsx
```

## 🛫 Aeronaves Implementadas

### Aviação Comercial - E-Jets E2 (Nova Geração)
- E175-E2 (Em desenvolvimento)
- E190-E2 (Ativo)
- E195-E2 (Ativo)

### Aviação Comercial - E-Jets (Geração Anterior)
- E170 (Legado)
- E175 (Ativo)
- E190 (Ativo)
- E195 (Ativo)

### Aviação Executiva
- Phenom 100EX (Very Light Jet)
- Phenom 300E (Light Jet - mais vendido do mundo)
- Praetor 500 (Midsize Jet)
- Praetor 600 (Super Midsize Jet)

### Defesa & Segurança
- KC-390 Millennium (Transporte militar)
- Super Tucano EMB-314 (Ataque leve)
- P-99/P-99A (Patrulha marítima)

### Aviação Agrícola
- Ipanema (100% Etanol)

## 📄 Páginas Principais

1. **Dashboard** (`/`) - Visão geral com estatísticas e gráficos
2. **Catálogo de Aeronaves** (`/aeronaves`) - Grid com todos os modelos
3. **Detalhes da Aeronave** (`/aeronaves/:id`) - Especificações completas
4. **Verificação de Compliance** (`/compliance/verificar`) - Formulário multi-etapas
5. **Regulamentações** (`/regulamentacoes`) - Base de conhecimento
6. **Histórico** (`/historico`) - Relatórios e exportações

## 🎨 Design System

### Cores Embraer
- Azul Embraer: `#003DA5`
- Azul Escuro: `#002366`
- Cinza Claro: `#F5F7FA`
- Verde Sucesso: `#10B981`
- Vermelho Alerta: `#EF4444`
- Amarelo Aviso: `#F59E0B`

### Tipografia
- Fonte: Inter (Google Fonts)
- Pesos: 400, 500, 600, 700

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Linting
npm run lint
```

## 🌐 Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_GA_ID=G-XXXXXXXXXX
```

## 📱 Responsividade

- Desktop-first com adaptação mobile
- Breakpoints: 1920px, 1440px, 1024px, 768px, 640px
- Sidebar colapsável em mobile

## 🌍 Internacionalização

- Português (BR) - padrão
- Inglês (US)
- Espanhol (ES)

## 🌙 Dark Mode

- Toggle no header
- Persistência no localStorage
- Cores adaptadas para contraste

## 📊 Features Implementadas

- ✅ Dashboard com estatísticas e gráficos
- ✅ Catálogo completo de 15 aeronaves Embraer
- ✅ Detalhes técnicos de cada aeronave
- ✅ Sistema de filtros avançados
- ✅ Navegação responsiva
- ✅ Dark mode
- ✅ Multi-idioma
- ✅ Componentes reutilizáveis
- ✅ TypeScript strict mode
- ✅ Design system consistente

## 🚧 Próximas Implementações

- [ ] Formulário completo de verificação de compliance
- [ ] Integração com API backend
- [ ] Sistema de autenticação
- [ ] Exportação de relatórios (PDF, Excel)
- [ ] Testes unitários e E2E
- [ ] PWA support
- [ ] Analytics

## 📝 Licença

© 2025 Embraer S.A. Todos os direitos reservados.

## 👥 Suporte

Para suporte e dúvidas, entre em contato com a equipe de desenvolvimento.