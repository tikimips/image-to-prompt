import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: './', // root is now the project root
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
})
