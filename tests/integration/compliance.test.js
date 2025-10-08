/**
 * Integration Tests for Aviation Compliance API - Compliance Endpoints
 * Tests compliance checking functionality
 */

const axios = require('axios');

describe('Compliance Endpoints', () => {
  let apiUrl;

  beforeAll(async () => {
    apiUrl = global.AZURE_API_URL;
    await global.testUtils.waitForAPI(apiUrl);
  });

  describe('GET /compliance/authorities', () => {
    test('should return all regulatory authorities', async () => {
      const response = await axios.get(`${apiUrl}/compliance/authorities`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('authorities');
      expect(response.data).toHaveProperty('supported_checks');
      expect(response.data).toHaveProperty('global_standards');
      
      // Validate authorities structure
      const authorities = response.data.authorities;
      expect(authorities).toHaveProperty('FAA');
      expect(authorities).toHaveProperty('EASA');
      expect(authorities).toHaveProperty('ANAC');
      expect(authorities).toHaveProperty('ICAO');
      
      // Validate FAA details
      expect(authorities.FAA).toHaveProperty('name', 'Federal Aviation Administration');
      expect(authorities.FAA).toHaveProperty('region', 'USA');
      
      // Validate supported checks
      expect(response.data.supported_checks).toEqual(
        expect.arrayContaining(['full', 'noise', 'emissions', 'safety'])
      );
      
      // Validate global standards
      expect(response.data.global_standards).toEqual(
        expect.arrayContaining(['ICAO', 'RVSM', 'TCAS II', 'ADS-B'])
      );
    });
  });

  describe('GET /compliance/check/{model}/{authority}', () => {
    const testCases = [
      { model: 'E190-E2', authority: 'FAA' },
      { model: 'E175', authority: 'EASA' },
      { model: 'E195-E2', authority: 'ANAC' },
      { model: 'E170', authority: 'ICAO' }
    ];

    testCases.forEach(({ model, authority }) => {
      test(`should check compliance for ${model} with ${authority}`, async () => {
        const response = await axios.get(`${apiUrl}/compliance/check/${model}/${authority}`);
        
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('aircraft_model', model);
        expect(response.data).toHaveProperty('authority', authority);
        expect(response.data).toHaveProperty('compliance_status');
        expect(response.data).toHaveProperty('score');
        expect(response.data).toHaveProperty('details');
        expect(response.data).toHaveProperty('specifications');
        expect(response.data).toHaveProperty('timestamp');
        
        // Validate compliance status
        expect(['COMPLIANT', 'NON_COMPLIANT', 'PENDING']).toContain(response.data.compliance_status);
        
        // Validate score
        expect(response.data.score).toBeGreaterThanOrEqual(0);
        expect(response.data.score).toBeLessThanOrEqual(100);
        
        // Validate details structure
        const details = response.data.details;
        expect(details).toHaveProperty('noise_level');
        expect(details).toHaveProperty('emissions_level');
        expect(details).toHaveProperty('certifications');
        expect(details).toHaveProperty('engine_technology');
        expect(details).toHaveProperty('avionics_suite');
        expect(details).toHaveProperty('generation');
        expect(details).toHaveProperty('check_performed');
        expect(details).toHaveProperty('authority_region');
        
        // Validate specifications match aircraft endpoint
        const specsResponse = await axios.get(`${apiUrl}/aircraft/specifications/${model}`);
        expect(response.data.specifications).toEqual(specsResponse.data);
        
        // Validate timestamp
        expect(new Date(response.data.timestamp)).toBeInstanceOf(Date);
      });
    });

    test('should return higher scores for E2 series', async () => {
      const [e175Response, e175E2Response] = await Promise.all([
        axios.get(`${apiUrl}/compliance/check/E175/FAA`),
        axios.get(`${apiUrl}/compliance/check/E175-E2/FAA`)
      ]);

      expect(e175E2Response.data.score).toBeGreaterThan(e175Response.data.score);
      expect(e175E2Response.data.details.generation).toBe('E2');
      expect(e175Response.data.details.generation).toBe('E1');
    });

    test('should handle invalid aircraft model', async () => {
      try {
        await axios.get(`${apiUrl}/compliance/check/INVALID_MODEL/FAA`);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data).toHaveProperty('detail');
      }
    });

    test('should handle invalid authority', async () => {
      try {
        await axios.get(`${apiUrl}/compliance/check/E190/INVALID_AUTHORITY`);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data).toHaveProperty('detail');
      }
    });
  });

  describe('POST /compliance/check', () => {
    test('should perform compliance check via POST', async () => {
      const requestBody = {
        aircraft_model: 'E190-E2',
        authority: 'FAA',
        check_type: 'full'
      };

      const response = await axios.post(`${apiUrl}/compliance/check`, requestBody);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('aircraft_model', 'E190-E2');
      expect(response.data).toHaveProperty('authority', 'FAA');
      expect(response.data).toHaveProperty('compliance_status');
      expect(response.data).toHaveProperty('score');
    });

    test('should validate request body', async () => {
      const invalidBody = {
        aircraft_model: 'INVALID',
        authority: 'FAA'
      };

      try {
        await axios.post(`${apiUrl}/compliance/check`, invalidBody);
        fail('Should have thrown an error');
      } catch (error) {
        expect([400, 404, 422]).toContain(error.response.status);
      }
    });

    test('should handle missing fields', async () => {
      const incompleteBody = {
        aircraft_model: 'E190-E2'
        // Missing authority
      };

      try {
        await axios.post(`${apiUrl}/compliance/check`, incompleteBody);
        fail('Should have thrown an error');
      } catch (error) {
        expect([400, 422]).toContain(error.response.status);
      }
    });
  });

  describe('Compliance Performance', () => {
    test('should handle concurrent compliance checks', async () => {
      const requests = Array(5).fill().map(() =>
        axios.get(`${apiUrl}/compliance/check/E190-E2/FAA`)
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.data.aircraft_model).toBe('E190-E2');
        expect(response.data.authority).toBe('FAA');
      });
    });

    test('should maintain consistent compliance scores', async () => {
      const responses = await Promise.all([
        axios.get(`${apiUrl}/compliance/check/E190-E2/FAA`),
        axios.get(`${apiUrl}/compliance/check/E190-E2/FAA`),
        axios.get(`${apiUrl}/compliance/check/E190-E2/FAA`)
      ]);

      const scores = responses.map(r => r.data.score);
      expect(scores.every(score => score === scores[0])).toBe(true);
    });
  });
});