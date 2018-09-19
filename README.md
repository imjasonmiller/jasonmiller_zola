### Hugo with Webpack 📦 and Gulp 🥤

[![CircleCI](https://circleci.com/gh/imjasonmiller/jasonmiller_hugo.svg?style=shield)](https://circleci.com/gh/imjasonmiller/jasonmiller_hugo)

#### Install

```shell
$ npm install        # 🎉

$ npm run start      # start the dev server
$ npm run build      # build for production
```

#### Analyze bundle

If you would like to analyze the generated `dev` or `prod` webpack bundle with [`webpack-bundle-analyzer`](https://github.com/webpack-contrib/webpack-bundle-analyzer), you can do so with the following commands:

```shell
$ npm run analyze:dev
$ npm run analyze:prod
```

This will start a server on [`127.0.0.1:8888`](http://127.0.0.1:8888/).

#### Todo

- [ ] Refactor long list of groups in the `LogoAnimation` class.
- [ ] Reduce/concat the amount of media queries.
- [ ] Set up a coherent margin/padding/grid system with variables (refactor styles).
- [ ] Check if links/tap targets are of a correct size on smaller devices
