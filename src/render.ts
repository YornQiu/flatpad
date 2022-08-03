/*
 * @Author: Yorn Qiu
 * @Date: 2022-04-21 15:35:22
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2022-08-03 14:28:09
 * @Description: render template and execute scripts
 * @FilePath: /flatpad/src/render.ts
 */

import type { AppSource } from './types';

import { throwError } from './utils';

/**
 * get root element
 * @param {string} root id of root element
 * @returns {HTMLElement}
 */
export function getRootElement(root: string): HTMLElement {
  const rootElement = document.getElementById(root);
  if (!rootElement) {
    throwError(`No element found for root: ${root}`);
  }

  return rootElement;
}

/**
 * render content
 * @param {string} appName application name
 * @param {HTMLElement} rootElement root element
 * @param {object} appSource
 * @param {HTMLDivElement} appSource.template template
 * @param {HTMLScriptElement[]} appSource.script script
 */
export async function renderContent(appName: string, rootElement: HTMLElement, { template, scripts }: AppSource) {
  renderHtml(rootElement, template);
  await execScripts(appName, rootElement, scripts);
}

/**
 * remove content
 * @param appName application name
 * @param rootElement root element
 */
export function removeContent(appName: string, rootElement: HTMLElement) {
  window.__FLATPAD_APPS__[appName].unmount();
  rootElement.innerHTML = ''
}

/**
 *  Mount html to root element
 * @param {HTMLElement} rootElement root element
 * @param {HTMLDivElement} template
 */
function renderHtml(rootElement: HTMLElement, template: HTMLDivElement) {
  // the template is cloned because it's been cached
  const node = template.cloneNode(true);
  const fragment = document.createDocumentFragment();

  // clear then append
  rootElement.innerHTML = '';
  Array.from(node.childNodes).forEach((node) => fragment.appendChild(node));
  rootElement.appendChild(fragment);
}

/**
 * append scripts to root element
 * @param {string} appName application name
 * @param {HTMLElement} rootElement root element
 * @param {HTMLScriptElement[]} scriptElements
 */
function execScripts(appName: string, rootElement: HTMLElement, scriptElements: HTMLScriptElement[]) {
  return new Promise<void>((resolve, reject) => {
    const l = scriptElements.length;
    let count = 0;

    // the same script won't be executed twice in browser when app is second mounted
    // we must create a new script element to because of cache
    for (let i = 0, l = scriptElements.length; i < l; i += 1) {
      const scriptElement = scriptElements[i];

      const script = document.createElement('script');
      const attrs = scriptElement.getAttributeNames();

      for (const attr of attrs) {
        script.setAttribute(attr, scriptElement.getAttribute(attr) as string);
      }

      script.onload = onLoadAllScripts;
      script.onerror = () => reject()

      rootElement.appendChild(script);
    }

    function onLoadAllScripts() {
      count++;
      if (count === l) {
        window.__FLATPAD_APPS__[appName].mount();
        resolve();
      }
    }
  });
}

/**
 * execute entry script mount function
 * @param {HTMLElement} rootElement root element
 * @param {string} entryScriptSrc
 */
export function execEntryScriptMount(rootElement: HTMLElement, entryScriptSrc?: string) {
  if (!entryScriptSrc) return;

  const script = document.createElement('script');
  script.type = 'module';
  script.textContent = `import {mount} from '${entryScriptSrc}';mount();`;
  script.setAttribute('data-mount-script', '');
  rootElement.appendChild(script);
}

/**
 * execute entry script unmount function
 * @param {HTMLElement} rootElement root element
 * @param {string} entryScriptSrc
 */
export function execEntryScriptUnmount(rootElement: HTMLElement, entryScriptSrc?: string) {
  if (!entryScriptSrc) return;

  const script = document.createElement('script');
  script.type = 'module';
  script.textContent = `import {unmount} from '${entryScriptSrc}';unmount();`;
  script.setAttribute('data-unmount-script', '');
  rootElement.appendChild(script);
}
