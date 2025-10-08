// Test setup for React components
// aviation-frontend/src/setupTests.js

import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Start API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after tests are finished
afterAll(() => server.close());

// Global test utilities
global.renderWithProviders = (ui, options = {}) => {
  const { render } = require('@testing-library/react');
  return render(ui, options);
};

global.mockApiResponse = (endpoint, response, status = 200) => {
  const { rest } = require('msw');
  server.use(
    rest.get(`*${endpoint}`, (req, res, ctx) => {
      return res(ctx.status(status), ctx.json(response));
    })
  );
};