import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AircraftList from './components/AircraftList';
import ComplianceChecker from './components/ComplianceChecker';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import Navigation from './components/Navigation';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'aircraft':
        return <AircraftList />;
      case 'compliance':
        return <ComplianceChecker />;
      case 'requirements':
        return (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Requisitos Regulamentares</h2>
            <p className="text-gray-600">Esta seção está em desenvolvimento.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Configurações</h2>
            <p className="text-gray-600">Esta seção está em desenvolvimento.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {renderCurrentPage()}
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
