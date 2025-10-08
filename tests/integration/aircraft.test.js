/**
 * Integration Tests for Aviation Compliance API - Aircraft Endpoints
 * Tests aircraft models and specifications endpoints
 */

const axios = require('axios');

describe('Aircraft Endpoints', () => {
  let apiUrl;

  beforeAll(async () => {
    apiUrl = global.AZURE_API_URL;
    await global.testUtils.waitForAPI(apiUrl);
  });

  describe('GET /aircraft/models', () => {
    test('should return all aircraft models', async () => {
      const response = await axios.get(`${apiUrl}/aircraft/models`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('total_models', 7);
      expect(response.data).toHaveProperty('models_by_series');
      expect(response.data).toHaveProperty('all_models');
      expect(response.data).toHaveProperty('latest_generation');
      
      // Validate E1 series
      expect(response.data.models_by_series.E1).toHaveLength(4);
      expect(response.data.models_by_series.E1).toEqual(
        expect.arrayContaining(['E170', 'E175', 'E190', 'E195'])
      );
      
      // Validate E2 series
      expect(response.data.models_by_series.E2).toHaveLength(3);
      expect(response.data.models_by_series.E2).toEqual(
        expect.arrayContaining(['E175-E2', 'E190-E2', 'E195-E2'])
      );
      
      // Validate all models
      expect(response.data.all_models).toHaveLength(7);
      expect(response.data.latest_generation).toBe('E2 Series with Geared Turbofan engines');
    });

    test('should have consistent data structure', async () => {
      const response = await axios.get(`${apiUrl}/aircraft/models`);
      
      const expectedKeys = ['total_models', 'models_by_series', 'all_models', 'latest_generation'];
      expect(Object.keys(response.data).sort()).toEqual(expectedKeys.sort());
    });
  });

  describe('GET /aircraft/specifications/{model}', () => {
    const testModels = ['E170', 'E175-E2', 'E190-E2'];

    testModels.forEach(model => {
      test(`should return specifications for ${model}`, async () => {
        const response = await axios.get(`${apiUrl}/aircraft/specifications/${model}`);
        
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('model', model);
        expect(response.data).toHaveProperty('series');
        expect(response.data).toHaveProperty('seats');
        expect(response.data).toHaveProperty('mtow_lbs');
        expect(response.data).toHaveProperty('range_nm');
        expect(response.data).toHaveProperty('engine_type');
        expect(response.data).toHaveProperty('noise_compliance');
        expect(response.data).toHaveProperty('emissions_compliance');
        expect(response.data).toHaveProperty('certification');
        expect(response.data).toHaveProperty('fuel_capacity_kg');
        expect(response.data).toHaveProperty('avionics');
        expect(response.data).toHaveProperty('safety_rating');
        
        // Validate data types
        expect(typeof response.data.seats).toBe('number');
        expect(typeof response.data.mtow_lbs).toBe('number');
        expect(typeof response.data.range_nm).toBe('number');
        expect(typeof response.data.fuel_capacity_kg).toBe('number');
        expect(Array.isArray(response.data.certification)).toBe(true);
        
        // Validate series mapping
        if (model.includes('-E2')) {
          expect(response.data.series).toBe('E2');
          expect(response.data.noise_compliance).toBe('ICAO Chapter 14');
          expect(response.data.emissions_compliance).toBe('Stage 5');
          expect(response.data.safety_rating).toBe('A+');
        } else {
          expect(response.data.series).toBe('E1');
          expect(response.data.noise_compliance).toBe('ICAO Chapter 4');
          expect(response.data.emissions_compliance).toBe('Stage 3');
          expect(response.data.safety_rating).toBe('A');
        }
      });
    });

    test('should return 404 for invalid aircraft model', async () => {
      try {
        await axios.get(`${apiUrl}/aircraft/specifications/INVALID_MODEL`);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data).toHaveProperty('detail');
        expect(error.response.data.detail).toContain('Aircraft model \'INVALID_MODEL\' not found');
      }
    });

    test('should validate E1 vs E2 differences', async () => {
      const [e175Response, e175E2Response] = await Promise.all([
        axios.get(`${apiUrl}/aircraft/specifications/E175`),
        axios.get(`${apiUrl}/aircraft/specifications/E175-E2`)
      ]);

      const e175 = e175Response.data;
      const e175E2 = e175E2Response.data;

      // E2 should have better specifications
      expect(e175E2.noise_compliance).toBe('ICAO Chapter 14');
      expect(e175.noise_compliance).toBe('ICAO Chapter 4');
      
      expect(e175E2.emissions_compliance).toBe('Stage 5');
      expect(e175.emissions_compliance).toBe('Stage 3');
      
      expect(e175E2.safety_rating).toBe('A+');
      expect(e175.safety_rating).toBe('A');
      
      // E2 should have Geared Turbofan engines
      expect(e175E2.engine_type).toContain('Geared Turbofan');
      expect(e175.engine_type).toContain('CF34');
    });
  });

  describe('Aircraft Data Integrity', () => {
    test('should have consistent aircraft count across endpoints', async () => {
      const [modelsResponse, healthResponse] = await Promise.all([
        axios.get(`${apiUrl}/aircraft/models`),
        axios.get(`${apiUrl}/health`)
      ]);

      expect(modelsResponse.data.total_models).toBe(healthResponse.data.aircraft_models_loaded);
    });

    test('should have valid specifications for all models', async () => {
      const modelsResponse = await axios.get(`${apiUrl}/aircraft/models`);
      const allModels = modelsResponse.data.all_models;

      const specificationPromises = allModels.map(model =>
        axios.get(`${apiUrl}/aircraft/specifications/${model}`)
      );

      const specifications = await Promise.all(specificationPromises);

      specifications.forEach((response, index) => {
        expect(response.status).toBe(200);
        expect(response.data.model).toBe(allModels[index]);
      });
    });
  });
});