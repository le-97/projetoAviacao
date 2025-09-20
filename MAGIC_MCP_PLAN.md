# Magic MCP Implementation Plan

## Phase 1: Core Design System

### Component Requirements for Magic MCP:

#### 1. Button Component
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}
```

**Visual Requirements:**
- Primary: Blue (#1e40af) background, white text, 8px rounded corners
- Hover: Darker blue (#1d4ed8), subtle shadow
- Loading: Spinner replaces text, disabled state
- Icons: Left side, 16px size, proper spacing

#### 2. Input Component
```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'tel';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}
```

**Visual Requirements:**
- Border: 1px solid #e2e8f0, focus: 2px solid #3b82f6
- Height: 40px, padding: 12px 16px
- Error state: Red border, error message below
- Icon: Left side, gray color, 20px size

#### 3. Card Component
```typescript
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'interactive' | 'status';
  status?: 'success' | 'warning' | 'danger' | 'info';
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}
```

**Visual Requirements:**
- Background: White, border-radius: 8px
- Shadow: Subtle drop shadow (0 1px 3px rgba(0,0,0,0.1))
- Interactive: Hover effect with increased shadow
- Status: Colored left border (4px width)

#### 4. MetricCard Component
```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'amber' | 'red';
  subtitle?: string;
}
```

**Visual Requirements:**
- Large value display (2xl font)
- Icon in top right, colored background circle
- Trend indicator with arrow icon and percentage
- Responsive layout, min-height: 120px

#### 5. Table Component
```typescript
interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  pagination?: boolean;
  itemsPerPage?: number;
  searchable?: boolean;
}
```

**Visual Requirements:**
- Header: Gray background, medium font weight
- Rows: Alternating white/gray backgrounds
- Hover: Light blue background
- Loading: Skeleton rows with shimmer effect

## Phase 2: Layout Components

#### 6. Sidebar Navigation
```typescript
interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string | number;
  children?: NavItem[];
}

interface SidebarProps {
  items: NavItem[];
  activeItem: string;
  collapsed?: boolean;
  onToggle: () => void;
  userInfo?: {
    name: string;
    avatar?: string;
    role: string;
  };
}
```

**Visual Requirements:**
- Width: 260px (expanded), 64px (collapsed)
- Dark background (#1e293b)
- Active item: Blue background, white text
- Icons: 20px, proper spacing from text
- User section at bottom with avatar

#### 7. Header Component
```typescript
interface HeaderProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  searchable?: boolean;
  onSearch?: (query: string) => void;
  notifications?: number;
  userMenu?: {
    name: string;
    avatar?: string;
    menuItems: { label: string; onClick: () => void }[];
  };
}
```

**Visual Requirements:**
- Height: 64px, white background, border bottom
- Search: Expandable search bar, icon trigger
- Notifications: Bell icon with badge count
- User menu: Avatar dropdown with items

## Phase 3: Data Visualization

#### 8. Chart Wrapper Components
```typescript
interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  error?: string;
  height?: number;
}
```

#### 9. Dashboard Grid
```typescript
interface DashboardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
}
```

## Phase 4: Form Components

#### 10. Form Wrapper
```typescript
interface FormProps {
  onSubmit: (data: any) => void;
  children: React.ReactNode;
  loading?: boolean;
  error?: string;
  title?: string;
  description?: string;
}
```

#### 11. Select Component
```typescript
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  loading?: boolean;
  error?: string;
  label?: string;
}
```

## Implementation Instructions for Magic MCP:

1. **Use Tailwind CSS** for all styling
2. **TypeScript** for all components with proper interfaces
3. **Responsive design** with mobile-first approach
4. **Accessibility** features (ARIA labels, keyboard navigation)
5. **Dark mode support** using CSS variables
6. **Animation** using Framer Motion or CSS transitions
7. **Icon system** using Lucide React icons
8. **Color system** following the defined design tokens

## File Structure:
```
src/
├── components/
│   ├── ui/           # Base components (Button, Input, Card, etc.)
│   ├── layout/       # Layout components (Sidebar, Header, etc.)
│   ├── charts/       # Chart wrapper components
│   ├── forms/        # Form-specific components
│   └── domain/       # Business logic components
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
└── styles/           # Global styles and design tokens
```

Each component should be created in its own file with:
- Component implementation
- TypeScript interfaces
- Storybook stories (if requested)
- Unit tests (basic)
- Export from index.ts