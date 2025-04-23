import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Прокси для API запросов на бэкенд
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: false,
    // Настройка для микроприложения Telegram
    // Уменьшает размер сборки
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
});