import { posix } from "node:path";

const windowsSlashRE = /\\/g
const externalRE: RegExp = /^([a-z]+:)?\/\//

export const isWindows = () => process.platform === 'win32';


export const slash = (path: string) => path.replace(windowsSlashRE, '/')


export const normalizePath = (path: string) => posix.normalize(isWindows() ? slash(path) : path)

export const isExternalUrl = (url: string) => externalRE.test(url);

export const toPublicPath = (filename: string, base: string) =>
  isExternalUrl(filename) ? filename : posix.join(base.replace(/\\/g, '/'), filename);
