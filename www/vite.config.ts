import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({typescript: true})
  ],
  server:{
    port: 8800
  },
  preview: {
    port: 8800
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
