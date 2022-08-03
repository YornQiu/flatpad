# Flatpad
A micro frontend library for esm

## How to build main app?
Reference to `/examples/main`.

Use `registerApplication` to register sub app.
Use `mountApp` to mount sub app.

## How to build sub apps?
Reference to `/examples/child`.

Sub apps need to export `mount` and `unmount` lifecycle functions, which will be called in main app.

Currently, lifecycle functions of sub apps are set on window.

In fact, they should be exported directly. The problem is rollup will remove export statements in entry script while building. And I still have no idea how to handle this properly.
