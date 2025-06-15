/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom', // Changed to jsdom due to Node version incompatibility with happy-dom
    globals: true, // to use Vitest globals without importing them
    alias: {
      // Ensure Vitest can resolve 'astro:db' to the mock implementation
      'astro:db': path.resolve(__dirname, './src/tests/mocks/astro-db.js'),
    },
  },
});
