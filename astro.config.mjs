import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server', // ¡Esto activa el SSR!
  adapter: node({
    mode: 'standalone'
  })
});