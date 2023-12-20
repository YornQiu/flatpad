/*
 * @Author: Yorn Qiu
 * @Date: 2022-07-25 15:00:10
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2023-12-20 14:19:21
 * @FilePath: /flatpad/packages/flatpad/src/index.ts
 * @Description: index
 */
import { onRoute } from './router';

window.__FLATPAD_ENV__ = true;

export {
  registerApplication,
  unregisterApplication,
  getApplication,
  getAllApplications,
  mountApp,
  unmountApp,
} from './api';
export { Events } from './utils';

export function start() {
  onRoute();
}
