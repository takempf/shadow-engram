/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'; // Single import
import path from 'path';
// import astro from '@astrojs/vite-plugin-astro'; // Example if Astro plugin was needed

export default defineConfig({
  plugins: [
    svelte({
      hot: false, // Explicitly false for tests
      preprocess: vitePreprocess(),
      // compilerOptions: {
      //   generate: 'dom', // As established, vite-plugin-svelte controls this.
      // }
    }),
    // astro(), // Keeping astro plugin out for pure .svelte component tests for now
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    alias: {
      'astro:db': path.resolve(__dirname, './src/mocks/astro-db.js'),
      // '$lib': path.resolve(__dirname, './src/lib'),
    },
  },
  resolve: { // This resolve block is at the top level, Vite applies it globally
    conditions: ['browser', 'development'],
    alias: { // Top-level alias can also be used, Vitest's test.alias merges with this.
      'astro:db': path.resolve(__dirname, './src/mocks/astro-db.js'),
      // '$lib': path.resolve(__dirname, './src/lib'),
    },
  },
  ssr: {
    // This ensures these packages are transformed by Vite during SSR (and by extension, for Vitest server-side processing if any)
    // Forcing them to not be external means they go through Vite's pipeline, which should respect `resolve.conditions`.
    noExternal: [
      'svelte',
      /^@testing-library\//,
      /^@tanstack\//,
      // 'astro', // If astro utilities were used directly in Svelte components & needed processing
      // '@astrojs/db', // If direct imports from @astrojs/db (not astro:db) were used and needed processing
    ],
    // external: [], // Making sure nothing critical is accidentally externalized for SSR if it needs DOM context
  },
});
