# vite plugin for flatpad


## ✨ features

### build-entry-script (src/build-entry-script.js)

Build sub app with entry script that has `mount` and `unmount` methods exported.

In original vite bundle, the `export` statement in `main.js` will be removed while building, which will cause flatpad cannot access the sub app's lifesycle functions.

This plugin will change the `input` of rollup to `src/main.js` instead of `index.html`, then regenerate the `index.html` with the sub app's entry script.

### build-absolute-path (src/build-absolute-path.js)

The path of `import` statement in `assets/*.js` is always relative after bundling. This plugin will change the relative path to absolute path.
