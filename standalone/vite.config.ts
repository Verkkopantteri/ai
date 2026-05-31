import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'standalone-dark': resolve(__dirname, 'standalone-dark.html'),
        'standalone-light': resolve(__dirname, 'standalone-light.html'),
      },
    },
  },
});
