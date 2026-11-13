import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Relative asset URLs so the same build works at `/` (Bun) and `/fitness-dashboard/` (GitHub Pages)
  base: './',
  plugins: [vue(), tailwindcss()],
  server: {
    proxy: { '/api': 'http://localhost:3001' },
  },
});
