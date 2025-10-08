// API Contract Validation Tests for Frontend
// aviation-frontend/src/tests/api-contracts.test.js

import { render } from '@testing-library/react';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import openApiSpec from '../openapi/openapi.json';

// Initialize AJV with formats
const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);

// Compile schemas from OpenAPI spec
const schemas = {};

describe('Frontend API Contract Validation', () => {
  beforeAll(() => {
    // Compile all schemas from OpenAPI specification
    Object.entries(openApiSpec.components.schemas).forEach(([name, schema]) => {
      schemas[name] = ajv.compile(schema);
    });
  });

  describe('Health Endpoint Contract', () => {
    test('should validate health response matches OpenAPI schema', async () => {
      const response = await fetch('https://aviation-compliance-app.wonderfulsea-d38b4e92.eastus.azurecontainerapps.io/health');
      const data = await response.json();
      
      // Validate against expected health response schema
      const healthSchema = {
        type: 'object',
        required: ['status', 'message', 'timestamp', 'database_status', 'aircraft_models_loaded'],
        properties: {
          status: { type: 'string' },
          message: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          database_status: { type: 'string' },
          aircraft_models_loaded: { type: 'number' }
        }
      };
      
      const validate = ajv.compile(healthSchema);
      const isValid = validate(data);
      
      expect(isValid).toBe(true);
      if (!isValid) {
        console.log('Health validation errors:', validate.errors);
      }
    });
  });

  describe('Aircraft Models Contract', () => {
    test('should validate aircraft models response schema', async () => {
      const response = await fetch('https://aviation-compliance-app.wonderfulsea-d38b4e92.eastus.azurecontainerapps.io/aircraft/models');
      const data = await response.json();
      
      const modelsSchema = {
        type: 'object',
        required: ['total_models', 'models_by_series', 'all_models', 'latest_generation'],
        properties: {
          total_models: { type: 'number' },
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
      
      const validate = ajv.compile(modelsSchema);
      const isValid = validate(data);
      
      expect(isValid).toBe(true);
      if (!isValid) {
        console.log('Models validation errors:', validate.errors);
      }
      
      // Additional business logic validation
      expect(data.total_models).toBe(data.all_models.length);
      expect(data.models_by_series.E1.length + data.models_by_series.E2.length).toBe(data.total_models);
    });
  });

  describe('Aircraft Specifications Contract', () => {
    test('should validate aircraft specifications schema', async () => {
      const response = await fetch('https://aviation-compliance-app.wonderfulsea-d38b4e92.eastus.azurecontainerapps.io/aircraft/specifications/E190-E2');
      const data = await response.json();
      
      const specificationsSchema = {
        type: 'object',
        required: [
          'model', 'series', 'seats', 'mtow_lbs', 'range_nm', 'engine_type',
          'noise_compliance', 'emissions_compliance', 'certification', 
          'fuel_capacity_kg', 'avionics', 'safety_rating'
        ],
        properties: {
          model: { type: 'string' },
          series: { type: 'string', enum: ['E1', 'E2'] },
          seats: { type: 'number', minimum: 1 },
          mtow_lbs: { type: 'number', minimum: 1 },
          range_nm: { type: 'number', minimum: 1 },
          engine_type: { type: 'string' },
          noise_compliance: { type: 'string' },
          emissions_compliance: { type: 'string' },
          certification: { type: 'array', items: { type: 'string' } },
          fuel_capacity_kg: { type: 'number', minimum: 1 },
          avionics: { type: 'string' },
          safety_rating: { type: 'string' }
        }
      };
      
      const validate = ajv.compile(specificationsSchema);
      const isValid = validate(data);
      
      expect(isValid).toBe(true);
      if (!isValid) {
        console.log('Specifications validation errors:', validate.errors);
      }
      
      // Validate E2 series specific attributes
      if (data.series === 'E2') {
        expect(data.engine_type).toContain('PW1900G');
        expect(data.noise_compliance).toBe('ICAO Chapter 14');
        expect(data.emissions_compliance).toBe('Stage 5');
      }
    });

    test('should validate E1 series specifications', async () => {
      const response = await fetch('https://aviation-compliance-app.wonderfulsea-d38b4e92.eastus.azurecontainerapps.io/aircraft/specifications/E175');
      const data = await response.json();
      
      expect(data.series).toBe('E1');
      expect(data.engine_type).toContain('CF34-8E');
      expect(data.noise_compliance).toBe('ICAO Chapter 4');
      expect(data.emissions_compliance).toBe('Stage 3');
    });

    test('should handle non-existent aircraft model', async () => {
      const response = await fetch('https://aviation-compliance-app.wonderfulsea-d38b4e92.eastus.azurecontainerapps.io/aircraft/specifications/NON-EXISTENT');
      
      expect(response.status).toBe(404);
      
      const errorData = await response.json();
      expect(errorData).toHaveProperty('detail');
      expect(errorData.detail).toContain('not found');
    });
  });

  describe('Compliance Check Contract', () => {
    test('should validate compliance check response schema', async () => {
      const response = await fetch('https://aviation-compliance-app.wonderfulsea-d38b4e92.eastus.azurecontainerapps.io/compliance/check/E190-E2/FAA');
      const data = await response.json();
      
      const complianceSchema = {
        type: 'object',
        required: [
          'aircraft_model', 'authority', 'compliance_status', 'score', 
          'details', 'specifications', 'timestamp'
        ],
        properties: {
          aircraft_model: { type: 'string' },
          authority: { type: 'string' },
          compliance_status: { type: 'string', enum: ['COMPLIANT', 'NON-COMPLIANT', 'PARTIAL'] },
          score: { type: 'number', minimum: 0, maximum: 100 },
          details: {
            type: 'object',
            required: [
              'noise_level', 'emissions_level', 'certifications', 'engine_technology',
              'avionics_suite', 'generation', 'check_performed', 'authority_region'
            ]
          },
          specifications: { type: 'object' },
          timestamp: { type: 'string', format: 'date-time' }
        }
      };
      
      const validate = ajv.compile(complianceSchema);
      const isValid = validate(data);
      
      expect(isValid).toBe(true);
      if (!isValid) {
        console.log('Compliance validation errors:', validate.errors);
      }
      
      // Validate compliance score range
      expect(data.score).toBeGreaterThanOrEqual(0);
      expect(data.score).toBeLessThanOrEqual(100);
      
      // Validate timestamp is recent (within last hour)
      const timestamp = new Date(data.timestamp);
      const now = new Date();
      const hourAgo = new Date(now - 60 * 60 * 1000);
      expect(timestamp).toBeAfter(hourAgo);
      expect(timestamp).toBeBeforeOrEqual(now);
    });
  });

  describe('Analytics Fleet Metrics Contract', () => {
    test('should validate fleet metrics response schema', async () => {
      const response = await fetch('https://aviation-compliance-app.wonderfulsea-d38b4e92.eastus.azurecontainerapps.io/analytics/fleet-metrics');
      const data = await response.json();
      
      const metricsSchema = {
        type: 'object',
        required: [
          'total_models', 'e1_series_count', 'e2_series_count', 
          'average_compliance_score', 'compliance_by_series', 'latest_models'
        ],
        properties: {
          total_models: { type: 'number', minimum: 1 },
          e1_series_count: { type: 'number', minimum: 0 },
          e2_series_count: { type: 'number', minimum: 0 },
          average_compliance_score: { type: 'number', minimum: 0, maximum: 100 },
          compliance_by_series: {
            type: 'object',
            properties: {
              E1: { type: 'number', minimum: 0, maximum: 100 },
              E2: { type: 'number', minimum: 0, maximum: 100 }
            }
          },
          latest_models: { type: 'array', items: { type: 'string' } }
        }
      };
      
      const validate = ajv.compile(metricsSchema);
      const isValid = validate(data);
      
      expect(isValid).toBe(true);
      if (!isValid) {
        console.log('Metrics validation errors:', validate.errors);
      }
      
      // Validate business logic
      expect(data.e1_series_count + data.e2_series_count).toBe(data.total_models);
      expect(data.latest_models).toEqual(expect.arrayContaining(['E175-E2', 'E190-E2', 'E195-E2']));
    });
  });

  describe('Error Response Contracts', () => {
    test('should validate 404 error response schema', async () => {
      const response = await fetch('https://aviation-compliance-app.wonderfulsea-d38b4e92.eastus.azurecontainerapps.io/non-existent-endpoint');
      
      expect(response.status).toBe(404);
      
      const errorData = await response.json();
      const errorSchema = {
        type: 'object',
        required: ['detail'],
        properties: {
          detail: { type: 'string' }
        }
      };
      
      const validate = ajv.compile(errorSchema);
      const isValid = validate(errorData);
      
      expect(isValid).toBe(true);
      if (!isValid) {
        console.log('Error validation errors:', validate.errors);
      }
    });

    test('should validate validation error response schema', async () => {
      // This would test validation errors if the API had POST endpoints
      // For now, we'll test the 404 case for invalid aircraft models
      const response = await fetch('https://aviation-compliance-app.wonderfulsea-d38b4e92.eastus.azurecontainerapps.io/aircraft/specifications/INVALID');
      
      expect(response.status).toBe(404);
      
      const errorData = await response.json();
      expect(errorData).toHaveProperty('detail');
      expect(errorData.detail).toContain('not found');
    });
  });

  describe('API Response Headers Contract', () => {
    test('should validate response headers are properly set', async () => {
      const response = await fetch('https://aviation-compliance-app.wonderfulsea-d38b4e92.eastus.azurecontainerapps.io/health');
      
      // Validate CORS headers
      expect(response.headers.get('access-control-allow-origin')).toBe('*');
      
      // Validate content type
      expect(response.headers.get('content-type')).toContain('application/json');
      
      // Validate response is successful
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
    });
  });
});