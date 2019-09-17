import { dest, parallel, series, src, watch } from "gulp"
import { spawn } from "child_process"
import webpack from "webpack"
import webpackConfig from "./webpack.config.js"
import BrowserSync from "browser-sync"
import { mathjaxify } from "gulp-mathjaxify"

const browserSync = BrowserSync.create()

const buildHugo = ({ env = "development", options = undefined } = {}) =>
  Object.assign(
    done => {
      process.env.NODE_ENV = env

      const defaultArgs = ["--destination", "./dist", "--minify", "--verbose"]
      const args = options ? defaultArgs.concat(options) : defaultArgs

      return spawn("hugo", args, { stdio: "inherit" }).on("close", code => {
        if (code === 0) {
          browserSync.reload()
          done()
        } else {
          browserSync.notify("Hugo build failed")
          done("Hugo build failed")
        }
      })
    },
    { displayName: "hugo" },
  )

const buildWebpack = ({ env = "development" } = {}) =>
  Object.assign(
    done => {
      webpack(webpackConfig(env), (err, stats) => {
        if (err) throw new Error(err)

        console.log(
          `[webpack] ${stats.toString({
            colors: true,
            progress: true,
          })}`,
        )

        browserSync.reload()
        done()
      })
    },
    { displayName: "webpack" },
  )

const serve = () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
      middleware: [
        // Add Content-Security-Policy header http://www.w3.org/TR/CSP/
        (_, res, next) => {
          const csp = `default-src 'self'`
          res.setHeader("Content-Security-Policy", csp)
          next()
        },
      ],
    },
    open: false,
  })

  watch(
    ["./assets/css/**/*", "./content/**/*", "./data/**/*", "./layouts/**/*"],
    series(buildHugo(), mathjax),
  )
  watch(
    ["./assets/js/**/*.{js,ts,tsx}", "./assets/serviceworker.js"],
    buildWebpack(),
  )
  watch(["./assets/fonts/**/*"], fonts)
  watch(["./assets/img/**/*"], images)
}

const fonts = () =>
  src(["./assets/fonts/**/*"])
    .pipe(dest("./dist/fonts/"))
    .pipe(browserSync.stream())

const manifest = () =>
  src(["./assets/favicon.ico", "./assets/manifest.json"])
    .pipe(dest("./dist/"))
    .pipe(browserSync.stream())

const images = () =>
  src(["./assets/img/**/*"])
    .pipe(dest("./dist/img/"))
    .pipe(browserSync.stream())

const mathjax = () =>
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

export const dev = series(
  buildHugo(),
  mathjax,
  parallel(buildWebpack(), images, fonts, manifest),
  serve,
)

export const prod = series(
  buildHugo("production"),
  mathjax,
  parallel(buildWebpack("production"), images, fonts, manifest),
)
