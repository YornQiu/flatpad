# Flatpad
A micro frontend library for esm

## How to build main app?
Reference to `/examples/main`.

Use `registerApplication` to register sub app.
Use `mountApp` to mount sub app.

## How to build sub apps?
Reference to `/examples/child`.

Sub apps need to export `mount` and `unmount` lifecycle functions, which will be called in main app.

And sub apps should clear app states and datas when unmounting, which could release memory and stop side effects.

## Notice
* no sandbox 
* only support single instance
