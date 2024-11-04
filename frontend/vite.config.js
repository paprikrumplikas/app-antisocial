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
  optimizeDeps: {
    exclude: ['path', 'url', 'fs']  // Added 'fs' to the exclude list
  },
  define: {
    'process.env': {},
    'process.platform': JSON.stringify(''),
    'process.version': JSON.stringify(''),
  },
  build: {
    rollupOptions: {
      external: ['fs', 'path', 'url'],
    },
  }
})
