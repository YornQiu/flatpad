import { basename } from 'path';

/**
 * add entry attribute for vite built index.html's entry script
 */
export function HtmlEntryScript() {
  return {
    name: 'vite:html-entry-script',
    transformIndexHtml(html, { chunk }) {
      const entryJS = basename(chunk.fileName);
      html = html.replace(new RegExp(`<script .*(src=".*${entryJS}").*></script>`), (all, p1) => {
        return all.replace(p1, p1 + ' entry');
      });
      return html;
    },
  };
}
