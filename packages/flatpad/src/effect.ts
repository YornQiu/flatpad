/*
 * @Author: Yorn Qiu
 * @Date: 2022-07-25 09:50:31
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2022-08-02 17:38:53
 * @Description: window side effects
 * @FilePath: /flatpad/src/effect.ts
 */

import globalEnv from './global';

const {
  rawWindow,
  rawWindowAddEventListener,
  rawWindowRemoveEventListener,
  rawSetTimeout,
  rawClearTimeout,
  rawSetInterval,
  rawClearInterval,
  rawDocumentAddEventListener,
  rawDocumentRemoveEventListener,
  getCurrentAppName,
} = globalEnv;

/**
 * EventListener
 */

const eventListenerMap = new Map<string, Map<string, Set<EventListenerOrEventListenerObject>>>();

window.addEventListener = function (
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
) {
  const name = getCurrentAppName();
  const listenerMap = eventListenerMap.get(name);
  if (listenerMap) {
    const listenerSet = listenerMap.get(type);
    if (listenerSet) {
      listenerSet.add(listener);
    } else {
      listenerMap.set(type, new Set([listener]));
    }
  } else {
    eventListenerMap.set(name, new Map([[type, new Set([listener])]]));
  }

  rawWindowAddEventListener.call(rawWindow, type, listener, options);
};

window.removeEventListener = function (
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | EventListenerOptions
) {
  const name = getCurrentAppName();
  const listenerSet = eventListenerMap.get(name)?.get(type);
  if (listenerSet?.has(listener)) {
    listenerSet.delete(listener);
  }

  rawWindowRemoveEventListener.call(rawWindow, type, listener, options);
};

const documentEventListenerMap = new Map<string, Map<string, Set<EventListenerOrEventListenerObject>>>();

document.addEventListener = function (
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
) {
  const name = getCurrentAppName();
  const listenerSet = documentEventListenerMap.get(name)?.get(type);
  if (listenerSet) {
    listenerSet.add(listener);
  } else {
    documentEventListenerMap.set(name, new Map([[type, new Set([listener])]]));
  }

  rawDocumentAddEventListener.call(rawWindow, type, listener, options);
};

document.removeEventListener = function (
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | EventListenerOptions
) {
  const name = getCurrentAppName();
  const listenerSet = documentEventListenerMap.get(name)?.get(type);
  if (listenerSet?.has(listener)) {
    listenerSet.delete(listener);
  }

  rawDocumentRemoveEventListener.call(rawWindow, type, listener, options);
};

/**
 * timeout
 */

const timeoutMap = new Map<string, Set<number>>();

window.setTimeout = function (handler: TimerHandler, delay?: number, ...args: any[]) {
  const name = getCurrentAppName();
  const timeoutId = rawSetTimeout.call(rawWindow, handler, delay, ...args);
  const timeoutSet = timeoutMap.get(name);
  if (timeoutSet) {
    timeoutSet.add(timeoutId);
  } else {
    timeoutMap.set(name, new Set([timeoutId]));
  }

  return timeoutId;
};

window.clearTimeout = function (timeoutId?: number) {
  if (timeoutId === undefined) return;

  const timeoutSet = timeoutMap.get(getCurrentAppName());
  timeoutSet?.delete(timeoutId);

  rawClearTimeout.call(rawWindow, timeoutId);
};

/**
 *  interval
 */

const intervalMap = new Map<string, Set<number>>();

window.setInterval = function (handler: TimerHandler, delay?: number, ...args: any[]) {
  const name = getCurrentAppName();
  const intervalId = rawSetInterval.call(rawWindow, handler, delay, ...args);
  const intervalSet = intervalMap.get(name);
  if (intervalSet) {
    intervalSet.add(intervalId);
  } else {
    intervalMap.set(name, new Set([intervalId]));
  }

  return intervalId;
};

window.clearInterval = function (intervalId?: number) {
  if (intervalId === undefined) return;

  const intervalSet = intervalMap.get(getCurrentAppName());
  intervalSet?.delete(intervalId);

  rawClearInterval.call(rawWindow, intervalId);
};

export function clearEventListener() {
  const name = getCurrentAppName();

  if (!name) return;

  const listenerMap = eventListenerMap.get(name);
  listenerMap?.forEach((listenerSet, type) => {
    for (const listener of listenerSet) {
      rawWindowRemoveEventListener.call(rawWindow, type, listener);
    }
  });

  eventListenerMap.delete(name);

  const documentListenerMap = documentEventListenerMap.get(name);
  documentListenerMap?.forEach((listenerSet, type) => {
    for (const listener of listenerSet) {
      rawDocumentRemoveEventListener.call(rawWindow, type, listener);
    }
  });

  documentEventListenerMap.delete(name);
}

export function clearTimeoutAndInterval() {
  const name = getCurrentAppName();

  if (!name) return;

  const timeoutSet = timeoutMap.get(name);
  timeoutSet?.forEach((timeoutId) => {
    rawClearTimeout.call(rawWindow, timeoutId);
  });

  timeoutMap.delete(name);

  const intervalSet = intervalMap.get(name);
  intervalSet?.forEach((intervalId) => {
    rawClearInterval.call(rawWindow, intervalId);
  });

  intervalMap.delete(name);
}

export function clearAll() {
  clearEventListener();
  clearTimeoutAndInterval();
}
