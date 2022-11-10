interface CustomEventDetail {
  appToMount: Application | null;
  appToUnmount: Application | null;
}

interface CustomEventDetailError extends CustomEventDetail {
  error: Error | Response;
}

interface CustomEventMap {
  'flatpad:before-app-change': CustomEvent<CustomEventDetail>;
  'flatpad:on-app-changed': CustomEvent<CustomEventDetail>;
  'flatpad:error-app-loading': CustomEvent<CustomEventDetailError>;
  'flatpad:error-app-mounting': CustomEvent<CustomEventDetailError>;
  'flatpad:error-app-unmounting': CustomEvent<CustomEventDetailError>;
}

declare global {
  interface Window {
    __FLATPAD_ENV__: boolean;
    __FLATPAD_APP_NAME__: string;
    __FLATPAD_APPS__: { [name: string]: { mount: () => void; unmount: () => void } };
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Window, e: CustomEventMap[K]) => void
    ): void;
  }
}

export interface ApplicationConstructorOptions {
  name: string;
  root: string;
  route: string;
  entry: string;
  regexp: RegExp;
  prefetch?: boolean;
  lifecycle?: ApplicationLifecycle;
}

export interface Application extends ApplicationConstructorOptions {
  status: string;
  load: (force?: boolean) => Promise<void>;
  mount: () => Promise<void>;
  unmount: () => void;
  destroy: () => void;
}

export interface AppSource {
  template: HTMLDivElement;
  scripts: HTMLScriptElement[];
  entryScriptSrc?: string;
}

export interface ApplicationLifecycle {
  beforeLoad?: () => void;
  loaded?: () => void;
  beforeMount?: () => void;
  mounted?: () => void;
  beforeUnmount?: () => void;
  unmounted?: () => void;
}

export interface AppConfig {
  name: string;
  root?: string;
  route?: string;
  entry: string;
  prefetch?: boolean;
}

export interface AppOptions {
  root?: string;
  prefetch?: boolean;
}
