import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Plane,
  Shield,
  FileText,
  History,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmbraerSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Aeronaves',
    href: '/aeronaves',
    icon: Plane,
  },
  {
    name: 'Verificar Compliance',
    href: '/compliance/verificar',
    icon: Shield,
  },
  {
    name: 'Regulamentações',
    href: '/regulamentacoes',
    icon: FileText,
  },
  {
    name: 'Histórico',
    href: '/historico',
    icon: History,
  },
];

export default function EmbraerSidebar({ collapsed, onToggle }: EmbraerSidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white border-r border-neutral-200 transition-all duration-300 z-40',
        collapsed ? 'w-16' : 'w-[280px]'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-embraer-blue-primary to-embraer-accent flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm text-neutral-900">Embraer</div>
              <div className="text-xs text-neutral-500">Compliance</div>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn('h-8 w-8', collapsed && 'mx-auto')}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                'hover:bg-neutral-100',
                isActive
                  ? 'bg-embraer-blue-primary text-white hover:bg-embraer-blue-dark'
                  : 'text-neutral-700'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium text-sm">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}