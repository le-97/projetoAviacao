import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import EmbraerSidebar from './EmbraerSidebar';
import EmbraerTopbar from './EmbraerTopbar';

export default function EmbraerLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      <EmbraerSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div
        className="transition-all duration-300"
        style={{
          marginLeft: sidebarCollapsed ? '64px' : '280px',
        }}
      >
        <EmbraerTopbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}