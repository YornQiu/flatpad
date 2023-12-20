# Flatpad

A micro frontend library for esm.

Flatpad has no framework restriction, which means you can use Vue, React and any others you like at the same time.

## Usage

1. Install

```shell
npm i flatpad
```

2. Import & Start

```typescript
// main.ts in main app
import { registerApplication, start } from 'flatpad';

// apps is sub app configurations
const apps = [
  {
    name: 'app1',
    entry: 'http://localhost:9091',
  },
  {
    name: 'app2',
    entry: 'http://localhost:9092',
  },
];

// register
registerApplication(apps);

// start
start();
```

3. Config sub apps

```typescript
// main.ts in sub app

function mount() {
  // ...
}

function unmount() {
  // ...
}
```

Enter script should add a _entry_ attribute.

```html
<!-- index.html in sub app -->
...
<script type="module" entry src="/src/main.ts"></script>
...
```

## How to build main app?

Reference to `/examples/main`.

Use `registerApplication` to register sub apps.
Then `start`.

## How to build sub apps?

Reference to `/examples/child`.

Sub apps need to export `mount` and `unmount` lifecycle functions, which will be called in main app.

> Note: sub apps should clear app states and datas when unmounting, which could release memory and stop side effects.

Sub app's _mount_ and _unmount_:

```typescript
// for vue app

let app: App | null = null;
let router = null;
let history: RouterHistory | null = null;

export function mount() {
  history = createWebHistory();
  router = createRouter({ history, routes });
  app = createApp(Main);

  app.use(router).mount('#app');
}

export function unmount() {
  app?.unmount();
  history?.destroy();

  app = null;
  router = null;
  history = null;
}
```

## Notice

Flatpad has below disadvantages:

- no sandbox - Sandbox realized by **with** and **eval** is not suitable for esm.
- only support single instance - For lack of sandbox, routers may produce unexpected effects when there are multiple instances.

# License

[MIT](./LICENSE)
