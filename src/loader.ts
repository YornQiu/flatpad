/*
 * @Author: Yorn Qiu
 * @Date: 2022-04-04 18:16:06
 * @LastEditors: Yorn Qiu
 * @LastEditTime: 2022-11-10 11:48:08
 * @Description: load and extract source from application's entry file
 * @FilePath: /flatpad/src/loader.ts
 */

import type { AppSource } from './types';

// Cache application's source
const appSourceCache = new Map<string, AppSource>();


/**
 * @description: load app source
 * @param {string} name application's name
 * @param {string} entry application's source url
 * @param {boolean} force force to reload application's source
 * @returns 
 */
export async function loadApp(name: string, entry: string, force?:boolean): Promise<AppSource> {
  if (appSourceCache.has(name) && !force) return appSourceCache.get(name)!;

  const origin = hasOrigin(entry) ? new URL(entry).origin : '';

  const source = await loadSource(entry);
  const { template, links, scripts } = extractHtml(source, origin);

  const styles = await loadStyles(links);
  for (let i = 0, l = links.length; i < l; i += 1) {
    template.replaceChild(styles[i], links[i]);
  }

  let entryScriptSrc = '';
  if (scripts.length === 1) {
    entryScriptSrc = scripts[0].getAttribute('src') || '';
  } else {
    for (const script of scripts) {
      if (script.hasAttribute('entry')) {
        entryScriptSrc = script.getAttribute('src')!;
        break;
      }
    }
  }

  appSourceCache.set(name, { template, scripts, entryScriptSrc });
  return { template, scripts, entryScriptSrc };
}

/**
 * extract template, styles, scripts from html source
 * @param {string} htmlStr html string
 * @param {string} origin origin url
 * @returns {object} template, links, scripts
 */
function extractHtml(htmlStr: string, origin: string) {
  const template = document.createElement('div');
  template.innerHTML = htmlStr;

  const children = template.children;
  const links: HTMLLinkElement[] = [];
  const scripts: HTMLScriptElement[] = [];

  for (let i = 0, l = children.length; i < l; i++) {
    const element = children[i];

    if (element instanceof HTMLLinkElement) {
      if (element.rel === 'stylesheet' && element.href) {
        if (origin && !hasOrigin(element.getAttribute('href')!))
          element.setAttribute('href', new URL(element.getAttribute('href')!, origin).href);

        links.push(element);
      } else {
        template.removeChild(element);
        i--;
      }
    }

    if (element instanceof HTMLScriptElement) {
      if (origin && element.src && !hasOrigin(element.getAttribute('src')!))
        element.setAttribute('src', new URL(element.getAttribute('src')!, origin).href);
      scripts.push(element);
      template.removeChild(element);
      i--;
    }

    // remove unnecessary elements
    if (element instanceof HTMLMetaElement || element instanceof HTMLTitleElement) {
      template.removeChild(element);
      i--;
    }
  }

  return { template, links, scripts };
}

/**
 * Load sources from link elements and return style elements
 * @param {Array<HTMLLinkElement>} linkElements link elements
 * @returns {Array<HTMLStyleElement>} style elements
 */
async function loadStyles(linkElements: HTMLLinkElement[]): Promise<HTMLStyleElement[]> {
  return Promise.all(
    linkElements.map((element) =>
      loadSource(element.href).then((data) => {
        const style = document.createElement('style');
        style.textContent = data;
        style.setAttribute('data-href', element.href);

        return style;
      })
    )
  );
}

/**
 * load file from url with fetch or given function
 * @param {string|function} urlOrFn url or function
 * @returns {Promise<string>}
 */
async function loadSource(urlOrFn: string | (() => Promise<string>)): Promise<string> {
  return typeof urlOrFn === 'function'
    ? await urlOrFn()
    : fetch(urlOrFn).then((response) => (response.ok ? response.text() : Promise.reject(response)));
}

/**
 * Clear cache
 * @param {string} name application's name
 */
export function clearCache(name: string) {
  if (!name) return false;

  return appSourceCache.delete(name);
}

function hasOrigin(url: string) {
  return /^https?:\/\/[\w-.]+(:\d+)?/.test(url);
}
