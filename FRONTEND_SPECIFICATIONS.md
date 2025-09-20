# Frontend Specifications - Aviation Compliance System

## Overview
Sistema completo de compliance aeronáutico com interface moderna, intuitiva e responsiva para gerenciamento de frotas, regulamentações e conformidade.

## Design System

### Colors
```css
:root {
  /* Primary Colors */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-900: #1e3a8a;

  /* Status Colors */
  --color-success-50: #f0fdf4;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  
  --color-warning-50: #fffbeb;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  
  --color-danger-50: #fef2f2;
  --color-danger-500: #ef4444;
  --color-danger-600: #dc2626;

  /* Neutral Colors */
  --color-gray-50: #f8fafc;
  --color-gray-100: #f1f5f9;
  --color-gray-200: #e2e8f0;
  --color-gray-300: #cbd5e1;
  --color-gray-500: #64748b;
  --color-gray-600: #475569;
  --color-gray-700: #334155;
  --color-gray-800: #1e293b;
  --color-gray-900: #0f172a;

  /* Aviation Specific */
  --color-aviation-blue: #1e40af;
  --color-aviation-sky: #0ea5e9;
  --color-aviation-green: #059669;
}
```

### Typography
```css
--font-heading: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

### Spacing
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

## Component Library

### 1. Base Components

#### Button
- **Primary**: Blue background, white text, hover states
- **Secondary**: White background, blue border, blue text
- **Success**: Green background, white text
- **Warning**: Amber background, white text
- **Danger**: Red background, white text
- **Ghost**: Transparent background, hover overlay
- **Sizes**: sm (32px), md (40px), lg (48px)
- **States**: default, hover, active, disabled, loading

#### Input
- **Text Input**: Border, focus ring, error states
- **Select**: Dropdown with search, multi-select option
- **Textarea**: Auto-resize, character count
- **File Upload**: Drag & drop area, progress indicator
- **Date/Time**: Calendar picker, time selector

#### Card
- **Basic**: White background, subtle shadow, rounded corners
- **Interactive**: Hover effects, clickable states
- **Status**: Color-coded left border for different statuses
- **Metric**: Large number display with trend indicators

### 2. Layout Components

#### Navigation
- **Top Navigation**: Logo, search, user menu, notifications
- **Sidebar**: Collapsible, icon + label, active states
- **Breadcrumbs**: Path navigation with separators
- **Tabs**: Horizontal navigation for sections

#### Container
- **Page Container**: Max width, centered, responsive padding
- **Section**: Content grouping with optional headers
- **Grid**: Responsive grid system (1-12 columns)
- **Stack**: Vertical spacing between elements

### 3. Data Display

#### Table
- **Basic**: Sortable columns, row selection
- **Advanced**: Filtering, pagination, column resizing
- **Expandable**: Row details, nested data
- **Actions**: Row-level actions, bulk operations

#### Charts (using Recharts)
- **Line Chart**: Time series data, multiple datasets
- **Bar Chart**: Categorical data, stacked options
- **Pie Chart**: Status distribution, compliance metrics
- **Area Chart**: Cumulative data, trend visualization

#### List
- **Simple**: Text items with optional icons
- **Complex**: Multiple data points, actions, status indicators
- **Virtual**: Performance optimization for large datasets

### 4. Feedback Components

#### Alert
- **Types**: Info, success, warning, error
- **Dismissible**: Close button, auto-dismiss timer
- **Actions**: Primary/secondary action buttons

#### Toast
- **Position**: Top-right corner, stackable
- **Duration**: Auto-dismiss with progress indicator
- **Types**: Success, error, warning, info

#### Loading
- **Spinner**: Various sizes, overlay option
- **Skeleton**: Content placeholders during loading
- **Progress Bar**: Determinate/indeterminate progress

#### Modal
- **Sizes**: sm (400px), md (600px), lg (800px), xl (1000px)
- **Types**: Confirmation, form, content viewer
- **Features**: Backdrop click to close, escape key, focus trap

## Page Specifications

### 1. Dashboard
**URL**: `/dashboard`
**Layout**: Full width with sidebar

#### Header Section
- Welcome message with user name
- Quick stats cards (4 cards in row):
  - Total Aircraft: Number + trend arrow
  - Compliance Rate: Percentage + color coding
  - Active Alerts: Count + severity indicator
  - Upcoming Inspections: Count + timeline

#### Charts Section (2x2 Grid)
- **Fleet Status**: Pie chart showing operational/maintenance/grounded
- **Compliance Trends**: Line chart showing compliance over time
- **Alert Distribution**: Bar chart by severity/type
- **Inspection Timeline**: Area chart of upcoming/completed

#### Recent Activity
- Table showing latest compliance checks, updates, alerts
- 5 most recent items with actions (view details)

#### Quick Actions
- Floating action buttons for common tasks:
  - Add New Aircraft
  - Run Compliance Check
  - Generate Report
  - View Regulations

### 2. Aircraft Management
**URL**: `/aircraft`
**Layout**: Full width with sidebar

#### Header Section
- Page title "Aircraft Management"
- Search bar with filters
- Add Aircraft button (primary)
- Import/Export buttons (secondary)

#### Filters Panel (Collapsible)
- Status: All, Operational, Maintenance, Grounded
- Type: Commercial, Private, Cargo, etc.
- Registration: Search by tail number
- Model: Dropdown selection
- Compliance Status: Compliant, Issues, Overdue

#### Aircraft Grid/List View
- **Grid View**: Cards with aircraft image, key info
- **List View**: Table with sortable columns
- **Columns**: Registration, Model, Status, Last Check, Next Due, Actions

#### Aircraft Details Modal
- **Tabs**: Overview, Compliance, Documents, History
- **Overview**: Basic info, specifications, current status
- **Compliance**: Current status, recent checks, upcoming requirements
- **Documents**: Certificates, manuals, inspection reports
- **History**: Timeline of all activities

### 3. Compliance Checking
**URL**: `/compliance`
**Layout**: Full width with sidebar

#### Control Panel
- Run Check button (large, prominent)
- Check Type selector: Full, Partial, Specific Regulation
- Aircraft Selector: Single, Multiple, All Fleet
- Schedule Options: Immediate, Scheduled, Recurring

#### Results Display
- **Summary Cards**: 
  - Total Checks: Count
  - Compliant: Green count
  - Issues Found: Amber count
  - Critical: Red count

- **Detailed Results Table**:
  - Aircraft Registration
  - Check Type
  - Status (Pass/Fail/Warning)
  - Issues Count
  - Last Updated
  - Actions (View Details, Recheck)

#### Check Details Modal
- **Header**: Aircraft info, check timestamp
- **Tabs**: Requirements, Issues, History
- **Requirements**: List with pass/fail status, details
- **Issues**: Detailed issue descriptions, severity, recommendations
- **History**: Previous check results, trends

### 4. Regulations Library
**URL**: `/regulations`
**Layout**: Full width with sidebar

#### Search & Filter Panel
- **Search Bar**: Full-text search with suggestions
- **Filters**:
  - Authority: FAA, EASA, ICAO, etc.
  - Category: Airworthiness, Operations, Maintenance
  - Effective Date: Date range picker
  - Status: Current, Superseded, Proposed

#### Regulations List
- **Card Layout**: Each regulation as a card
- **Card Content**:
  - Title and regulation number
  - Authority and category badges
  - Effective date
  - Brief description
  - Actions: View, Download, Add to Watchlist

#### Regulation Viewer
- **Header**: Regulation details, metadata
- **Content**: Formatted regulation text
- **Navigation**: Section jumps, search within document
- **Actions**: Print, download, share, add notes

### 5. Reports
**URL**: `/reports`
**Layout**: Full width with sidebar

#### Report Templates
- **Grid of Templates**:
  - Compliance Summary
  - Fleet Status Report
  - Inspection Schedule
  - Regulatory Updates
  - Custom Report Builder

#### Report Generator
- **Template Selection**: Pre-built or custom
- **Parameters**:
  - Date Range: Start and end dates
  - Aircraft Selection: All, specific aircraft, groups
  - Include Sections: Checkboxes for report sections
  - Format: PDF, Excel, CSV

#### Generated Reports
- **Table View**: Previously generated reports
- **Columns**: Name, Created Date, Parameters, Status, Actions
- **Actions**: Download, View, Clone, Schedule, Delete

#### Report Viewer
- **Preview**: Inline PDF/document viewer
- **Controls**: Zoom, print, download, share
- **Sections**: Collapsible sections for easy navigation

## Responsive Design

### Mobile (320px - 767px)
- **Navigation**: Hamburger menu, collapsible sidebar
- **Tables**: Horizontal scroll or card layout transformation
- **Charts**: Simplified view, touch-friendly interactions
- **Forms**: Full-width inputs, larger touch targets

### Tablet (768px - 1023px)
- **Sidebar**: Overlay when needed, collapsible
- **Grid**: 2-column layouts where appropriate
- **Charts**: Medium size, interactive tooltips

### Desktop (1024px+)
- **Full Layout**: Sidebar + main content
- **Multi-column**: Utilize full width effectively
- **Advanced Interactions**: Hover states, context menus

## Accessibility

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 for normal text
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels and descriptions
- **Focus Indicators**: Visible focus states
- **Alternative Text**: For all images and icons

### Semantic HTML
- Proper heading hierarchy (h1-h6)
- Landmark regions (header, nav, main, aside, footer)
- Lists for grouped content
- Tables with proper headers

## Performance

### Loading States
- **Initial Load**: Skeleton screens for main content
- **Data Loading**: Spinners or progress indicators
- **Image Loading**: Placeholder with progressive loading
- **Form Submission**: Loading states, disable during processing

### Optimization
- **Code Splitting**: Route-based chunks
- **Lazy Loading**: Components and images
- **Caching**: API responses, static assets
- **Bundling**: Optimized builds, tree shaking

## Animations & Interactions

### Micro-interactions
- **Button Hover**: Subtle color/shadow changes
- **Form Focus**: Smooth focus ring transitions
- **Card Hover**: Lift effect with shadow
- **Navigation**: Smooth slide transitions

### Page Transitions
- **Route Changes**: Fade or slide transitions
- **Modal Open/Close**: Scale and fade effects
- **Sidebar Toggle**: Slide animations
- **Tab Switching**: Smooth content transitions

### Loading Animations
- **Skeleton Loading**: Shimmer effect
- **Spinner**: Smooth rotation
- **Progress Bars**: Smooth fill animations
- **Data Updates**: Fade in new content

## Technology Stack

### Core
- **React 18**: Latest features, concurrent rendering
- **TypeScript**: Type safety, better developer experience
- **Vite**: Fast development server and build tool

### Styling
- **Tailwind CSS**: Utility-first styling
- **Custom CSS Variables**: Design tokens
- **PostCSS**: CSS processing and optimization

### State Management
- **React Query/TanStack Query**: Server state management
- **Zustand**: Local state management
- **React Hook Form**: Form state and validation

### Charts & Visualization
- **Recharts**: React-based charting library
- **D3.js**: Advanced custom visualizations
- **React Virtualized**: Performance for large datasets

### UI Components
- **Headless UI**: Unstyled, accessible components
- **React Aria**: Accessibility primitives
- **Framer Motion**: Advanced animations

This specification provides the foundation for implementing a comprehensive, modern aviation compliance frontend using Magic MCP.