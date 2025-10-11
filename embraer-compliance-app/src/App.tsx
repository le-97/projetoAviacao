import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { queryClient } from '@/lib/queryClient';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { AircraftCatalog } from '@/pages/AircraftCatalog';
import { AircraftDetails } from '@/pages/AircraftDetails';
import { ComplianceCheck } from '@/pages/ComplianceCheck';
import { Regulations } from '@/pages/Regulations';
import { History } from '@/pages/History';
import { useAppStore } from '@/stores/useAppStore';
import { useEffect } from 'react';

function App() {
  const { theme } = useAppStore();

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="aeronaves" element={<AircraftCatalog />} />
            <Route path="aeronaves/:id" element={<AircraftDetails />} />
            <Route path="compliance/verificar" element={<ComplianceCheck />} />
            <Route path="regulamentacoes" element={<Regulations />} />
            <Route path="historico" element={<History />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;