import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import ComplianceCheck from './pages/ComplianceCheck/ComplianceCheck';
import AircraftModels from './pages/AircraftModels/AircraftModels';
import Regulations from './pages/Regulations/Regulations';
import Reports from './pages/Reports/Reports';

function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/compliance-check" element={<ComplianceCheck />} />
          <Route path="/aircraft-models" element={<AircraftModels />} />
          <Route path="/regulations" element={<Regulations />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </Layout>
    </Box>
  );
}

export default App;