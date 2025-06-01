import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        babelrc: true,
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1500, // Увеличиваем лимит предупреждений
    rollupOptions: {
      external: ['react-redux', '@reduxjs/toolkit'],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
})
