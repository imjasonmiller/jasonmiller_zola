# zola + webpack 📦

A static website built with [Zola](https://github.com/getzola/zola).

The stylesheet is generated from Sass by Zola while JavaScript is handled by Webpack. The latter emits a modular `.mjs` and legacy `.js` bundle using the [`module/nomodule`](https://philipwalton.com/articles/using-native-javascript-modules-in-production-today/) pattern.

## Install

```none
$ npm install 
```

## Build

```none
$ npm run build
```

## Watch

```none
$ npm run watch
```

## Analyze Webpack bundle

If you would like to analyze the generated Webpack bundle with [`webpack-bundle-analyzer`](https://github.com/webpack-contrib/webpack-bundle-analyzer), you can do so with the following command:

```none
$ npm run analyze
```

This will start a server on [`127.0.0.1:8888`](http://127.0.0.1:8888/).
