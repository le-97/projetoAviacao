import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EmbraerDashboard } from './pages/EmbraerDashboard';
import { ComplianceChecker } from './pages/ComplianceChecker';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmbraerDashboard />} />
        <Route path="/compliance" element={<ComplianceChecker />} />
      </Routes>
    </Router>
  );
}

export default App;
