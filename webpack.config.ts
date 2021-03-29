import path from "path";
import glob from "glob";
import { Configuration } from "webpack";

// Add entries for each page bundle's custom script
const getEntries = (pattern: string): { [key: string]: string } => {
  const entries: { [key: string]: string } = {};

  glob.sync(pattern).forEach((file) => {
    entries[file.replace("assets/js", "")] = path.join(__dirname, file);
  });

  return entries;
};

const common = [
  {
    test: /\.js$/,
    loader: "babel-loader",
    include: [path.join(__dirname, "assets", "js")],
    options: {
      cacheDirectory: true,
      presets: [["@babel/preset-env", { loose: false, modules: false }]],
      // plugins: [
      //     "@babel/plugin-proposal-class-properties",
      //     [
      //         "@babel/transform-runtime",
      //         {
      //             regenerator: false,
      //             useESModules: false,
      //         },
      //     ],
      // ],
    },
  },
  {
    test: /\.ts$/,
    use: "ts-loader",
    include: [
      path.join(__dirname, "assets", "js"),
      path.join(__dirname, "assets", "serviceworker.ts"),
    ],
  },
];

const config = (
  mode: Configuration["mode"] = "development",
): Configuration[] => [
  {
    name: "main",
    mode,
    devtool: "source-map",
    context: path.join(__dirname, "assets"),
    entry: {
      main: {
        import: "./js/entry.ts",
        filename: "main.js",
      },
      ...getEntries("assets/js/work/**/*.{js,ts}"),
    },
    output: {
      path: path.join(__dirname, "dist", "js"),
      publicPath: "/",
      filename: "[name].js",
    },
    module: {
      rules: [...common],
    },
    optimization: {
      usedExports: true,
      splitChunks: {
        cacheGroups: {
          vendor: {
            // Note: the "shared.js" name is used in layouts/_default/baseof.html
            // If you want to change it, change it there as well.
            name: "shared",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
          },
        },
      },
    },
    resolve: { extensions: [".tsx", ".ts", ".mjs", ".js", ".json"] },
  },
  {
    name: "serviceworker",
    mode,
    devtool: "source-map",
    context: path.join(__dirname, "assets"),
    entry: {
      "serviceworker.js": "./serviceworker.ts",
    },
    output: {
      path: path.join(__dirname, "dist"),
      publicPath: "/",
      filename: "[name]",
    },
    module: {
      rules: [...common],
    },
    resolve: { extensions: [".tsx", ".ts", ".js", ".json"] },
  },
];

export default config;
