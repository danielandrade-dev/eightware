import '@testing-library/jest-dom';

// Mock do fetch global
global.fetch = jest.fn();

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock do sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock do router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
})); 

// Mock para o Request do Next.js
global.Request = class Request {
  constructor(input, init) {
    this.url = input;
    this.method = init?.method || 'GET';
    this.headers = new Headers(init?.headers);
  }
};

// Mock para o Headers
global.Headers = class Headers {
  constructor(init) {
    this.headers = init || {};
  }
  
  get(name) {
    return this.headers[name] || null;
  }
  
  append(name, value) {
    this.headers[name] = value;
  }
  
  has(name) {
    return !!this.headers[name];
  }
};

// Mock para o NextRequest
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body) => ({ json: jest.fn(() => body) })),
    redirect: jest.fn((url) => ({ headers: new Map([['location', url]]) })),
    next: jest.fn(() => ({})),
  },
  NextRequest: class MockNextRequest {
    constructor(url, options = {}) {
      this.nextUrl = { pathname: url };
      this.cookies = {
        get: jest.fn((name) => options.cookies && options.cookies[name] ? { value: options.cookies[name] } : undefined),
      };
      this.headers = new Headers(options.headers);
    }
  },
})); 