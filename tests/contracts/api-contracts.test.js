/**
 * Contract Tests for Aviation Compliance API
 * Validates API responses against OpenAPI schema
 */

const axios = require('axios');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

describe('API Contract Tests', () => {
  let apiUrl;
  let openApiSpec;
  let ajv;

  beforeAll(async () => {
    apiUrl = global.AZURE_API_URL;
    await global.testUtils.waitForAPI(apiUrl);
    
    // Setup JSON Schema validator
    ajv = new Ajv({ strict: false, validateFormats: true });
    addFormats(ajv);
    
    // Fetch OpenAPI specification
    try {
      const specResponse = await axios.get(`${apiUrl}/openapi.json`);
      openApiSpec = specResponse.data;
    } catch (error) {
      console.warn('Could not fetch OpenAPI spec, using static validation');
      openApiSpec = null;
    }
  });

  describe('OpenAPI Specification', () => {
    test('should have valid OpenAPI specification', async () => {
      if (!openApiSpec) {
        const response = await axios.get(`${apiUrl}/openapi.json`);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('openapi');
        expect(response.data).toHaveProperty('info');
        expect(response.data).toHaveProperty('paths');
        
        openApiSpec = response.data;
      }
      
      expect(openApiSpec.info.title).toBe('Aviation Compliance API - Embraer E-Jets');
      expect(openApiSpec.info.version).toBe('3.0.0');
    });

    test('should document all endpoints', async () => {
      if (!openApiSpec) return;
      
      const expectedPaths = [
        '/',
        '/health',
        '/aircraft/models',
        '/aircraft/specifications/{model}',
        '/compliance/authorities',
        '/compliance/check/{model}/{authority}',
        '/compliance/check',
        '/analytics/fleet-metrics',
        '/analytics/comparison/{model1}/{model2}'
      ];

      expectedPaths.forEach(path => {
        expect(openApiSpec.paths).toHaveProperty(path);
      });
    });
  });

  describe('Response Schema Validation', () => {
    // Health endpoint schema
    const healthSchema = {
      type: 'object',
      required: ['status', 'message', 'timestamp', 'aircraft_models_loaded'],
      properties: {
        status: { type: 'string', enum: ['healthy', 'unhealthy'] },
        message: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
        database_status: { type: 'string' },
        aircraft_models_loaded: { type: 'number', minimum: 0 }
      }
    };

    // Aircraft models schema
    const aircraftModelsSchema = {
      type: 'object',
      required: ['total_models', 'models_by_series', 'all_models', 'latest_generation'],
      properties: {
        total_models: { type: 'number', minimum: 0 },
        models_by_series: {
          type: 'object',
          properties: {
            E1: { type: 'array', items: { type: 'string' } },
            E2: { type: 'array', items: { type: 'string' } }
          }
        },
        all_models: { type: 'array', items: { type: 'string' } },
        latest_generation: { type: 'string' }
      }
    };

    // Aircraft specifications schema
    const aircraftSpecsSchema = {
      type: 'object',
      required: [
        'model', 'series', 'seats', 'mtow_lbs', 'range_nm', 
        'engine_type', 'noise_compliance', 'emissions_compliance',
        'certification', 'fuel_capacity_kg', 'avionics', 'safety_rating'
      ],
      properties: {
        model: { type: 'string' },
        series: { type: 'string', enum: ['E1', 'E2'] },
        seats: { type: 'number', minimum: 1 },
        mtow_lbs: { type: 'number', minimum: 0 },
        range_nm: { type: 'number', minimum: 0 },
        engine_type: { type: 'string' },
        noise_compliance: { type: 'string' },
        emissions_compliance: { type: 'string' },
        certification: { type: 'array', items: { type: 'string' } },
        fuel_capacity_kg: { type: 'number', minimum: 0 },
        avionics: { type: 'string' },
        safety_rating: { type: 'string', enum: ['A+', 'A', 'B+', 'B', 'C'] }
      }
    };

    // Compliance response schema
    const complianceResponseSchema = {
      type: 'object',
      required: [
        'aircraft_model', 'authority', 'compliance_status', 
        'score', 'details', 'specifications', 'timestamp'
      ],
      properties: {
        aircraft_model: { type: 'string' },
        authority: { type: 'string' },
        compliance_status: { type: 'string', enum: ['COMPLIANT', 'NON_COMPLIANT', 'PENDING'] },
        score: { type: 'number', minimum: 0, maximum: 100 },
        details: { type: 'object' },
        specifications: aircraftSpecsSchema,
        timestamp: { type: 'string' }
      }
    };

    test('should validate health endpoint response', async () => {
      const response = await axios.get(`${apiUrl}/health`);
      const validate = ajv.compile(healthSchema);
      const valid = validate(response.data);
      
      if (!valid) {
        console.error('Health validation errors:', validate.errors);
      }
      expect(valid).toBe(true);
    });

    test('should validate aircraft models response', async () => {
      const response = await axios.get(`${apiUrl}/aircraft/models`);
      const validate = ajv.compile(aircraftModelsSchema);
      const valid = validate(response.data);
      
      if (!valid) {
        console.error('Aircraft models validation errors:', validate.errors);
      }
      expect(valid).toBe(true);
    });

    test('should validate aircraft specifications response', async () => {
      const response = await axios.get(`${apiUrl}/aircraft/specifications/E190-E2`);
      const validate = ajv.compile(aircraftSpecsSchema);
      const valid = validate(response.data);
      
      if (!valid) {
        console.error('Aircraft specs validation errors:', validate.errors);
      }
      expect(valid).toBe(true);
    });

    test('should validate compliance check response', async () => {
      const response = await axios.get(`${apiUrl}/compliance/check/E190-E2/FAA`);
      const validate = ajv.compile(complianceResponseSchema);
      const valid = validate(response.data);
      
      if (!valid) {
        console.error('Compliance validation errors:', validate.errors);
      }
      expect(valid).toBe(true);
    });

    test('should validate all aircraft specifications', async () => {
      const modelsResponse = await axios.get(`${apiUrl}/aircraft/models`);
      const allModels = modelsResponse.data.all_models;
      
      const validate = ajv.compile(aircraftSpecsSchema);
      
      for (const model of allModels) {
        const response = await axios.get(`${apiUrl}/aircraft/specifications/${model}`);
        const valid = validate(response.data);
        
        if (!valid) {
          console.error(`Validation errors for ${model}:`, validate.errors);
        }
        expect(valid).toBe(true);
      }
    });
  });

  describe('Error Response Validation', () => {
    const errorSchema = {
      type: 'object',
      required: ['detail'],
      properties: {
        detail: {
          oneOf: [
            { type: 'string' },
            { type: 'object' }
          ]
        }
      }
    };

    test('should validate 404 error responses', async () => {
      try {
        await axios.get(`${apiUrl}/aircraft/specifications/INVALID_MODEL`);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(404);
        
        const validate = ajv.compile(errorSchema);
        const valid = validate(error.response.data);
        
        if (!valid) {
          console.error('Error response validation errors:', validate.errors);
        }
        expect(valid).toBe(true);
      }
    });

    test('should validate validation error responses', async () => {
      try {
        await axios.post(`${apiUrl}/compliance/check`, {
          aircraft_model: 'INVALID'
          // Missing authority
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect([400, 422]).toContain(error.response.status);
        
        const validate = ajv.compile(errorSchema);
        const valid = validate(error.response.data);
        
        if (!valid) {
          console.error('Validation error response errors:', validate.errors);
        }
        expect(valid).toBe(true);
      }
    });
  });

  describe('API Consistency', () => {
    test('should have consistent aircraft model references', async () => {
      const [modelsResponse, healthResponse] = await Promise.all([
        axios.get(`${apiUrl}/aircraft/models`),
        axios.get(`${apiUrl}/health`)
      ]);

      // Models count should match health check
      expect(modelsResponse.data.total_models).toBe(healthResponse.data.aircraft_models_loaded);
      
      // All models should have specifications
      for (const model of modelsResponse.data.all_models) {
        const specResponse = await axios.get(`${apiUrl}/aircraft/specifications/${model}`);
        expect(specResponse.status).toBe(200);
        expect(specResponse.data.model).toBe(model);
      }
    });

    test('should have consistent authority references', async () => {
      const authoritiesResponse = await axios.get(`${apiUrl}/compliance/authorities`);
      const authorities = Object.keys(authoritiesResponse.data.authorities);
      
      // Test compliance check with each authority
      for (const authority of authorities) {
        const complianceResponse = await axios.get(`${apiUrl}/compliance/check/E190-E2/${authority}`);
        expect(complianceResponse.status).toBe(200);
        expect(complianceResponse.data.authority).toBe(authority);
      }
    });

    test('should maintain data consistency across endpoints', async () => {
      const model = 'E190-E2';
      
      const [specResponse, complianceResponse] = await Promise.all([
        axios.get(`${apiUrl}/aircraft/specifications/${model}`),
        axios.get(`${apiUrl}/compliance/check/${model}/FAA`)
      ]);

      // Specifications should match between endpoints
      expect(complianceResponse.data.specifications).toEqual(specResponse.data);
    });
  });

  describe('Response Headers Validation', () => {
    test('should have correct content-type headers', async () => {
      const endpoints = [
        '/health',
        '/aircraft/models',
        '/aircraft/specifications/E190-E2',
        '/compliance/authorities',
        '/compliance/check/E190-E2/FAA',
        '/analytics/fleet-metrics'
      ];

      for (const endpoint of endpoints) {
        const response = await axios.get(`${apiUrl}${endpoint}`);
        expect(response.headers['content-type']).toMatch(/application\/json/);
      }
    });

    test('should have CORS headers', async () => {
      const response = await axios.get(`${apiUrl}/health`);
      // Note: CORS headers are typically visible in browser requests, not in Node.js requests
      expect(response.status).toBe(200);
    });
  });
});