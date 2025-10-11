import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
// import Topbar from './TopBarOld';

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div
        className="transition-all duration-300"
        style={{
          marginLeft: sidebarCollapsed ? '64px' : '280px',
        }}
      >
        {/* <Topbar /> */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}