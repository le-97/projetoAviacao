import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plane, 
  ClipboardCheck, 
  BookOpen, 
  FileText,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/useAppStore';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Aeronaves', href: '/aeronaves', icon: Plane },
  { name: 'Verificar Compliance', href: '/compliance/verificar', icon: ClipboardCheck },
  { name: 'Regulamentações', href: '/regulamentacoes', icon: BookOpen },
  { name: 'Histórico', href: '/historico', icon: FileText },
];

export function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-embraer-blue rounded flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-embraer-dark">Embraer</h1>
              <p className="text-xs text-muted-foreground">Compliance</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-muted rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-embraer-blue text-white'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            <p>© 2025 Embraer S.A.</p>
            <p className="mt-1">Versão 1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}