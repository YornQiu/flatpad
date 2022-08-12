import { basename, dirname, resolve, join } from 'path';
import { readFileSync, existsSync } from 'fs';

/**
 * build index html
 * @param {object} options default index: 'index.html', default entry: 'src/main.js|ts'
 * @param {string} options.index  index.html path
 * @param {string} options.entry  entry.js path
 * @returns
 */
export function buildIndexHtml(options) {
  let config;

  const index = options?.index || 'index.html';
  if (!existsSync(index)) {
    throw new Error(`[build-index-html]: 'index.html' is not found. You must specify index file.`);
  }

  const entry =
    options?.entry || (existsSync('src/main.js') && 'src/main.js') || (existsSync('src/main.ts') && 'src/main.ts');
  if (!entry) {
    throw new Error(`[build-index-html]: 'src/main.js|ts' is not found. You must specify entry file.`);
  }

  const html = readFileSync(resolve(index), 'utf-8');

  return {
    name: 'build-index-html',
    apply: 'build',
    config(cfg) {
      cfg.build = {
        ...cfg.build,
        rollupOptions: {
          ...cfg.build?.rollupOptions,
          input: cfg.build?.rollupOptions?.input ?? entry,
          preserveEntrySignatures: cfg.build?.rollupOptions?.preserveEntrySignatures ?? 'allow-extension',
        },
      };

      return cfg;
    },
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    generateBundle(_, bundle) {
      const indexFullPath = join(config.root, index);
      const entryFullPath = join(config.root, entry);

      // find entry chunk
      const chunk = Object.values(bundle).find(
        (chunk) => chunk.type === 'chunk' && chunk.isEntry && chunk.facadeModuleId === entryFullPath
      );

      // remove entry script
      let result = removeEntryScript(html, indexFullPath, entryFullPath);

      // get entry script
      const scriptTag = {
        tag: 'script',
        attrs: {
          type: 'module',
          entry: true,
          crossorigin: true,
          src: toPublicPath(chunk.fileName, config.base),
        },
        injectTo: 'head',
      };

      // get injected css
      const cssTags = getCssTagsForChunk(chunk, config.base);
      chunk.imports.forEach((file) => {
        const importee = bundle[file];
        if (importee?.type === 'chunk') {
          cssTags.push(...getCssTagsForChunk(importee, config.base));
        }
      });

      // inject assets to html
      result = injectToHtml(result, [scriptTag, ...cssTags]);

      this.emitFile({
        type: 'asset',
        name: 'html',
        fileName: basename(index),
        source: result,
      });
    },
  };
}

/**
 *  remove entry script
 * @param {string} html html content
 * @param {string} indexFullPath
 * @param {string} entryFullPath
 * @returns {string}
 */
const removeEntryScript = (html, indexFullPath, entryFullPath) => {
  const scriptRE = /<script\s[^>]*src=['"]?([^'"]*)['"]?[^>]*>*<\/script>/;
  const scripts = html.match(new RegExp(scriptRE, 'g'));

  if (scripts) {
    const indexDir = dirname(indexFullPath);

    scripts.forEach((script) => {
      const [, src] = script.match(scriptRE);
      if (join(indexDir, src) === entryFullPath) html = html.replace(script, '');
    });
  }

  return html;
};

function getCssTagsForChunk(chunk, base) {
  const tags = [];
  chunk.viteMetadata.importedCss.forEach((file) => {
    tags.push({
      tag: 'link',
      attrs: {
        rel: 'stylesheet',
        href: toPublicPath(file, base),
      },
      injectTo: 'head',
    });
  });

  return tags;
}

const headInjectRE = /([ \t]*)<\/head>/i;
const bodyInjectRE = /([ \t]*)<\/body>/i;

function injectToHtml(html, assets) {
  let result = html;
  const hasHeadElement = headInjectRE.test(html);
  const hasBodyElement = bodyInjectRE.test(html);

  assets.forEach((asset) => {
    if (asset.injectTo === 'head' && hasHeadElement) {
      result = result.replace(headInjectRE, (match, p1) => {
        return `${serializeTag(asset, incrementIndent(p1))}${match}`;
      });
    }

    if (asset.injectTo === 'body' && hasBodyElement) {
      result = result.replace(bodyInjectRE, (match, p1) => `${serializeTag(asset, incrementIndent(p1))}${match}`);
    }
  });

  return result;
}

const unaryTags = new Set(['link', 'meta', 'base']);

function serializeTag({ tag, attrs, children }, indent = '') {
  if (unaryTags.has(tag)) {
    return `${indent}<${tag}${serializeAttrs(attrs)}>\n`;
  } else {
    return `${indent}<${tag}${serializeAttrs(attrs)}>${serializeTags(children, incrementIndent(indent))}</${tag}>\n`;
  }
}

function serializeTags(tags, indent = '') {
  if (typeof tags === 'string') {
    return tags;
  } else if (tags && tags.length) {
    return tags.map((tag) => serializeTag(tag, indent)).join('');
  }
  return '';
}

function serializeAttrs(attrs) {
  let res = '';
  for (const key in attrs) {
    if (typeof attrs[key] === 'boolean') {
      res += attrs[key] ? ` ${key}` : ``;
    } else {
      res += ` ${key}=${JSON.stringify(attrs[key])}`;
    }
  }
  return res;
}

function incrementIndent(indent = '') {
  return `${indent}${indent[0] === '\t' ? '\t' : '  '}`;
}

// const normalizePath = (path) => posix.normalize(path.split(sep).join('/'));

const isExternalPath = (url) => /^(https?:)?\/\/.+/.test(url);

const toPublicPath = (filename, base) => (isExternalPath(filename) ? filename : join(base, filename));
