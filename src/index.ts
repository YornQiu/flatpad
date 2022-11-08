/*
 * @Author: Yorn Qiu
 * @Date: 2022-07-25 15:00:10
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2022-11-07 16:39:22
 * @Description: index
 * @FilePath: /flatpad/src/index.ts
 */

window.__FLATPAD_ENV__ = true;
window.__FLATPAD_APPS__ = {};
window.__FLATPAD_APP_NAME__ = '';

export const getCurrentAppName = () => window.__FLATPAD_APP_NAME__;
export const setCurrentAppName = (name: string) => (window.__FLATPAD_APP_NAME__ = name);

export {
  registerApplication,
  unregisterApplication,
  getApplication,
  getAllApplications,
  mountApp,
  unmountApp,
} from './api';
export { Events } from './utils';
