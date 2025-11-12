import type { Plugin } from 'vite';

import { join, basename } from 'node:path';

/**
 * change relative path into absolute path in vite built assets
 */
export function buildAbsolutePath(): Plugin {
  let base = '';
  let assetsDir = '';

  return {
    name: 'build-absolute-path',
    apply: 'build',
    configResolved(config) {
      base = config.base;
      assetsDir = config.build.assetsDir;
    },
    renderChunk(code, chunk) {
      let r = code;
      const { imports, dynamicImports } = chunk;
      for (const file of imports) {
        if (file.endsWith('.js')) {
          const fileName = basename(file);
          r = r.replace(new RegExp(`[^/]${assetsDir}/${fileName}|\\./${fileName}`), join(base, assetsDir, fileName));
        }
      }

      for (const file of dynamicImports) {
        if (file.endsWith('.js')) {
          const fileName = basename(file);
          r = r.replace(new RegExp(`[^/]${assetsDir}/${fileName}|\\./${fileName}`), join(base, assetsDir, fileName));
        }
      }

      return r;
    },
  };
}
