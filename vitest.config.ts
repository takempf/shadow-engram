/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [
    svelte({ hot: !process.env.VITEST }), // Disable HMR in test environment
  ],
  test: {
    environment: 'jsdom', // Or 'happy-dom' if preferred and compatible
    globals: true, // to use Vitest globals without importing them
    setupFiles: ['./vitest-setup.ts'], // Optional: for global test setup
    alias: {
      // Ensure Vitest can resolve 'astro:db' to the mock implementation
      'astro:db': path.resolve(__dirname, './src/mocks/astro-db.js'), // Updated path
      // Alias for Svelte components if they are imported with a specific path prefix like $lib
      // Example: '$lib': path.resolve(__dirname, './src/lib')
    }
  }
});
