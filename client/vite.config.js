import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:1038',
        changeOrigin: true
      },
      '/ai': {
        target: 'http://localhost:1038',
        changeOrigin: true
      },
      '/download': {
        target: 'http://localhost:1038',
        changeOrigin: true
      },
      '/random': {
        target: 'http://localhost:1038',
        changeOrigin: true
      },
      '/tools': {
        target: 'http://localhost:1038',
        changeOrigin: true
      },
      '/metrics': {
        target: 'http://localhost:1038',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
})
