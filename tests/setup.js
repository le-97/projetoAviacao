// Jest setup file for Aviation Compliance API tests
// tests/setup.js

const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.test' });

// Global test configuration
global.API_BASE_URL = process.env.API_BASE_URL || 'https://aviation-compliance-app.graytree-b170d21d.eastus.azurecontainerapps.io';
global.AZURE_API_URL = process.env.AZURE_API_URL || 'https://aviation-compliance-app.graytree-b170d21d.eastus.azurecontainerapps.io';

// Test timeouts
jest.setTimeout(30000);

// Global test hooks
beforeAll(async () => {
  console.log('🚀 Starting Aviation Compliance API Tests');
  console.log(`📡 Testing against: ${global.API_BASE_URL}`);
});

afterAll(async () => {
  console.log('✅ All tests completed');
});

// Mock console methods for cleaner test output
global.console = {
  ...console,
  // Uncomment to suppress logs during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Global test utilities
global.testUtils = {
  // Wait for API to be ready
  waitForAPI: async (url = global.API_BASE_URL, maxAttempts = 10) => {
    const axios = require('axios');
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await axios.get(`${url}/health`, { timeout: 5000 });
        console.log(`✅ API ready after ${attempt} attempts`);
        return true;
      } catch (error) {
        console.log(`⏳ API not ready, attempt ${attempt}/${maxAttempts}`);
        if (attempt === maxAttempts) {
          throw new Error(`API not ready after ${maxAttempts} attempts`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  },
  
  // Generate test data
  generateAircraftModel: () => {
    const models = ['E170', 'E175', 'E190', 'E195', 'E175-E2', 'E190-E2', 'E195-E2'];
    return models[Math.floor(Math.random() * models.length)];
  },
  
  generateAuthority: () => {
    const authorities = ['FAA', 'EASA', 'ANAC', 'ICAO'];
    return authorities[Math.floor(Math.random() * authorities.length)];
  }
};