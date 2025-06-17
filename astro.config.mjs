// @ts-check
import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";

import db from '@astrojs/db';

// https://astro.build/config
export default defineConfig({
  integrations: [db(), svelte()]
});
