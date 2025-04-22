// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // caminho da raiz do projeto
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1', // se você usar aliases
  },
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
};

module.exports = createJestConfig(customJestConfig);
