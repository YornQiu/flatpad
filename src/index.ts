/*
 * @Author: Yorn Qiu
 * @Date: 2022-07-25 15:00:10
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2022-08-03 15:08:53
 * @Description: index
 * @FilePath: /flatpad/src/index.ts
 */

import './effect';

export {
  registerApplication,
  unregisterApplication,
  getApplication,
  getAllApplications,
  mountApp,
  unmountApp,
} from './api';
export { default as globalEnv } from './global';
export { Events } from './utils';
