import path from "path"
import glob from "glob"
import { Configuration } from "webpack"

// Add entries for each page bundle's custom script
const getEntries = (pattern: string): { [key: string]: string } => {
    const entries: { [key: string]: string } = {}

    glob.sync(pattern).forEach(file => {
        entries[file.replace("assets/js", "")] = path.join(__dirname, file)
    })

    return entries
}

const common = [
    {
        test: /\.js$/,
        loader: "babel-loader",
        include: [
            path.join(__dirname, "assets", "js"),
            path.join(__dirname, "serviceworker.js"),
        ],
        options: {
            cacheDirectory: true,
            presets: [["@babel/preset-env", { modules: false }]],
        },
    },
    {
        test: /\.tsx?$/,
        use: "ts-loader",
        include: [
            path.join(__dirname, "assets", "js"),
            path.join(__dirname, "serviceworker.ts"),
        ],
    },
]

const config = (
    mode: Configuration["mode"] = "development",
): Configuration[] => [
    {
        name: "main",
        mode,
        devtool: "source-map",
        context: path.join(__dirname, "assets"),
        entry: {
            "main.js": "./js/entry.ts",
            "vendor.js": ["three"],
            ...getEntries("assets/js/work/**/*.{js,ts}"),
        },
        output: {
            path: path.join(__dirname, "dist", "js"),
            publicPath: "/",
            filename: "[name]",
        },
        module: {
            rules: [...common],
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
        resolve: { extensions: [".tsx", ".ts", ".js", ".json"] },
    },
    {
        name: "serviceworker",
        mode,
        devtool: "source-map",
        context: path.join(__dirname, "assets"),
        entry: {
            "serviceworker.js": "./serviceworker.js",
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
]

export default config
