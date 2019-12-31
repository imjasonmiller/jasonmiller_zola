import { dest, parallel, series, src, watch } from "gulp"
import { spawn, ChildProcess } from "child_process"
import webpack, { Configuration } from "webpack"
import webpackConfig from "./webpack.config"
import BrowserSync from "browser-sync"
import { mathjaxify } from "gulp-mathjaxify"
import { TaskFunction } from "undertaker"

const browserSync = BrowserSync.create()

const buildHugo = ({ env = "development", options = [] } = {}): TaskFunction =>
    Object.assign(
        (done: Function): ChildProcess => {
            process.env.NODE_ENV = env

            const defaultArgs = [
                "--destination",
                "./dist",
                "--minify",
                "--verbose",
            ]
            const args = options ? defaultArgs.concat(options) : defaultArgs

            return spawn("hugo", args, { stdio: "inherit" }).on(
                "close",
                code => {
                    if (code === 0) {
                        browserSync.reload()
                        done()
                    } else {
                        browserSync.notify("Hugo build failed")
                        done("Hugo build failed")
                    }
                },
            )
        },
        { displayName: "hugo" },
    )

const buildWebpack = ({
    env = "development",
}: { env?: Configuration["mode"] } = {}): TaskFunction =>
    Object.assign(
        (done: Function): void => {
            webpack(webpackConfig(env), (err, stats) => {
                if (err) throw new Error(err.message)

                console.log(
                    `[webpack] ${stats.toString({
                        colors: true,
                    })}`,
                )

                browserSync.reload()
                done()
            })
        },
        { displayName: "webpack" },
    )

const mathjax = (): NodeJS.ReadWriteStream =>
    src(["./dist/**/*.html"])
        .pipe(
            mathjaxify(
                {
                    format: ["TeX"],
                    singleDollars: true,
                },
                {
                    svg: true,
                    mml: true,
                    ex: 10,
                },
            ),
        )
        .pipe(dest("./dist/"))

const images = (): NodeJS.ReadWriteStream =>
    src(["./assets/img/**/*"])
        .pipe(dest("./dist/img/"))
        .pipe(browserSync.stream())

const fonts = (): NodeJS.ReadWriteStream =>
    src(["./assets/fonts/**/*"])
        .pipe(dest("./dist/fonts/"))
        .pipe(browserSync.stream())

const serve = (): void => {
    browserSync.init({
        server: {
            baseDir: "./dist",
        },
        open: false,
    })

    watch(
        [
            "./assets/css/**/*",
            "./content/**/*",
            "./data/**/*",
            "./layouts/**/*",
        ],
        series(buildHugo(), mathjax),
    )
    watch(
        ["./assets/js/**/*.{js,ts,tsx}", "./assets/serviceworker.{js,ts}"],
        buildWebpack(),
    )
    watch(["./assets/fonts/**/*"], fonts)
    watch(["./assets/img/**/*"], images)
}

const manifest = (): NodeJS.ReadWriteStream =>
    src(["./assets/favicon.ico", "./assets/manifest.json"])
        .pipe(dest("./dist/"))
        .pipe(browserSync.stream())

export const dev = series(
    buildHugo(),
    mathjax,
    parallel(buildWebpack(), images, fonts, manifest),
    serve,
)

export const prod = series(
    buildHugo({ env: "production" }),
    mathjax,
    parallel(buildWebpack({ env: "production" }), images, fonts, manifest),
)
