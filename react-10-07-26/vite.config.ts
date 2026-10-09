import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/react-itstep/react-10-07-26/',
  plugins: [react()],
  build: {
    outDir: '../docs/react-10-07-26',
    emptyOutDir: true,
  },
})
