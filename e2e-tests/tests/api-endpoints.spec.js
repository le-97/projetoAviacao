// Aviation Compliance API - E2E API Tests
// tests/api-endpoints.spec.js

import { test, expect } from '@playwright/test';

const API_BASE_URL = 'https://aviation-compliance-app.graytree-b170d21d.eastus.azurecontainerapps.io';

test.describe('Aviation Compliance API - Production Environment', () => {
  
  test.describe('Health and Root Endpoints', () => {
    test('should return healthy status from health endpoint', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/health`);
      
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('status', 'healthy');
      expect(data).toHaveProperty('message', 'Aviation Compliance API operational');
      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('database_status', 'in-memory');
      expect(data).toHaveProperty('aircraft_models_loaded', 7);
      
      // Validate timestamp format
      const timestamp = new Date(data.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });

    test('should return API information from root endpoint', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/`);
      
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('message', 'Aviation Compliance API - Embraer E-Jets');
      expect(data).toHaveProperty('version', '4.0.0');
      expect(data).toHaveProperty('status', 'operational');
      expect(data).toHaveProperty('aircraft_models', 7);
      expect(data).toHaveProperty('supported_authorities');
      expect(data).toHaveProperty('documentation', '/docs');
      expect(data).toHaveProperty('health_check', '/health');
      
      // Validate supported authorities
      expect(data.supported_authorities).toEqual(['FAA', 'EASA', 'ANAC', 'ICAO']);
    });
  });

  test.describe('Aircraft Endpoints', () => {
    test('should return all aircraft models', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/aircraft/models`);
      
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('total_models', 7);
      expect(data).toHaveProperty('models_by_series');
      expect(data).toHaveProperty('all_models');
      expect(data).toHaveProperty('latest_generation', 'E2 Series with Geared Turbofan engines');
      
      // Validate series breakdown
      expect(data.models_by_series).toHaveProperty('E1');
      expect(data.models_by_series).toHaveProperty('E2');
      expect(data.models_by_series.E1).toEqual(['E170', 'E175', 'E190', 'E195']);
      expect(data.models_by_series.E2).toEqual(['E175-E2', 'E190-E2', 'E195-E2']);
      
      // Validate total models count
      const totalModels = data.models_by_series.E1.length + data.models_by_series.E2.length;
      expect(totalModels).toBe(data.total_models);
      expect(data.all_models.length).toBe(data.total_models);
    });

    test('should return specifications for E190-E2', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/aircraft/specifications/E190-E2`);
      
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('model', 'E190-E2');
      expect(data).toHaveProperty('series', 'E2');
      expect(data).toHaveProperty('seats', 114);
      expect(data).toHaveProperty('mtow_lbs', 124341);
      expect(data).toHaveProperty('range_nm', 2850);
      expect(data).toHaveProperty('engine_type', '2 × PW1900G (Geared Turbofan)');
      expect(data).toHaveProperty('noise_compliance', 'ICAO Chapter 14');
      expect(data).toHaveProperty('emissions_compliance', 'Stage 5');
      expect(data).toHaveProperty('certification');
      expect(data).toHaveProperty('fuel_capacity_kg', 13500);
      expect(data).toHaveProperty('avionics', 'Honeywell Primus Epic 2 + Fly-by-wire');
      expect(data).toHaveProperty('safety_rating', 'A+');
      
      // Validate certification array
      expect(data.certification).toEqual(['FAA Part 25', 'EASA CS-25', 'ICAO Annex 16']);
    });

    test('should return specifications for E175 (E1 series)', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/aircraft/specifications/E175`);
      
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('model', 'E175');
      expect(data).toHaveProperty('series', 'E1');
      expect(data).toHaveProperty('seats', 88);
      expect(data).toHaveProperty('engine_type', '2 × GE CF34-8E (14,200 lbf)');
      expect(data).toHaveProperty('noise_compliance', 'ICAO Chapter 4');
      expect(data).toHaveProperty('emissions_compliance', 'Stage 3');
      expect(data).toHaveProperty('avionics', 'Honeywell Primus Epic');
      expect(data).toHaveProperty('safety_rating', 'A');
    });

    test('should return 404 for non-existent aircraft model', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/aircraft/specifications/NON-EXISTENT`);
      
      expect(response.status()).toBe(404);
      
      const data = await response.json();
      expect(data).toHaveProperty('detail');
      expect(data.detail).toContain('Aircraft model \'NON-EXISTENT\' not found');
    });
  });

  test.describe('Compliance Endpoints', () => {
    test('should return compliance authorities', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/compliance/authorities`);
      
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('authorities');
      expect(data).toHaveProperty('supported_checks');
      expect(data).toHaveProperty('global_standards');
      
      // Validate authorities structure
      expect(data.authorities).toHaveProperty('FAA');
      expect(data.authorities).toHaveProperty('EASA');
      expect(data.authorities).toHaveProperty('ANAC');
      expect(data.authorities).toHaveProperty('ICAO');
      
      expect(data.authorities.FAA).toEqual({ name: 'Federal Aviation Administration', region: 'USA' });
      expect(data.authorities.EASA).toEqual({ name: 'European Union Aviation Safety Agency', region: 'Europe' });
      expect(data.authorities.ANAC).toEqual({ name: 'Agência Nacional de Aviação Civil', region: 'Brazil' });
      expect(data.authorities.ICAO).toEqual({ name: 'International Civil Aviation Organization', region: 'Global' });
      
      // Validate supported checks and standards
      expect(data.supported_checks).toEqual(['full', 'noise', 'emissions', 'safety']);
      expect(data.global_standards).toEqual(['ICAO', 'RVSM', 'TCAS II', 'ADS-B']);
    });

    test('should perform compliance check for E190-E2 with FAA', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/compliance/check/E190-E2/FAA`);
      
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('aircraft_model', 'E190-E2');
      expect(data).toHaveProperty('authority', 'FAA');
      expect(data).toHaveProperty('compliance_status', 'COMPLIANT');
      expect(data).toHaveProperty('score');
      expect(data).toHaveProperty('details');
      expect(data).toHaveProperty('specifications');
      expect(data).toHaveProperty('timestamp');
      
      // Validate compliance score
      expect(data.score).toBeGreaterThanOrEqual(95);
      expect(data.score).toBeLessThanOrEqual(100);
      
      // Validate details structure
      expect(data.details).toHaveProperty('noise_level', 'ICAO Chapter 14');
      expect(data.details).toHaveProperty('emissions_level', 'Stage 5');
      expect(data.details).toHaveProperty('certifications');
      expect(data.details).toHaveProperty('engine_technology', '2 × PW1900G (Geared Turbofan)');
      expect(data.details).toHaveProperty('avionics_suite', 'Honeywell Primus Epic 2 + Fly-by-wire');
      expect(data.details).toHaveProperty('generation', 'E2');
      expect(data.details).toHaveProperty('check_performed', 'full');
      expect(data.details).toHaveProperty('authority_region', 'USA');
      
      // Validate specifications are included
      expect(data.specifications).toHaveProperty('model', 'E190-E2');
      expect(data.specifications).toHaveProperty('series', 'E2');
      
      // Validate timestamp
      const timestamp = new Date(data.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });

    test('should perform compliance check with different check type', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/compliance/check/E175/EASA?check_type=noise`);
      
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('aircraft_model', 'E175');
      expect(data).toHaveProperty('authority', 'EASA');
      expect(data.details).toHaveProperty('check_performed', 'noise');
      expect(data.details).toHaveProperty('authority_region', 'Europe');
    });

    test('should return 404 for invalid aircraft model in compliance check', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/compliance/check/INVALID/FAA`);
      
      expect(response.status()).toBe(404);
      
      const data = await response.json();
      expect(data).toHaveProperty('detail');
      expect(data.detail).toContain('Aircraft model \'INVALID\' not found');
    });

    test('should return 404 for invalid authority in compliance check', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/compliance/check/E190-E2/INVALID`);
      
      expect(response.status()).toBe(404);
      
      const data = await response.json();
      expect(data).toHaveProperty('detail');
      expect(data.detail).toContain('Authority \'INVALID\' not supported');
    });
  });

  test.describe('Analytics Endpoints', () => {
    test('should return fleet metrics', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/analytics/fleet-metrics`);
      
      expect(response.status()).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('total_models', 7);
      expect(data).toHaveProperty('e1_series_count', 4);
      expect(data).toHaveProperty('e2_series_count', 3);
      expect(data).toHaveProperty('average_compliance_score');
      expect(data).toHaveProperty('compliance_by_series');
      expect(data).toHaveProperty('latest_models');
      
      // Validate series counts
      expect(data.e1_series_count + data.e2_series_count).toBe(data.total_models);
      
      // Validate compliance scores
      expect(data.average_compliance_score).toBeGreaterThan(90);
      expect(data.average_compliance_score).toBeLessThanOrEqual(100);
      
      expect(data.compliance_by_series).toHaveProperty('E1');
      expect(data.compliance_by_series).toHaveProperty('E2');
      expect(data.compliance_by_series.E1).toBeGreaterThan(90);
      expect(data.compliance_by_series.E2).toBeGreaterThan(90);
      expect(data.compliance_by_series.E2).toBeGreaterThan(data.compliance_by_series.E1);
      
      // Validate latest models (should be E2 series)
      expect(data.latest_models).toEqual(['E175-E2', 'E190-E2', 'E195-E2']);
    });
  });

  test.describe('API Documentation', () => {
    test('should load OpenAPI documentation page', async ({ page }) => {
      await page.goto('/docs');
      
      // Wait for the page to load
      await page.waitForLoadState('networkidle');
      
      // Verify the page title
      await expect(page).toHaveTitle(/Aviation Compliance API/);
      
      // Verify Swagger UI is loaded
      await expect(page.locator('.swagger-ui')).toBeVisible();
      
      // Verify API title in the documentation
      await expect(page.locator('h2.title')).toContainText('Aviation Compliance API - Embraer E-Jets');
      
      // Verify version information
      await expect(page.locator('.version')).toContainText('4.0.0');
    });

    test('should display all API endpoints in documentation', async ({ page }) => {
      await page.goto('/docs');
      await page.waitForLoadState('networkidle');
      
      // Check for main endpoint groups
      await expect(page.locator('text=Health')).toBeVisible();
      await expect(page.locator('text=Aircraft')).toBeVisible();
      await expect(page.locator('text=Compliance')).toBeVisible();
      await expect(page.locator('text=Analytics')).toBeVisible();
      await expect(page.locator('text=Root')).toBeVisible();
    });
  });

  test.describe('Response Headers and CORS', () => {
    test('should include proper CORS headers', async ({ request }) => {
      const response = await request.get(`${API_BASE_URL}/health`);
      
      expect(response.status()).toBe(200);
      
      const headers = response.headers();
      expect(headers['access-control-allow-origin']).toBe('*');
      expect(headers['content-type']).toContain('application/json');
    });

    test('should handle preflight CORS requests', async ({ request }) => {
      const response = await request.fetch(`${API_BASE_URL}/health`, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'https://example.com',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      
      // Should allow the preflight request
      expect(response.status()).toBeLessThan(400);
    });
  });

  test.describe('Performance and Reliability', () => {
    test('should respond within acceptable time limits', async ({ request }) => {
      const startTime = Date.now();
      const response = await request.get(`${API_BASE_URL}/health`);
      const endTime = Date.now();
      
      expect(response.status()).toBe(200);
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(5000); // 5 seconds max
    });

    test('should handle concurrent requests properly', async ({ request }) => {
      const promises = Array.from({ length: 10 }, () => 
        request.get(`${API_BASE_URL}/aircraft/models`)
      );
      
      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status()).toBe(200);
      });
    });
  });
});