/*
 * @Author: Yorn Qiu
 * @Date: 2022-07-25 15:00:10
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2022-11-10 11:02:25
 * @Description: index
 * @FilePath: /flatpad/src/index.ts
 */
import { onRoute } from './router';

window.__FLATPAD_ENV__ = true;
window.__FLATPAD_APPS__ = {};
window.__FLATPAD_APP_NAME__ = '';

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
  onRoute()
}
