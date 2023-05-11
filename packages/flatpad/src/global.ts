/*
 * @Author: Yorn Qiu
 * @Date: 2022-06-13 10:25:25
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2022-11-07 16:37:55
 * @Description: global vars
 * @FilePath: /flatpad/src/global.ts
 */

window.__FLATPAD_ENV__ = true;
window.__FLATPAD_APPS__ = {};
window.__FLATPAD_APP_NAME__ = '';

const getCurrentAppName = () => window.__FLATPAD_APP_NAME__;
const setCurrentAppName = (name: string) => (window.__FLATPAD_APP_NAME__ = name);

// global
const rawWindow = Function('return window')();
const rawDocument = Function('return document')();

// effect
const rawWindowAddEventListener = rawWindow.addEventListener;
const rawWindowRemoveEventListener = rawWindow.removeEventListener;
const rawSetInterval = rawWindow.setInterval;
const rawSetTimeout = rawWindow.setTimeout;
const rawClearInterval = rawWindow.clearInterval;
const rawClearTimeout = rawWindow.clearTimeout;
const rawDocumentAddEventListener = rawDocument.addEventListener;
const rawDocumentRemoveEventListener = rawDocument.removeEventListener;

export default {
  getCurrentAppName,
  setCurrentAppName,

  rawWindow,
  rawDocument,

  rawWindowAddEventListener,
  rawWindowRemoveEventListener,
  rawSetInterval,
  rawSetTimeout,
  rawClearInterval,
  rawClearTimeout,
  rawDocumentAddEventListener,
  rawDocumentRemoveEventListener,
};
