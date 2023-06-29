import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  server: {
    open: true,
    host: '0.0.0.0',
    port: 80,
  },
  preview: {
    host: '0.0.0.0',
    port: 80,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})