/*
 * @Author: Yorn Qiu
 * @Date: 2022-11-07 18:08:40
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2023-12-20 14:42:18
 * @FilePath: /flatpad/packages/flatpad/src/router.ts
 * @Description: router
 */
import { getMatchedApplication, mountApp, getAllApplications } from './api';

const rawPushState = window.history.pushState;
const rawReplaceState = window.history.replaceState;

window.history.pushState = patchedUpdateState(rawPushState);
window.history.replaceState = patchedUpdateState(rawReplaceState);

window.addEventListener('hashchange', onRoute);
window.addEventListener('popstate', onRoute);

/**
 * when pushState or replaceState is called, triggering route change to toggle application
 * @param {function} updateState pushState or replaceState
 * @returns {function}
 */
function patchedUpdateState(updateState: History['pushState']) {
  return function (this: History, ...args: Parameters<History['pushState']>) {
    updateState.apply(this, args);
    onRoute();
  };
}

let lastPath = '';

/**
 * perform router change to toggle apps
 */
export function onRoute() {
  const { pathname } = window.location;
  if (lastPath === pathname) return;

  lastPath = pathname;
  const appName = getMatchedApplication(pathname);

  appName && mountApp(appName);
}
