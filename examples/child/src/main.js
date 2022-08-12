import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from '@/router';
import App from './App.vue';
import '@/index.css';

let app = null;
let router = null;
let history = null;

export function mount() {
  history = createWebHistory(import.meta.env.VITE_BASE_URL || '/');
  router = createRouter({ history, routes });
  app = createApp(App);

  app.use(router).mount('#app');
}

export function unmount() {
  app.unmount();
  history.destroy();

  app = null;
  router = null;
  history = null;
}

if (!window.__FLATPAD_ENV__) {
  mount();
}
