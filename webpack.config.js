const webpack = require("webpack")
const path = require("path")
const glob = require("glob")

// Add entries for each page's custom script
const getEntries = pattern => {
  const entries = {}

  glob.sync(pattern).forEach(file => {
    entries[file.replace("assets/js", "")] = path.join(__dirname, file)
  })

  return entries
}

const config = (mode = "development") => ({
  mode,
  devtool: "source-map",
  context: path.join(__dirname, "assets"),
  entry: {
    "main.js": "./js/entry.js",
    "vendor.js": ["three", "popmotion"],
    ...getEntries("assets/js/work/**/*.js"),
  },
  output: {
    path: path.join(__dirname, "dist", "js"),
    publicPath: "/",
    filename: "[name]",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        include: [path.join(__dirname, "assets", "js")],
        options: {
          cacheDirectory: true,
          presets: [["@babel/preset-env", { modules: false }]],
        },
      },
    ],
  },
  optimization: {
    runtimeChunk: {
      name: "vendor.js",
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor.js",
          chunks: "all",
        },
      },
    },
  },
})

module.exports = config
