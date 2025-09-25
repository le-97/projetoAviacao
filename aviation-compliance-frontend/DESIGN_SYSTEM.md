# Aviation Compliance Frontend - Design System

## Typography

### Font Stack
- **Primary**: Inter (300, 400, 500, 600, 700, 800)
- **Monospace**: JetBrains Mono (400, 500, 600)
- **Fallbacks**: system-ui, sans-serif / Fira Code, monospace

### Typography Scale
- **text-xs**: 0.75rem (12px)
- **text-sm**: 0.875rem (14px) 
- **text-base**: 1rem (16px)
- **text-lg**: 1.125rem (18px)
- **text-xl**: 1.25rem (20px)
- **text-2xl**: 1.5rem (24px)
- **text-3xl**: 1.875rem (30px)

### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700
- **Extrabold**: 800

## Color Palette

### Aviation Brand Colors
```css
aviation: {
  50: '#f0f9ff',   // Lightest blue
  100: '#e0f2fe',  // Very light blue
  200: '#bae6fd',  // Light blue
  300: '#7dd3fc',  // Medium light blue
  400: '#38bdf8',  // Medium blue
  500: '#0ea5e9',  // Primary blue
  600: '#0284c7',  // Dark blue (primary action)
  700: '#0369a1',  // Darker blue
  800: '#075985',  // Very dark blue
  900: '#0c4a6e',  // Darkest blue
}
```

### Compliance Status Colors
```css
compliant: {
  50: '#f0fdf4',   // Success light
  100: '#dcfce7',  // Success lighter
  500: '#22c55e',  // Success
  600: '#16a34a',  // Success dark
  700: '#15803d',  // Success darker
}

warning: {
  50: '#fffbeb',   // Warning light
  100: '#fef3c7',  // Warning lighter
  500: '#f59e0b',  // Warning
  600: '#d97706',  // Warning dark
  700: '#b45309',  // Warning darker
}

danger: {
  50: '#fef2f2',   // Error light
  100: '#fee2e2',  // Error lighter
  500: '#ef4444',  // Error
  600: '#dc2626',  // Error dark
  700: '#b91c1c',  // Error darker
}
```

### Semantic Colors (HSL Variables)
```css
/* Light Mode */
--background: 0 0% 100%           // Pure white
--foreground: 222.2 84% 4.9%      // Almost black
--primary: 221.2 83.2% 53.3%      // Aviation blue
--secondary: 210 40% 96%          // Light gray
--muted: 210 40% 96%              // Muted gray
--accent: 210 40% 96%             // Accent gray
--border: 214.3 31.8% 91.4%       // Border gray

/* Aviation Specific */
--aviation-primary: 221.2 83.2% 53.3%   // Primary blue
--aviation-secondary: 197 100% 46%       // Secondary cyan
--aviation-accent: 43 96% 56%            // Accent yellow
--compliant: 142 71% 45%                 // Success green
--non-compliant: 0 84% 60%               // Error red
--pending: 38 92% 50%                    // Warning orange
--in-progress: 197 100% 46%              // Progress blue
```

## Spacing System

### Standard Spacing Scale
- **0**: 0px
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)

### Custom Spacing
- **18**: 4.5rem (72px)
- **88**: 22rem (352px)

### Container Padding
- **Default**: 2rem (32px)
- **Max Width**: 1400px (2xl breakpoint)

## Component Variants

### Button Variants
1. **default**: Aviation primary color with shadow
2. **destructive**: Red danger color
3. **outline**: Transparent with aviation border
4. **secondary**: Gray background
5. **ghost**: Transparent hover effect
6. **link**: Text link styling
7. **success**: Green confirmation
8. **warning**: Yellow alert
9. **aviation**: Gradient aviation theme

### Button Sizes
- **sm**: h-8, px-3, text-xs
- **default**: h-10, px-4, py-2
- **lg**: h-12, px-8, text-base
- **xl**: h-14, px-10, text-lg
- **icon**: h-10, w-10

## Effects & Animations

### Gradients
```css
.aviation-gradient {
  background: linear-gradient(135deg, 
    hsl(var(--aviation-primary)) 0%, 
    hsl(var(--aviation-secondary)) 50%, 
    hsl(var(--aviation-accent)) 100%
  );
}
```

### Glass Morphism
```css
.glass {
  backdrop-filter: blur(16px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.125);
}
```

### Custom Shadows
- **shadow-aviation**: Blue-tinted subtle shadow
- **shadow-aviation-lg**: Larger blue-tinted shadow

### Animations
- **fade-in**: 0.6s ease-out opacity and transform
- **slide-up**: 0.3s ease-out transform
- **float**: 6s infinite gentle floating
- **pulse-slow**: 3s infinite opacity pulse
- **bounce-gentle**: 2s infinite gentle bounce

## Layout Grid

### Responsive Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1400px (custom container max)

### Grid Patterns
- **Dashboard Metrics**: 1 → 2 → 4 columns (sm → md → lg)
- **Content Areas**: 1 → 2 → 3 columns (base → lg → xl)
- **Cards Layout**: Responsive grid with gap-6

## Accessibility Features

### Focus States
- **ring-2**: 2px focus ring
- **ring-ring**: Primary color ring
- **ring-offset-2**: 2px offset from element

### Color Contrast
- All color combinations meet WCAG AA standards
- High contrast ratios for text on backgrounds
- Status colors with sufficient differentiation

### Interactive States
- **hover**: Subtle color transitions
- **active**: Pressed state feedback
- **disabled**: 50% opacity with pointer-events-none
- **loading**: Spinner with accessible labels

## Icon System

### Primary Icon Library
**Lucide React** - Consistent stroke width and style

### Common Icons
- **Navigation**: Menu, X, ChevronDown, ChevronRight
- **Actions**: Plus, Edit, Trash2, Save, Download
- **Status**: CheckCircle, AlertTriangle, XCircle, Clock
- **Aviation**: Plane, Shield, Activity, BarChart3
- **Interface**: Search, Filter, Settings, User

## Status Indicators

### Compliance Status Classes
```css
.status-compliant     // Green background, dark green text
.status-non-compliant // Red background, dark red text  
.status-pending       // Yellow background, dark yellow text
.status-in-progress   // Blue background, dark blue text
```

### Visual Indicators
- **Border accents**: Left border with status colors
- **Dot indicators**: Small colored circles for activity
- **Badge styling**: Rounded status badges with appropriate colors

This design system provides a comprehensive foundation for the aviation compliance application with professional styling, accessibility compliance, and consistent user experience patterns.