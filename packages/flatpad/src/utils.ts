/*
 * @Author: Yorn Qiu
 * @Date: 2022-04-24 11:46:03
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2023-05-10 13:51:50
 * @Description: utils
 * @FilePath: /flatpad/packages/flatpad/src/utils.ts
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

  return new RegExp(`^${reg}`);
}
