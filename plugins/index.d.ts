declare function buildIndexHtml(options?: { index?: string; entry?: string }): {
  name: string;
  apply: "build";
  config(cfg: any): any;
  configResolved(resolvedConfig: any): void;
  generateBundle(_: any, bundle: any): void;
};

declare function buildAbsolutePath(): {
  name: string;
  apply: "build";
  configResolved(config: any): void;
  renderChunk(code: any, chunk: any): any;
};

export { buildIndexHtml, buildAbsolutePath };
