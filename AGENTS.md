# AGENTS.md

This document outlines project-specific conventions, best practices, and guidelines for AI agents contributing to this repository. Adhering to these guidelines will help ensure code quality, consistency, and smooth collaboration.

## Pre-Commit Code Formatting

To maintain consistent code style throughout the project, all applicable files must be formatted using Prettier before committing.

Run the following command to format your changes:

```bash
npm run prettier
```

This will ensure that your code adheres to the project's defined style guidelines.

## Testing

Comprehensive testing is crucial for maintaining code quality and preventing regressions. This project uses Vitest for unit testing.

**Adding Tests:**

- For any new features or bug fixes, please add corresponding Vitest tests where applicable.
- Ensure your tests cover the core logic and edge cases of the changes you introduce.

**Running Tests:**

To run all tests and verify your changes, use the following command:

```bash
npm run test
```

Make sure all tests pass before submitting a pull request.

## Project Information

- **Framework:** This project is built using Astro. Read the agent-friendly documentation at https://docs.astro.build/llms.txt when you first start working on this project.

## Frontend Technologies

### Svelte
Svelte is used for creating dynamic frontend components. It shifts work from the browser to the compile step, resulting in highly optimized vanilla JavaScript. For more information, refer to the Svelte documentation: https://svelte.dev/llms.txt

### Bits UI
Bits UI is utilized for building interface elements. It's a collection of headless UI components for Svelte, offering flexibility and accessibility. Find more details in the Bits UI documentation: https://www.bits-ui.com/docs/llms/llms.txt

### TanStack Query (Svelte)
TanStack Query (Svelte) is employed for managing dynamic frontend resource requests. It provides powerful data fetching and caching capabilities. Explore the TanStack Query documentation here: https://tanstack.com/query/latest

## Pull Request (PR) Conventions

To ensure a smooth and efficient review process, please follow these conventions when submitting Pull Requests:

- **Clear Titles:** Write clear and descriptive PR titles that summarize the changes made.
- **Detailed Descriptions:** Provide a detailed description of the changes in the PR. Explain the "what" and "why" of your contribution. If it fixes an issue, link to the issue.
- **Focused PRs:** Keep PRs focused on a single issue or feature. Avoid bundling unrelated changes into one PR.
- **Passing Tests:** Ensure all tests (run via `npm run test`) are passing before submitting your PR.
- **Code Formatting:** Confirm that you have run `npm run prettier` to format your code before submission.
- **Self-Review:** Review your own changes before requesting a review from others. This can help catch typos or simple mistakes.
