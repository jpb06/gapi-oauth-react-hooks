import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests-related/setup-tests.ts'],
    include: [
      './src/**/*.test.tsx',
      './src/**/*.spec.tsx',
      './src/**/*.test.ts',
    ],
    globals: false,
    coverage: {
      reporter: ['json-summary'],
      all: true,
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/tests/**/*', 'src/**/*.type.ts', 'src/**/*/index.ts'],
    },
  },
});