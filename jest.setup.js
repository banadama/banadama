// jest.setup.js - Global test setup

// Mock Prisma / db to avoid loading Prisma client in tests
// Provide a realistic mock for `db` used in tests. Tests can override specific methods.
const createMockDb = () => {
  const mock = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    // add other models as needed by tests
  };
  return mock;
};

const mockDb = createMockDb();
jest.mock('@/lib/db', () => ({ db: mockDb }));
// Expose mockDb on global so tests can easily configure returns if needed
global.__MOCK_DB__ = mockDb;

// Silence Next.js router/navigation warnings by mocking next/navigation
jest.mock('next/navigation', () => ({ redirect: jest.fn(), useRouter: () => ({ push: jest.fn() }) }));

// Mock next/headers cookies for server utils if used in tests
jest.mock('next/headers', () => ({ cookies: jest.fn().mockResolvedValue({ get: jest.fn(), set: jest.fn(), delete: jest.fn() }) }));

// Polyfills
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Minimal Request polyfill for environments where Request isn't defined
if (typeof global.Request === 'undefined') {
  global.Request = class Request {};
}

// Mock next/server objects used in middleware tests
jest.mock('next/server', () => {
  class MockHeaders {
    constructor(init = {}) { this.map = new Map(Object.entries(init)); }
    get(k) { return this.map.get(k) || null; }
    set(k, v) { this.map.set(k, String(v)); }
  }

  class MockCookies {
    constructor() { this.store = new Map(); }
    get(name) { const v = this.store.get(name); return v ? { value: v } : undefined; }
    set(name, value) { this.store.set(name, value); }
    delete(name) { this.store.delete(name); }
  }

  class NextRequest {
    constructor(url) {
      this.url = String(url);
      this.nextUrl = new URL(this.url);
      this.nextUrl.clone = () => new URL(this.url);
      this.headers = new MockHeaders({ host: new URL(this.url).host });
      this.cookies = new MockCookies();
    }
  }

  const NextResponse = {
    rewrite: jest.fn((u, opts) => ({ status: 307, headers: new MockHeaders({ location: String(u) }) })),
    redirect: jest.fn((u) => ({ status: 307, headers: new MockHeaders({ location: String(u) }) })),
    next: jest.fn((opts) => {
      // If headers are provided via opts.request.headers, return them so tests can inspect
      if (opts && opts.request && opts.request.headers) {
        return { status: 200, headers: opts.request.headers };
      }
      return { status: 200, headers: new MockHeaders() };
    }),
  };

  return { NextRequest, NextResponse };
});
