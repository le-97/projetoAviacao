import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EmbraerDashboard } from './pages/EmbraerDashboard';
import { ComplianceChecker } from './pages/ComplianceChecker';
import { Footer } from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
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
