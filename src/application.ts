/*
 * @Author: Yorn Qiu
 * @Date: 2022-04-24 12:25:46
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2022-08-03 14:27:42
 * @Description: application
 * @FilePath: /flatpad/src/application.ts
 */
import type {
  Application as IApplication,
  ApplicationLifecycle,
  ApplicationConstructorOptions,
  AppSource,
} from './types';

import { loadApp, clearCache } from './loader';
import { getRootElement, renderContent, removeContent } from './render';
import { clearAll } from './effect';
import { APP_STATUS } from './constants';

const { INITED, LOADING, LOADED, MOUNTING, MOUNTED, UNMOUNTING } = APP_STATUS;

export default class Application implements IApplication {
  name: string;
  root: string;
  route: string;
  entry: string;
  status: string;
  prefetch?: boolean;
  lifecycle: ApplicationLifecycle;
  private source?: AppSource;
  private loadingPromise: Promise<void> | null;
  private mountingPromise: Promise<void> | null;

  constructor({ name, root, route, entry, prefetch, lifecycle }: ApplicationConstructorOptions) {
    this.name = name;
    this.root = root;
    this.route = route;
    this.entry = entry;
    this.prefetch = prefetch;
    this.lifecycle = lifecycle || {};

    this.status = INITED;
    this.loadingPromise = null;
    this.mountingPromise = null;
  }

  /**
   * Load application
   */
  load(): Promise<void> {
    const { status } = this;

    if (status === INITED) {
      // to avoid source being loaded repeatedly when app.load() is called multiple times
      const loadingPromise = new Promise<void>(async (resolve, reject) => {
        this.onLifecycles('beforeLoad');
        const { name, entry } = this;

        try {
          this.source = await loadApp(name, entry);
          this.onLifecycles('loaded');
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      this.loadingPromise = loadingPromise;
      return loadingPromise;
    }

    if (status === LOADING) {
      return this.loadingPromise!;
    }

    return Promise.resolve();
  }

  /**
   * Mount application
   */
  mount(): Promise<void> {
    const { status } = this;
    if (status === INITED || status === LOADING || status === LOADED) {
      const mountingPromise = new Promise<void>(async (resolve, reject) => {
        await this.load();
        this.onLifecycles('beforeMount');
        const { name, root, source } = this;

        try {
          const rootElement = getRootElement(root);
          await renderContent(name, rootElement, source!);

          this.onLifecycles('mounted');
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      this.mountingPromise = mountingPromise;
      return mountingPromise;
    }

    if (status === MOUNTING) {
      return this.mountingPromise!;
    }

    return Promise.resolve();
  }

  /**
   * Unmount application
   */
  unmount() {
    this.onLifecycles('beforeUnmount');

    const { name, root } = this;
    const rootElement = getRootElement(root);
    removeContent(name, rootElement);

    clearAll();

    this.onLifecycles('unmounted');
  }

  /**
   * Remove application's status and caches
   */
  destroy() {
    clearCache(this.name);
    this.loadingPromise = null;
    this.mountingPromise = null;
  }

  /**
   * Lifecycles
   */

  onLifecycles(name: string) {
    const { beforeLoad, loaded, beforeMount, mounted, beforeUnmount, unmounted } = this.lifecycle;
    switch (name) {
      case 'beforeLoad':
        this.status = LOADING;
        beforeLoad && beforeLoad();
        break;

      case 'loaded':
        this.status = LOADED;
        loaded && loaded();
        break;

      case 'beforeMount':
        this.status = MOUNTING;
        beforeMount && beforeMount();
        break;

      case 'mounted':
        this.status = MOUNTED;
        mounted && mounted();
        break;

      case 'beforeUnmount':
        this.status = UNMOUNTING;
        beforeUnmount && beforeUnmount();
        break;

      case 'unmounted':
        // app status will return to LOADED after unmounted
        this.status = LOADED;
        unmounted && unmounted();
        break;
      default:
        break;
    }
  }
}