import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EmbraerDashboard } from './pages/EmbraerDashboard';
import { ComplianceChecker } from './pages/ComplianceChecker';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { DesktopNav } from './components/DesktopNav';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navegação Desktop - Sempre visível em telas >= 768px */}
        <DesktopNav />
        
        {/* Navegação Mobile - Botão de avião visível em telas < 768px */}
        <MobileNav />
        
        <main className="flex-grow md:pt-16">
          <Routes>
            <Route path="/" element={<EmbraerDashboard />} />
            <Route path="/compliance" element={<ComplianceChecker />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
