import '@testing-library/svelte/vitest'; // This should provide Svelte-specific matchers if any
import '@testing-library/jest-dom'; // Extends expect with jest-dom matchers
import { vi } from 'vitest';

// Optional: Mock global browser APIs if not fully provided by jsdom/happy-dom
// For example, if using fetch in Svelte components and want to mock it globally:
// global.fetch = vi.fn(() => Promise.resolve({
//   json: () => Promise.resolve({}),
//   ok: true,
// }));

// Mocking for @tanstack/svelte-query if needed globally,
// or can be done per-test file.
// Example of a simple global mock for QueryClient:
vi.mock('@tanstack/svelte-query', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    QueryClient: vi.fn(() => ({
      invalidateQueries: vi.fn(),
      // Add other methods used by your components if necessary
    })),
    // createQuery and createMutation will be mocked per-test where specific responses are needed
  };
});

// Any other global setup can go here.
// For example, if you have a $lib alias in svelte.config.js and tsconfig.json,
// ensure it's also in vitest.config.ts alias section.
// Vitest's `alias` should handle module resolution for tests.

console.log('Vitest global setup initialized.');
