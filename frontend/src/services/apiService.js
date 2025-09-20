import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.detail || 'Bad request');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error - please try again later');
    }
    
    throw error;
  }
);

// API service methods
export const apiService = {
  // Health and system endpoints
  async getHealth() {
    const response = await api.get('/compliance/health');
    return response.data;
  },

  async getSystemHealth() {
    const response = await api.get('/health');
    return response.data;
  },

  // Compliance endpoints
  async checkCompliance(model, country) {
    const response = await api.get(`/compliance/check/${model}/${country}`);
    return response.data;
  },

  async checkComplianceLegacy(model, country) {
    const response = await api.get('/compliance/check-compliance', {
      params: { model, country }
    });
    return response.data;
  },

  // Aircraft and models endpoints
  async getSupportedModels() {
    const response = await api.get('/compliance/models');
    return response.data;
  },

  async getAircraftModels() {
    const response = await api.get('/compliance/aircraft');
    return response.data;
  },

  // Regulations endpoints
  async getRegulations(model, country) {
    const response = await api.get(`/compliance/regulations/${model}/${country}`);
    return response.data;
  },

  async getAuthorities() {
    const response = await api.get('/compliance/authorities');
    return response.data;
  },

  // Metrics endpoints (if available)
  async getMetrics() {
    try {
      const response = await api.get('/metrics');
      return response.data;
    } catch (error) {
      // Metrics might not be available in development
      console.warn('Metrics endpoint not available:', error.message);
      return null;
    }
  },

  // Cache endpoints (if available)
  async getCacheStats() {
    try {
      const response = await api.get('/cache/stats');
      return response.data;
    } catch (error) {
      // Cache might not be available in development
      console.warn('Cache endpoint not available:', error.message);
      return null;
    }
  },

  async clearCache() {
    try {
      const response = await api.post('/cache/clear');
      return response.data;
    } catch (error) {
      console.warn('Cache clear endpoint not available:', error.message);
      return null;
    }
  },
};

// Utility functions for common API operations
export const apiUtils = {
  // Format error messages for display
  formatErrorMessage(error) {
    if (error.response?.data?.detail) {
      return error.response.data.detail;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  // Check if API is available
  async checkApiAvailability() {
    try {
      await api.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  },

  // Validate aircraft model format
  isValidAircraftModel(model) {
    const validModels = [
      'E175', 'E175-E1', 'E175-E2',
      'E190', 'E190-E1', 'E190-E2',
      'E195', 'E195-E1', 'E195-E2',
      '737', '737-800',
      'A320', 'A320neo'
    ];
    return validModels.includes(model);
  },

  // Validate country format
  isValidCountry(country) {
    const validCountries = ['USA', 'BRAZIL', 'EUROPE'];
    return validCountries.includes(country.toUpperCase());
  },

  // Format compliance status for display
  formatComplianceStatus(status) {
    switch (status) {
      case 'COMPLIANT':
        return 'Compliant';
      case 'PARTIAL_COMPLIANCE':
        return 'Partial Compliance';
      case 'NON_COMPLIANT':
        return 'Non-Compliant';
      case 'PENDING':
        return 'Pending Review';
      default:
        return status;
    }
  },

  // Get status color for UI components
  getStatusColor(status) {
    switch (status) {
      case 'COMPLIANT':
        return 'success';
      case 'PARTIAL_COMPLIANCE':
        return 'warning';
      case 'NON_COMPLIANT':
        return 'error';
      case 'PENDING':
        return 'info';
      default:
        return 'default';
    }
  },
};

export default api;