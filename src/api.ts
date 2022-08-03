/*
 * @Author: Yorn Qiu
 * @Date: 2022-04-04 18:16:12
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2022-08-03 15:14:33
 * @Description: api
 * @FilePath: /flatpad/src/api.ts
 */

import type { Application as IApplication, AppConfig, AppOptions } from './types';

import Application from './application';
import { APP_ROOT, APP_STATUS } from './constants';
import { throwError, dispatchCustomEvent, Events } from './utils';

// application map
const apps = new Map<string, IApplication>();

let mountedApp: IApplication | null = null;

/**
 * @description: register application
 * @param {AppConfig} appConfig
 */
export function registerApplication(appConfig: AppConfig | AppConfig[], options?: AppOptions) {
  if (Array.isArray(appConfig)) {
    for (let i = 0, l = appConfig.length; i < l; i += 1) {
      registerApplication(appConfig[i], options);
    }
    return;
  }

  const { name, entry, prefetch } = appConfig;

  if (!name || !entry) throwError(`Application's name and entry must be defined`);

  if (apps.has(name)) throwError(`Application ${name} has been registered`);

  const root = appConfig.root || options?.root || APP_ROOT;
  const route = appConfig.route || `/${name}`;

  apps.set(name, new Application({ name, root, route, entry, prefetch }));
}

/**
 * @description: unregister application
 * @param {string} appName
 */
export function unregisterApplication(appName: string) {
  const app = apps.get(appName);
  if (!app) {
    throwError(`Application ${appName} has not been registered`);
  }

  if (app.status === APP_STATUS.MOUNTED) {
    throwError(`Application ${app.name} is mounted, please unmount it first`);
  }

  app.destroy();
  apps.delete(appName);
}

/**
 * @description: mount application
 * @param {string} appName
 */
export async function mountApp(appName: string) {
  if (mountedApp?.name === appName) return;

  const appToUnmount = mountedApp;
  const appToMount = apps.get(appName);
  if (!appToMount) throwError(`Application ${appName} has not been registered`);

  dispatchCustomEvent(Events.BeforeAppChange, { appToMount, appToUnmount });

  // load
  try {
    await appToMount?.load();
  } catch (error) {
    dispatchCustomEvent(Events.ErrorAppLoading, { appToMount, appToUnmount, error });
    throw error;
  }

  // unmount
  try {
    appToUnmount?.unmount();
  } catch (error) {
    dispatchCustomEvent(Events.ErrorAppUnmounting, { appToMount, appToUnmount, error });
    throw error;
  }

  // mount
  try {
    history.pushState({}, '', appToMount.route);
    await appToMount.mount();
  } catch (error) {
    dispatchCustomEvent(Events.ErrorAppMounting, { appToMount, appToUnmount, error });
  }

  mountedApp = appToMount;
  dispatchCustomEvent(Events.OnAppChanged, { appToMount, appToUnmount });
}

/**
 * @description: unmount application
 * @param {string} appName
 */
export async function unmountApp(appName: string) {
  if (mountedApp?.name !== appName) return;

  const app = apps.get(appName);
  if (!app) throwError(`Application ${appName} has not been registered`);

  try {
    app.unmount();
    mountedApp = null;
  } catch (error) {
    dispatchCustomEvent(Events.ErrorAppUnmounting, { appToMount: null, appToUnmount: app });
    throw error;
  }
}

export function getApplication(appName: string): IApplication | undefined {
  return apps.get(appName);
}

export function getAllApplications(): IApplication[] {
  return Array.from(apps.values());
}
