/*
 * @Author: Yorn Qiu
 * @Date: 2022-04-21 15:35:22
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2023-12-19 15:16:31
 * @FilePath: /flatpad/packages/flatpad/src/render.ts
 * @Description: render template and execute scripts
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
 * @param {HTMLElement} rootElement root element
 * @param {object} appSource
 * @param {HTMLDivElement} appSource.template template
 * @param {HTMLScriptElement[]} appSource.script script
 */
export async function renderContent(rootElement: HTMLElement, { template, scripts, entryScriptSrc }: AppSource) {
  renderHtml(rootElement, template);
  execScripts(rootElement, scripts);
  execEntryScriptMount(rootElement, entryScriptSrc);
}

/**
 * remove content
 * @param rootElement root element
 */
export function removeContent(rootElement: HTMLElement, { entryScriptSrc }: AppSource) {
  execEntryScriptUnmount(rootElement, entryScriptSrc);
  rootElement.innerHTML = '';
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
 * @param {HTMLElement} rootElement root element
 * @param {HTMLScriptElement[]} scriptElements
 */
function execScripts(rootElement: HTMLElement, scriptElements: HTMLScriptElement[]) {
  // the same script won't be executed twice in browser when app is second mounted
  // we must create a new script element to because of cache
  for (let i = 0, l = scriptElements.length; i < l; i += 1) {
    const scriptElement = scriptElements[i];

    const script = document.createElement('script');
    const attrs = scriptElement.getAttributeNames();

    for (const attr of attrs) {
      script.setAttribute(attr, scriptElement.getAttribute(attr) as string);
    }

    rootElement.appendChild(script);
  }
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
