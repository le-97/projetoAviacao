# Aviation Design System - Premium Aeronautical Interface

## Design Inspiration Analysis

### Reference Analysis:
- **Embraer**: Azul profundo, gradientes sutis, tipografia moderna, layout limpo
- **NASA**: Azul escuro com acentos laranja, elementos científicos, dados prominentes
- **Boeing**: Azul corporativo, vermelho de destaque, layouts estruturados
- **Airbus**: Azul e laranja, elementos técnicos, interface sofisticada
- **SpaceX**: Preto/branco minimalista, acentos azuis, design futurista

## Color Palette - Aeronautical Premium

### Primary Colors (Inspired by Aviation Industry)
```css
:root {
  /* Aviation Blue Spectrum - Inspired by Embraer/Boeing */
  --aviation-primary-50: #eff6ff;
  --aviation-primary-100: #dbeafe;
  --aviation-primary-200: #bfdbfe;
  --aviation-primary-300: #93c5fd;
  --aviation-primary-400: #60a5fa;
  --aviation-primary-500: #3b82f6;  /* Main Blue */
  --aviation-primary-600: #1e40af;  /* Deep Aviation Blue */
  --aviation-primary-700: #1d4ed8;
  --aviation-primary-800: #1e3a8a;
  --aviation-primary-900: #172554;

  /* NASA Orange Accent */
  --aviation-accent-50: #fff7ed;
  --aviation-accent-100: #ffedd5;
  --aviation-accent-200: #fed7aa;
  --aviation-accent-300: #fdba74;
  --aviation-accent-400: #fb923c;
  --aviation-accent-500: #f97316;  /* NASA Orange */
  --aviation-accent-600: #ea580c;
  --aviation-accent-700: #c2410c;

  /* Technical Silver/Gray - Inspired by Aircraft Materials */
  --aviation-neutral-50: #f8fafc;
  --aviation-neutral-100: #f1f5f9;
  --aviation-neutral-200: #e2e8f0;
  --aviation-neutral-300: #cbd5e1;
  --aviation-neutral-400: #94a3b8;
  --aviation-neutral-500: #64748b;
  --aviation-neutral-600: #475569;
  --aviation-neutral-700: #334155;
  --aviation-neutral-800: #1e293b;
  --aviation-neutral-900: #0f172a;

  /* Status Colors - Aviation Safety Standards */
  --aviation-success-500: #10b981;  /* Green - All Clear */
  --aviation-warning-500: #f59e0b;  /* Amber - Caution */
  --aviation-danger-500: #ef4444;   /* Red - Critical Alert */
  --aviation-info-500: #06b6d4;     /* Cyan - Information */

  /* Premium Gradients */
  --gradient-aviation-primary: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  --gradient-aviation-accent: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
  --gradient-aviation-dark: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  --gradient-aviation-light: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}
```

### Typography - Aeronautical Professional
```css
/* Inspired by technical documentation and aviation interfaces */
:root {
  /* Primary Font Stack - Modern & Technical */
  --font-aviation-sans: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  
  /* Technical/Monospace - For data and codes */
  --font-aviation-mono: 'JetBrains Mono', 'SF Mono', 'Monaco', 'Fira Code', monospace;
  
  /* Display Font - For headings */
  --font-aviation-display: 'Inter', 'SF Pro Display', system-ui, sans-serif;

  /* Font Sizes - Technical Hierarchy */
  --text-aviation-xs: 0.75rem;    /* 12px - Labels, captions */
  --text-aviation-sm: 0.875rem;   /* 14px - Body text, forms */
  --text-aviation-base: 1rem;     /* 16px - Primary text */
  --text-aviation-lg: 1.125rem;   /* 18px - Emphasized text */
  --text-aviation-xl: 1.25rem;    /* 20px - Small headings */
  --text-aviation-2xl: 1.5rem;    /* 24px - Section headings */
  --text-aviation-3xl: 1.875rem;  /* 30px - Page headings */
  --text-aviation-4xl: 2.25rem;   /* 36px - Display text */
  --text-aviation-5xl: 3rem;      /* 48px - Hero text */

  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### Spacing & Layout - Technical Grid System
```css
:root {
  /* Spacing Scale - Based on 8px grid (common in technical interfaces) */
  --space-aviation-1: 0.25rem;   /* 4px */
  --space-aviation-2: 0.5rem;    /* 8px */
  --space-aviation-3: 0.75rem;   /* 12px */
  --space-aviation-4: 1rem;      /* 16px */
  --space-aviation-5: 1.25rem;   /* 20px */
  --space-aviation-6: 1.5rem;    /* 24px */
  --space-aviation-8: 2rem;      /* 32px */
  --space-aviation-10: 2.5rem;   /* 40px */
  --space-aviation-12: 3rem;     /* 48px */
  --space-aviation-16: 4rem;     /* 64px */
  --space-aviation-20: 5rem;     /* 80px */

  /* Border Radius - Subtle, professional */
  --radius-aviation-sm: 0.375rem;  /* 6px */
  --radius-aviation-md: 0.5rem;    /* 8px */
  --radius-aviation-lg: 0.75rem;   /* 12px */
  --radius-aviation-xl: 1rem;      /* 16px */

  /* Shadows - Subtle depth like premium interfaces */
  --shadow-aviation-sm: 0 1px 2px 0 rgba(15, 23, 42, 0.05);
  --shadow-aviation-md: 0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.06);
  --shadow-aviation-lg: 0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05);
  --shadow-aviation-xl: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04);
}
```

## Component Design Specifications

### 1. Button Component - Aviation Style
```css
/* Primary Button - Inspired by Embraer's interface buttons */
.btn-aviation-primary {
  background: var(--gradient-aviation-primary);
  color: white;
  border: none;
  border-radius: var(--radius-aviation-md);
  padding: var(--space-aviation-3) var(--space-aviation-6);
  font-weight: var(--font-weight-semibold);
  font-size: var(--text-aviation-sm);
  box-shadow: var(--shadow-aviation-md);
  transition: all 0.2s ease;
}

.btn-aviation-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-aviation-lg);
  background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
}

/* Secondary Button - Technical Style */
.btn-aviation-secondary {
  background: transparent;
  color: var(--aviation-primary-600);
  border: 2px solid var(--aviation-primary-600);
  border-radius: var(--radius-aviation-md);
  padding: var(--space-aviation-3) var(--space-aviation-6);
  font-weight: var(--font-weight-semibold);
}
```

### 2. Card Component - Premium Aviation Design
```css
.card-aviation {
  background: white;
  border-radius: var(--radius-aviation-lg);
  box-shadow: var(--shadow-aviation-md);
  border: 1px solid var(--aviation-neutral-200);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card-aviation:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-aviation-xl);
}

/* Status Card with Aviation Colors */
.card-aviation-status {
  position: relative;
}

.card-aviation-status::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--aviation-primary-500);
}

.card-aviation-status.success::before {
  background: var(--aviation-success-500);
}

.card-aviation-status.warning::before {
  background: var(--aviation-warning-500);
}

.card-aviation-status.danger::before {
  background: var(--aviation-danger-500);
}
```

### 3. Navigation - Professional Aviation Interface
```css
.navigation-aviation {
  background: var(--gradient-aviation-dark);
  border-right: 1px solid var(--aviation-neutral-700);
  width: 280px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
}

.nav-item-aviation {
  display: flex;
  align-items: center;
  padding: var(--space-aviation-4) var(--space-aviation-6);
  color: var(--aviation-neutral-300);
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.nav-item-aviation:hover {
  background: rgba(59, 130, 246, 0.1);
  color: var(--aviation-primary-400);
  border-left-color: var(--aviation-primary-400);
}

.nav-item-aviation.active {
  background: rgba(59, 130, 246, 0.15);
  color: var(--aviation-primary-300);
  border-left-color: var(--aviation-accent-500);
}
```

### 4. Dashboard Layout - NASA/SpaceX Inspired
```css
.dashboard-aviation {
  background: var(--aviation-neutral-50);
  min-height: 100vh;
  margin-left: 280px;
}

.dashboard-header {
  background: white;
  border-bottom: 1px solid var(--aviation-neutral-200);
  padding: var(--space-aviation-6) var(--space-aviation-8);
  box-shadow: var(--shadow-aviation-sm);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-aviation-6);
  padding: var(--space-aviation-8);
}
```

### 5. Metric Cards - Aviation Dashboard Style
```css
.metric-card-aviation {
  background: white;
  border-radius: var(--radius-aviation-lg);
  padding: var(--space-aviation-6);
  box-shadow: var(--shadow-aviation-md);
  border: 1px solid var(--aviation-neutral-200);
  position: relative;
  overflow: hidden;
}

.metric-card-aviation::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: var(--gradient-aviation-primary);
  opacity: 0.1;
  border-radius: 50%;
  transform: translate(30px, -30px);
}

.metric-value {
  font-size: var(--text-aviation-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--aviation-primary-700);
  font-family: var(--font-aviation-mono);
}

.metric-label {
  font-size: var(--text-aviation-sm);
  color: var(--aviation-neutral-600);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

### 6. Table - Technical Data Display
```css
.table-aviation {
  background: white;
  border-radius: var(--radius-aviation-lg);
  overflow: hidden;
  box-shadow: var(--shadow-aviation-md);
  border: 1px solid var(--aviation-neutral-200);
}

.table-aviation th {
  background: var(--aviation-neutral-50);
  padding: var(--space-aviation-4) var(--space-aviation-6);
  font-weight: var(--font-weight-semibold);
  color: var(--aviation-neutral-700);
  font-size: var(--text-aviation-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-aviation td {
  padding: var(--space-aviation-4) var(--space-aviation-6);
  border-bottom: 1px solid var(--aviation-neutral-100);
}

.table-aviation tr:hover {
  background: var(--aviation-primary-50);
}
```

## Visual Elements - Aviation Inspired

### Icons & Symbols
- Use Lucide React icons with aviation theme
- Plane, Radar, Shield (compliance), Clock (scheduling)
- Technical symbols for data visualization

### Data Visualization
- Charts with aviation blue color scheme
- Grid lines in subtle gray
- Data points with hover effects
- Professional legend styling

### Animations
- Subtle fade-ins and slide transitions
- Hover effects with slight elevation
- Loading states with professional spinners
- Page transitions with easing

### Layout Principles
1. **Grid-based layouts** - Precise alignment like technical drawings
2. **Generous whitespace** - Clean, professional appearance
3. **Consistent spacing** - 8px grid system
4. **Visual hierarchy** - Clear information structure
5. **Status indicators** - Color-coded system states

This design system creates a premium, professional interface that reflects the sophistication and reliability expected in the aviation industry, while maintaining modern usability standards.