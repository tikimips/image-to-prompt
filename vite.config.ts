import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.', // leave this as is
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'public/index.html',
    },
  },
})
