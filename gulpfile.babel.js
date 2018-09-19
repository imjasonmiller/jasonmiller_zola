import gulp from "gulp"
import { execFile, spawn } from "child_process"
import webpack from "webpack"
import webpackConfig from "./webpack.config.js"
import BrowserSync from "browser-sync"

const browserSync = BrowserSync.create()

const hugoArgsDefault = ["--destination", "./dist", "--minify", "--verbose"]
const hugoArgsPreview = ["--buildDrafts", "--buildFuture"]

const hugoBuild = (done, options, env = "development") => {
  process.env.NODE_ENV = env

  const args = options ? hugoArgsDefault.concat(options) : hugoArgsDefault

  return spawn("hugo", args, { stdio: "inherit" }).on("close", code => {
    if (code === 0) {
      browserSync.reload()
      done()
    } else {
      browserSync.notify("Hugo build failed")
      done("Hugo build failed")
    }
  })
}

const webpackBuild = (done, env = "development") => {
  webpack(webpackConfig(env), (err, stats) => {
    if (err) throw new Error(err)

    console.log(
      "[webpack]",
      stats.toString({
        colors: true,
        progress: true,
      }),
    )

    browserSync.reload()
    done()
  })
}

const initServer = () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    open: false,
  })

  gulp.watch(
    ["./assets/css/**/*", "./content/**/*", "./data/**/*", "./layouts/**/*"],
    gulp.series("hugo"),
  )
  gulp.watch(
    ["./assets/js/**/*.js", "./assets/serviceworker.js"],
    gulp.series("js"),
  )
  gulp.watch(["./assets/fonts/**/*"], gulp.series("fonts"))
  gulp.watch(["./assets/img/**/*"], gulp.series("images"))
}

// Move fonts
gulp.task("fonts", () =>
  gulp
    .src(["./assets/fonts/**/*"])
    .pipe(gulp.dest("./dist/fonts/"))
    .pipe(browserSync.stream()),
)

// Manifest
gulp.task("manifest", () =>
  gulp
    .src(["./assets/favicon.ico", "./assets/manifest.json"])
    .pipe(gulp.dest("./dist/"))
    .pipe(browserSync.stream()),
)

// Images
gulp.task("images", () =>
  gulp
    .src(["./assets/img/**/*"])
    .pipe(gulp.dest("./dist/img/"))
    .pipe(browserSync.stream()),
)

// Development
gulp.task("hugo", hugoBuild)
gulp.task("js", done => webpackBuild(done))

// Development server
gulp.task(
  "server",
  gulp.series("hugo", "js", "images", "fonts", "manifest", initServer),
)

// Production
gulp.task("hugo-prod", done => hugoBuild(done, [], "production"))
gulp.task("js-prod", done => webpackBuild(done, "production"))

gulp.task(
  "build",
  gulp.series("hugo-prod", "js-prod", "images", "fonts", "manifest"),
)
