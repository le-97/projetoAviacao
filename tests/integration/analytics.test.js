/**
 * Integration Tests for Aviation Compliance API - Analytics Endpoints
 * Tests fleet analytics and comparison functionality
 */

const axios = require('axios');

describe('Analytics Endpoints', () => {
  let apiUrl;

  beforeAll(async () => {
    apiUrl = global.AZURE_API_URL;
    await global.testUtils.waitForAPI(apiUrl);
  });

  describe('GET /analytics/fleet-metrics', () => {
    test('should return comprehensive fleet analytics', async () => {
      const response = await axios.get(`${apiUrl}/analytics/fleet-metrics`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('total_models', 7);
      expect(response.data).toHaveProperty('e1_series_count', 4);
      expect(response.data).toHaveProperty('e2_series_count', 3);
      expect(response.data).toHaveProperty('average_compliance_score');
      expect(response.data).toHaveProperty('compliance_by_series');
      expect(response.data).toHaveProperty('latest_models');
      
      // Validate compliance scores
      expect(response.data.average_compliance_score).toBeGreaterThan(90);
      expect(response.data.average_compliance_score).toBeLessThanOrEqual(100);
      
      // Validate series breakdown
      const complianceBySeires = response.data.compliance_by_series;
      expect(complianceBySeires).toHaveProperty('E1');
      expect(complianceBySeires).toHaveProperty('E2');
      expect(complianceBySeires.E2).toBeGreaterThan(complianceBySeires.E1); // E2 should be better
      
      // Validate latest models (should be E2 series)
      expect(response.data.latest_models).toHaveLength(3);
      expect(response.data.latest_models).toEqual(
        expect.arrayContaining(['E175-E2', 'E190-E2', 'E195-E2'])
      );
    });

    test('should have consistent totals', async () => {
      const response = await axios.get(`${apiUrl}/analytics/fleet-metrics`);
      
      const totalFromSeries = response.data.e1_series_count + response.data.e2_series_count;
      expect(totalFromSeries).toBe(response.data.total_models);
    });

    test('should calculate realistic compliance scores', async () => {
      const response = await axios.get(`${apiUrl}/analytics/fleet-metrics`);
      
      // E2 series should have better compliance (newer technology)
      expect(response.data.compliance_by_series.E2).toBeGreaterThan(95);
      expect(response.data.compliance_by_series.E1).toBeGreaterThan(90);
      expect(response.data.compliance_by_series.E1).toBeLessThan(response.data.compliance_by_series.E2);
    });
  });

  describe('GET /analytics/comparison/{model1}/{model2}', () => {
    const testComparisons = [
      { model1: 'E175', model2: 'E175-E2' },
      { model1: 'E190', model2: 'E190-E2' },
      { model1: 'E170', model2: 'E195-E2' }
    ];

    testComparisons.forEach(({ model1, model2 }) => {
      test(`should compare ${model1} vs ${model2}`, async () => {
        const response = await axios.get(`${apiUrl}/analytics/comparison/${model1}/${model2}`);
        
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('models');
        expect(response.data).toHaveProperty('comparison');
        expect(response.data).toHaveProperty('summary');
        expect(response.data).toHaveProperty('recommendation');
        
        // Validate models array
        expect(response.data.models).toHaveLength(2);
        expect(response.data.models).toContain(model1);
        expect(response.data.models).toContain(model2);
        
        // Validate comparison structure
        const comparison = response.data.comparison;
        expect(comparison).toHaveProperty('specifications');
        expect(comparison).toHaveProperty('compliance_scores');
        expect(comparison).toHaveProperty('performance_metrics');
        expect(comparison).toHaveProperty('environmental_impact');
        
        // Validate specifications comparison
        const specs = comparison.specifications;
        expect(specs).toHaveProperty(model1);
        expect(specs).toHaveProperty(model2);
        
        // Each spec should have required fields
        [model1, model2].forEach(model => {
          expect(specs[model]).toHaveProperty('seats');
          expect(specs[model]).toHaveProperty('range_nm');
          expect(specs[model]).toHaveProperty('engine_type');
          expect(specs[model]).toHaveProperty('series');
        });
        
        // Validate summary
        expect(response.data.summary).toHaveProperty('key_differences');
        expect(response.data.summary).toHaveProperty('advantages');
        expect(response.data.summary).toHaveProperty('use_cases');
        
        // Validate recommendation
        expect(response.data.recommendation).toHaveProperty('preferred_model');
        expect(response.data.recommendation).toHaveProperty('reasoning');
        expect([model1, model2]).toContain(response.data.recommendation.preferred_model);
      });
    });

    test('should favor E2 series in comparisons', async () => {
      const response = await axios.get(`${apiUrl}/analytics/comparison/E175/E175-E2`);
      
      // E2 should have better environmental metrics
      const envImpact = response.data.comparison.environmental_impact;
      expect(envImpact['E175-E2'].noise_level).toBe('ICAO Chapter 14');
      expect(envImpact['E175'].noise_level).toBe('ICAO Chapter 4');
      
      expect(envImpact['E175-E2'].emissions_level).toBe('Stage 5');
      expect(envImpact['E175'].emissions_level).toBe('Stage 3');
      
      // Recommendation should likely favor E2
      const recommendation = response.data.recommendation;
      expect(recommendation.reasoning).toContain('efficiency');
    });

    test('should handle invalid model comparisons', async () => {
      try {
        await axios.get(`${apiUrl}/analytics/comparison/INVALID1/INVALID2`);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.response.status).toBe(404);
      }
    });

    test('should handle same model comparison', async () => {
      const response = await axios.get(`${apiUrl}/analytics/comparison/E190-E2/E190-E2`);
      
      expect(response.status).toBe(200);
      expect(response.data.summary.key_differences).toHaveLength(0);
      expect(response.data.recommendation.reasoning).toContain('identical');
    });
  });

  describe('Analytics Performance', () => {
    test('should handle concurrent analytics requests', async () => {
      const requests = [
        axios.get(`${apiUrl}/analytics/fleet-metrics`),
        axios.get(`${apiUrl}/analytics/comparison/E175/E175-E2`),
        axios.get(`${apiUrl}/analytics/comparison/E190/E190-E2`),
        axios.get(`${apiUrl}/analytics/fleet-metrics`),
        axios.get(`${apiUrl}/analytics/comparison/E170/E195-E2`)
      ];

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
      
      // Fleet metrics should be consistent
      const fleetResponses = responses.filter((_, index) => [0, 3].includes(index));
      expect(fleetResponses[0].data.total_models).toBe(fleetResponses[1].data.total_models);
    });

    test('should respond quickly to analytics requests', async () => {
      const startTime = Date.now();
      await axios.get(`${apiUrl}/analytics/fleet-metrics`);
      const responseTime = Date.now() - startTime;
      
      expect(responseTime).toBeLessThan(3000); // 3 seconds max for analytics
    });
  });

  describe('Analytics Data Integrity', () => {
    test('should have consistent data across endpoints', async () => {
      const [fleetResponse, modelsResponse] = await Promise.all([
        axios.get(`${apiUrl}/analytics/fleet-metrics`),
        axios.get(`${apiUrl}/aircraft/models`)
      ]);

      expect(fleetResponse.data.total_models).toBe(modelsResponse.data.total_models);
      expect(fleetResponse.data.latest_models.sort()).toEqual(
        modelsResponse.data.models_by_series.E2.sort()
      );
    });

    test('should validate all comparison combinations work', async () => {
      const modelsResponse = await axios.get(`${apiUrl}/aircraft/models`);
      const allModels = modelsResponse.data.all_models;
      
      // Test a few key comparisons
      const testPairs = [
        [allModels[0], allModels[1]],
        [allModels[2], allModels[4]], // E1 vs E2
        [allModels[5], allModels[6]]  // E2 vs E2
      ];

      const comparisonPromises = testPairs.map(([model1, model2]) =>
        axios.get(`${apiUrl}/analytics/comparison/${model1}/${model2}`)
      );

      const responses = await Promise.all(comparisonPromises);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('comparison');
        expect(response.data).toHaveProperty('recommendation');
      });
    });
  });
});