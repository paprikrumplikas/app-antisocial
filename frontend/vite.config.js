import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
  },
  resolve: {
    alias: {
      'source-map-js': 'source-map-js/source-map.js',
    },
  },
  define: {
    'process.env': {},
    'process.platform': JSON.stringify(''),
    'process.version': JSON.stringify(''),
  }
})