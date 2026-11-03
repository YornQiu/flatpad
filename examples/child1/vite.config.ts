import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { buildIndexHtml } from 'vite-plugin-flatpad';

export default defineConfig({
  plugins: [vue(), buildIndexHtml()],
  base: '/apps/app1/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 9091,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  build: {
    rolldownOptions: {
      external: ['vue'],
      output: {
        paths: {
          vue: '/libs/vue.js',
        },
      },
    },
  },
});
