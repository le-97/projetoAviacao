// Aviation Component Integration Tests
// aviation-frontend/src/components/__tests__/Aviation.integration.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AviationDashboard from '../AviationDashboard';
import ComplianceCheck from '../ComplianceCheck';
import AircraftSpecifications from '../AircraftSpecifications';

describe('Aviation Component Integration Tests', () => {
  beforeEach(() => {
    // Clear any previous API call history
    fetch.mockClear();
  });

  describe('AviationDashboard Component', () => {
    test('should load and display aviation dashboard with API data', async () => {
      render(<AviationDashboard />);
      
      // Check if loading state is shown initially
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      
      // Wait for API data to load
      await waitFor(() => {
        expect(screen.getByText('Aviation Compliance API operational')).toBeInTheDocument();
      });
      
      // Verify health status is displayed
      expect(screen.getByText('healthy')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument(); // aircraft models loaded
    });

    test('should handle API errors gracefully', async () => {
      // Mock API error
      fetch.mockRejectedValueOnce(new Error('API Error'));
      
      render(<AviationDashboard />);
      
      await waitFor(() => {
        expect(screen.getByText(/error loading dashboard/i)).toBeInTheDocument();
      });
    });
  });

  describe('ComplianceCheck Component', () => {
    test('should perform compliance check with form interaction', async () => {
      render(<ComplianceCheck />);
      
      // Select aircraft model
      const modelSelect = screen.getByLabelText(/aircraft model/i);
      fireEvent.change(modelSelect, { target: { value: 'E190-E2' } });
      
      // Select authority
      const authoritySelect = screen.getByLabelText(/authority/i);
      fireEvent.change(authoritySelect, { target: { value: 'FAA' } });
      
      // Submit form
      const submitButton = screen.getByRole('button', { name: /check compliance/i });
      fireEvent.click(submitButton);
      
      // Wait for results
      await waitFor(() => {
        expect(screen.getByText('COMPLIANT')).toBeInTheDocument();
        expect(screen.getByText('98.5')).toBeInTheDocument(); // compliance score
      });
      
      // Verify compliance details are shown
      expect(screen.getByText('ICAO Chapter 14')).toBeInTheDocument();
      expect(screen.getByText('Stage 5')).toBeInTheDocument();
    });

    test('should display compliance results with detailed breakdown', async () => {
      render(<ComplianceCheck />);
      
      // Trigger compliance check
      const modelSelect = screen.getByLabelText(/aircraft model/i);
      fireEvent.change(modelSelect, { target: { value: 'E190-E2' } });
      
      const authoritySelect = screen.getByLabelText(/authority/i);
      fireEvent.change(authoritySelect, { target: { value: 'FAA' } });
      
      fireEvent.click(screen.getByRole('button', { name: /check compliance/i }));
      
      // Wait for detailed results
      await waitFor(() => {
        expect(screen.getByText('2 × PW1900G (Geared Turbofan)')).toBeInTheDocument();
        expect(screen.getByText('Honeywell Primus Epic 2 + Fly-by-wire')).toBeInTheDocument();
      });
    });

    test('should handle invalid aircraft model', async () => {
      render(<ComplianceCheck />);
      
      // Select invalid model
      const modelSelect = screen.getByLabelText(/aircraft model/i);
      fireEvent.change(modelSelect, { target: { value: 'INVALID-MODEL' } });
      
      const authoritySelect = screen.getByLabelText(/authority/i);
      fireEvent.change(authoritySelect, { target: { value: 'FAA' } });
      
      fireEvent.click(screen.getByRole('button', { name: /check compliance/i }));
      
      // Should show error for invalid model
      await waitFor(() => {
        expect(screen.getByText(/model.*not found/i)).toBeInTheDocument();
      });
    });
  });

  describe('AircraftSpecifications Component', () => {
    test('should load and display aircraft specifications', async () => {
      render(<AircraftSpecifications model="E190-E2" />);
      
      // Wait for specifications to load
      await waitFor(() => {
        expect(screen.getByText('E190-E2')).toBeInTheDocument();
        expect(screen.getByText('114')).toBeInTheDocument(); // seats
        expect(screen.getByText('124341')).toBeInTheDocument(); // MTOW
        expect(screen.getByText('2850')).toBeInTheDocument(); // range
      });
      
      // Verify technical details
      expect(screen.getByText('2 × PW1900G (Geared Turbofan)')).toBeInTheDocument();
      expect(screen.getByText('ICAO Chapter 14')).toBeInTheDocument();
      expect(screen.getByText('A+')).toBeInTheDocument(); // safety rating
    });

    test('should display E1 series specifications correctly', async () => {
      render(<AircraftSpecifications model="E175" />);
      
      await waitFor(() => {
        expect(screen.getByText('E175')).toBeInTheDocument();
        expect(screen.getByText('E1')).toBeInTheDocument(); // series
        expect(screen.getByText('88')).toBeInTheDocument(); // seats
        expect(screen.getByText('89000')).toBeInTheDocument(); // MTOW
      });
      
      // Verify E1 series engine type
      expect(screen.getByText('2 × GE CF34-8E (14,200 lbf)')).toBeInTheDocument();
      expect(screen.getByText('ICAO Chapter 4')).toBeInTheDocument();
    });

    test('should handle non-existent aircraft model', async () => {
      render(<AircraftSpecifications model="NON-EXISTENT" />);
      
      await waitFor(() => {
        expect(screen.getByText(/aircraft model.*not found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Fleet Analytics Integration', () => {
    test('should load fleet metrics from analytics endpoint', async () => {
      // This test would be for a FleetAnalytics component
      // Assuming we have such a component
      const FleetAnalytics = () => {
        const [metrics, setMetrics] = React.useState(null);
        
        React.useEffect(() => {
          fetch('https://aviation-compliance-app.wonderfulsea-d38b4e92.eastus.azurecontainerapps.io/analytics/fleet-metrics')
            .then(res => res.json())
            .then(setMetrics);
        }, []);
        
        if (!metrics) return <div>Loading...</div>;
        
        return (
          <div>
            <h2>Fleet Analytics</h2>
            <p>Total Models: {metrics.total_models}</p>
            <p>E1 Series: {metrics.e1_series_count}</p>
            <p>E2 Series: {metrics.e2_series_count}</p>
            <p>Average Compliance: {metrics.average_compliance_score}%</p>
            <div>
              Latest Models: {metrics.latest_models.join(', ')}
            </div>
          </div>
        );
      };
      
      render(<FleetAnalytics />);
      
      await waitFor(() => {
        expect(screen.getByText('Total Models: 7')).toBeInTheDocument();
        expect(screen.getByText('E1 Series: 4')).toBeInTheDocument();
        expect(screen.getByText('E2 Series: 3')).toBeInTheDocument();
        expect(screen.getByText('Average Compliance: 95.3%')).toBeInTheDocument();
      });
      
      // Verify latest models are displayed
      expect(screen.getByText('E175-E2, E190-E2, E195-E2')).toBeInTheDocument();
    });
  });

  describe('Cross-Component Integration', () => {
    test('should navigate between components and maintain state', async () => {
      // This would test navigation between different views
      // For example, clicking on an aircraft model in the dashboard
      // should navigate to its specifications page
      
      const App = () => {
        const [selectedModel, setSelectedModel] = React.useState(null);
        
        return (
          <div>
            <button onClick={() => setSelectedModel('E190-E2')}>
              Select E190-E2
            </button>
            {selectedModel && <AircraftSpecifications model={selectedModel} />}
          </div>
        );
      };
      
      render(<App />);
      
      // Click to select model
      fireEvent.click(screen.getByText('Select E190-E2'));
      
      // Wait for specifications to load
      await waitFor(() => {
        expect(screen.getByText('E190-E2')).toBeInTheDocument();
        expect(screen.getByText('114')).toBeInTheDocument(); // seats
      });
    });
  });
});