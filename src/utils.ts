/*
 * @Author: Yorn Qiu
 * @Date: 2022-04-24 11:46:03
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2022-08-03 14:55:55
 * @Description: utils
 * @FilePath: /flatpad/src/utils.ts
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
