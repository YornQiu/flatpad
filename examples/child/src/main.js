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

if (import.meta.env.MODE === 'subapp') {
  window.__FLATPAD_APPS__[import.meta.env.VITE_APP_NAME] = { mount, unmount };
} else {
  mount();
}
