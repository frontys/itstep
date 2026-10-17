import { defineConfig } from 'vite';

export default defineConfig({
  base: '/itstep/',
  esbuild: {
    jsx: 'automatic',
  },
  build: {
    outDir: '../../docs',
    emptyOutDir: true,
  },
});
