import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/adjust': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/reboot': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})