// Mock API handlers
// aviation-frontend/src/mocks/handlers.js

import { rest } from 'msw';

const API_BASE_URL = 'https://aviation-compliance-app.wonderfulsea-d38b4e92.eastus.azurecontainerapps.io';

export const handlers = [
  // Health endpoint
  rest.get(`${API_BASE_URL}/health`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'healthy',
        message: 'Aviation Compliance API operational',
        timestamp: new Date().toISOString(),
        database_status: 'in-memory',
        aircraft_models_loaded: 7
      })
    );
  }),

  // Aircraft models endpoint
  rest.get(`${API_BASE_URL}/aircraft/models`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        total_models: 7,
        models_by_series: {
          E1: ['E170', 'E175', 'E190', 'E195'],
          E2: ['E175-E2', 'E190-E2', 'E195-E2']
        },
        all_models: ['E170', 'E175', 'E190', 'E195', 'E175-E2', 'E190-E2', 'E195-E2'],
        latest_generation: 'E2 Series with Geared Turbofan engines'
      })
    );
  }),

  // Aircraft specifications endpoint
  rest.get(`${API_BASE_URL}/aircraft/specifications/:model`, (req, res, ctx) => {
    const { model } = req.params;
    
    const specifications = {
      'E190-E2': {
        model: 'E190-E2',
        series: 'E2',
        seats: 114,
        mtow_lbs: 124341,
        range_nm: 2850,
        engine_type: '2 × PW1900G (Geared Turbofan)',
        noise_compliance: 'ICAO Chapter 14',
        emissions_compliance: 'Stage 5',
        certification: ['FAA Part 25', 'EASA CS-25', 'ICAO Annex 16'],
        fuel_capacity_kg: 13500,
        avionics: 'Honeywell Primus Epic 2 + Fly-by-wire',
        safety_rating: 'A+'
      },
      'E175': {
        model: 'E175',
        series: 'E1',
        seats: 88,
        mtow_lbs: 89000,
        range_nm: 2200,
        engine_type: '2 × GE CF34-8E (14,200 lbf)',
        noise_compliance: 'ICAO Chapter 4',
        emissions_compliance: 'Stage 3',
        certification: ['FAA Part 25', 'EASA CS-25', 'ICAO Annex 16'],
        fuel_capacity_kg: 9400,
        avionics: 'Honeywell Primus Epic',
        safety_rating: 'A'
      }
    };

    const spec = specifications[model];
    if (!spec) {
      return res(
        ctx.status(404),
        ctx.json({ detail: `Aircraft model '${model}' not found` })
      );
    }

    return res(ctx.status(200), ctx.json(spec));
  }),

  // Compliance authorities endpoint
  rest.get(`${API_BASE_URL}/compliance/authorities`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        authorities: {
          FAA: { name: 'Federal Aviation Administration', region: 'USA' },
          EASA: { name: 'European Union Aviation Safety Agency', region: 'Europe' },
          ANAC: { name: 'Agência Nacional de Aviação Civil', region: 'Brazil' },
          ICAO: { name: 'International Civil Aviation Organization', region: 'Global' }
        },
        supported_checks: ['full', 'noise', 'emissions', 'safety'],
        global_standards: ['ICAO', 'RVSM', 'TCAS II', 'ADS-B']
      })
    );
  }),

  // Compliance check endpoint
  rest.get(`${API_BASE_URL}/compliance/check/:model/:authority`, (req, res, ctx) => {
    const { model, authority } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json({
        aircraft_model: model,
        authority: authority,
        compliance_status: 'COMPLIANT',
        score: 98.5,
        details: {
          noise_level: 'ICAO Chapter 14',
          emissions_level: 'Stage 5',
          certifications: ['FAA Part 25', 'EASA CS-25', 'ICAO Annex 16'],
          engine_technology: '2 × PW1900G (Geared Turbofan)',
          avionics_suite: 'Honeywell Primus Epic 2 + Fly-by-wire',
          generation: 'E2',
          check_performed: 'full',
          authority_region: 'USA'
        },
        specifications: {
          model: model,
          series: 'E2',
          seats: 114,
          mtow_lbs: 124341,
          range_nm: 2850,
          engine_type: '2 × PW1900G (Geared Turbofan)',
          noise_compliance: 'ICAO Chapter 14',
          emissions_compliance: 'Stage 5',
          certification: ['FAA Part 25', 'EASA CS-25', 'ICAO Annex 16'],
          fuel_capacity_kg: 13500,
          avionics: 'Honeywell Primus Epic 2 + Fly-by-wire',
          safety_rating: 'A+'
        },
        timestamp: new Date().toISOString()
      })
    );
  }),

  // Analytics fleet metrics endpoint
  rest.get(`${API_BASE_URL}/analytics/fleet-metrics`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        total_models: 7,
        e1_series_count: 4,
        e2_series_count: 3,
        average_compliance_score: 95.3,
        compliance_by_series: {
          E1: 93.5,
          E2: 97.2
        },
        latest_models: ['E175-E2', 'E190-E2', 'E195-E2']
      })
    );
  }),

  // Error handler for unhandled requests
  rest.get('*', (req, res, ctx) => {
    console.warn(`Unhandled ${req.method} request to ${req.url}`);
    return res(
      ctx.status(404),
      ctx.json({ detail: 'Endpoint not found' })
    );
  })
];