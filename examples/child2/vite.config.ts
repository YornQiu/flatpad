import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { buildIndexHtml } from 'vite-plugin-flatpad';

export default defineConfig({
  plugins: [
    //
    vue(),
    buildIndexHtml(),
  ],
  base: '/apps/app2/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 9092,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  build: {
    rollupOptions: {
      external: ['vue'],
      output: {
        paths: {
          // Extract public dependencies， managed by main app
          vue: '/libs/vue.js',
        },
      },
    },
  },
});
