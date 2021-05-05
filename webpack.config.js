import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sharedConfiguration = {
  entry: {
    main: {
      import: path.resolve(__dirname, "./js/index.ts"),
    },
  },
  mode: process.env.NODE_ENV || "development",
  devtool: "source-map",
  resolve: {
    extensions: [".wasm", ".mjs", ".js", ".ts", ".json"],
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          reuseExistingChunk: true,
        },
      },
    },
  },
};

export default [
  {
    ...sharedConfiguration,
    name: "modern",
    output: {
      path: path.resolve(__dirname, "static", "js"),
      filename: "[name].mjs",
      publicPath: "/js/",
    },
    module: {
      rules: [
        {
          test: /\.(m?js|ts)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    // Only include the polyfills that are being used
                    useBuiltIns: "usage",
                    // @babel/polyfill is deprecated and has been replaced for "corejs"
                    corejs: 3,
                    // Do not transform ES module syntax
                    modules: false,
                    targets: {
                      // Target browsers that do support "esmodules"
                      esmodules: true,
                    },
                  },
                ],
                "@babel/preset-typescript",
              ],
              plugins: ["@babel/plugin-proposal-class-properties"],
            },
          },
        },
      ],
    },
  },
  {
    ...sharedConfiguration,
    name: "legacy",
    output: {
      path: path.resolve(__dirname, "static", "js"),
      filename: "[name].bundle.js",
      publicPath: "/js/",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(m?js|ts)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    // Only include the polyfills that are being used
                    useBuiltIns: "usage",
                    // @babel/polyfill is deprecated and has been replaced for "corejs"
                    corejs: 3,
                    targets: {
                      // Target browsers that do not support "esmodules"
                      esmodules: false,
                    },
                  },
                ],
                "@babel/preset-typescript",
              ],
              plugins: ["@babel/plugin-proposal-class-properties"],
            },
          },
        },
      ],
    },
  },
  {
    ...sharedConfiguration,
    name: "serviceworker",
    entry: {
      serviceworker: {
        import: path.resolve(__dirname, "./js/serviceworker.ts"),
      },
    },
    output: {
      path: path.resolve(__dirname, "static"),
      filename: "[name].js",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript"],
            },
          },
        },
      ],
    },
  },
];
