import { defineConfig } from 'vite';

export default defineConfig({
  base: '/react-itstep/GameCatalog/',
  esbuild: {
    jsx: 'automatic',
  },
  build: {
    outDir: '../docs/GameCatalog',
    emptyOutDir: true,
  },
});
