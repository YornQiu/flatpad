/*
 * @Author: Yorn Qiu
 * @Date: 2022-04-24 11:46:03
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2023-12-20 14:37:57
 * @FilePath: /flatpad/packages/flatpad/src/utils.ts
 * @Description: utils
 */

import { PACKAGE_NAME } from './constants';

export const Events: {
  BeforeAppChange: 'flatpad:before-app-change';
  OnAppChanged: 'flatpad:on-app-changed';
  ErrorAppLoading: 'flatpad:error-app-loading';
  ErrorAppMounting: 'flatpad:error-app-mounting';
  ErrorAppUnmounting: 'flatpad:error-app-unmounting';
} = {
  BeforeAppChange: 'flatpad:before-app-change',
  OnAppChanged: 'flatpad:on-app-changed',
  ErrorAppLoading: 'flatpad:error-app-loading',
  ErrorAppMounting: 'flatpad:error-app-mounting',
  ErrorAppUnmounting: 'flatpad:error-app-unmounting',
};

export function dispatchCustomEvent(eventName: string, detail?: any) {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

export function throwError(message: string): never {
  throw new Error(`[${PACKAGE_NAME}] ${message}`);
}

export function warn(message: string, ...args: any[]) {
  console.warn(`[${PACKAGE_NAME}] ${message}`, ...args);
}

export function error(message: string, ...args: any[]) {
  console.error(`[${PACKAGE_NAME}] ${message}`, ...args);
}

/**
 * parse route, add '/' to the beginning and remove '/' from the end
 * @param {string} route
 * @returns {string}
 */
export function parseRoute(route: string): string {
  if (!route) return '';
  if (!route.startsWith('/')) route = `/${route}`;
  if (route.endsWith('/')) route = route.slice(0, -1);

  return route;
}

/**
 * transform path to regexp and extract param names from path
 * @param {string} path
 * @returns {RegExp}
 */
export function transformRegexp(path: string): RegExp {
  const strArr = path.split(/:([^/:]+)/g);

  let reg = '';
  for (let i = 0, l = strArr.length; i < l; i += 1) {
    const str = strArr[i];
    if (i % 2) {
      const result = str.match(/\((.+)\)/g);
      reg += result || '(.+?)';
    } else {
      reg += str;
    }
  }

  return new RegExp(`^${reg}(?:\/[^\/]+)*\/?$`);
}
