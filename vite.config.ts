import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   host: '0.0.0.0',
  //   port: 5001,
  //   strictPort: true
  // }
  server: {
    port: 3000,
    proxy: {
      // Proxy API requests to your backend
      '/api': {
        target: 'https://unmercerized-garnet-unridiculous.ngrok-free.dev', // your backend URL
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
