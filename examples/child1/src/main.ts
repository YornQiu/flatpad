import type { App } from 'vue';
import type { RouterHistory } from 'vue-router';

import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from '@/router';
import Main from './App.vue';
import '@/index.css';

let app: App | null = null;
let router = null;
let history: RouterHistory | null = null;

export function mount() {
  history = createWebHistory(import.meta.env.BASE_URL.replace('/apps', ''));
  router = createRouter({ history, routes });
  app = createApp(Main);

  app.use(router).mount('#app');
}

export function unmount() {
  app?.unmount();
  history?.destroy();

  app = null;
  router = null;
  history = null;
}
