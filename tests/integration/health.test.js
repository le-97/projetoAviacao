/**
 * Integration Tests for Aviation Compliance API - Health Endpoints
 * Tests the health check and system status endpoints
 */

const request = require('supertest');
const axios = require('axios');

describe('Health Endpoints', () => {
  let apiUrl;

  beforeAll(async () => {
    // Use Azure URL for integration tests, fallback to local
    apiUrl = global.AZURE_API_URL;
    
    // Wait for API to be ready
    await global.testUtils.waitForAPI(apiUrl);
  });

  describe('GET /health', () => {
    test('should return healthy status', async () => {
      const response = await axios.get(`${apiUrl}/health`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('status', 'healthy');
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('timestamp');
      expect(response.data).toHaveProperty('aircraft_models_loaded');
      
      // Validate timestamp format
      expect(new Date(response.data.timestamp)).toBeInstanceOf(Date);
      
      // Validate aircraft models count
      expect(response.data.aircraft_models_loaded).toBeGreaterThan(0);
      expect(response.data.aircraft_models_loaded).toBe(7); // E-Jets family
    });

    test('should have correct response headers', async () => {
      const response = await axios.get(`${apiUrl}/health`);
      
      expect(response.headers['content-type']).toMatch(/application\/json/);
      expect(response.headers).toHaveProperty('server', 'uvicorn');
    });

    test('should respond within acceptable time', async () => {
      const startTime = Date.now();
      await axios.get(`${apiUrl}/health`);
      const responseTime = Date.now() - startTime;
      
      expect(responseTime).toBeLessThan(5000); // 5 seconds max
    });
  });

  describe('GET /', () => {
    test('should return API information', async () => {
      const response = await axios.get(`${apiUrl}/`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('service');
      expect(response.data).toHaveProperty('version', '3.0.0');
      expect(response.data).toHaveProperty('status', 'operational');
      expect(response.data).toHaveProperty('aircraft_count', 7);
      expect(response.data).toHaveProperty('database', 'In-Memory');
      expect(response.data).toHaveProperty('documentation', '/docs');
      expect(response.data).toHaveProperty('environment', 'production');
    });
  });

  describe('Health Check Reliability', () => {
    test('should handle multiple concurrent requests', async () => {
      const requests = Array(5).fill().map(() => 
        axios.get(`${apiUrl}/health`)
      );
      
      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.data.status).toBe('healthy');
      });
    });

    test('should maintain consistent response structure', async () => {
      const responses = await Promise.all([
        axios.get(`${apiUrl}/health`),
        axios.get(`${apiUrl}/health`),
        axios.get(`${apiUrl}/health`)
      ]);

      const [first, second, third] = responses.map(r => r.data);
      
      // Same structure
      expect(Object.keys(first).sort()).toEqual(Object.keys(second).sort());
      expect(Object.keys(second).sort()).toEqual(Object.keys(third).sort());
      
      // Same static values
      expect(first.status).toBe(second.status);
      expect(first.aircraft_models_loaded).toBe(second.aircraft_models_loaded);
    });
  });
});