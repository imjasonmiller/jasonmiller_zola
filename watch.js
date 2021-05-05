import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { readFile, writeFile, mkdir } from "fs/promises";

import browserSync from "browser-sync";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a Browsersync instance
const bs = browserSync.create();

function buildZola() {
  const cmd = spawn("/home/jason/.cache/cargo/release/zola", [
    "build",
    "--base-url",
    "http://localhost:3000",
  ]);

  cmd.stdout.on("data", (data) => process.stdout.write(data));
  cmd.stdout.on("close", (code) => {
    if (code !== 0) {
      bs.notify("Zola build failed");
      return;
    }

    bs.reload();
  });
}

async function init() {
  // Zola will clean the "public" directory as well.
  buildZola();
}

init();

// Listen to change events on pages and rebuild
bs.watch("templates/**/*.html", "sass/assets/css/*.css").on("change", () => {
  buildZola();
  bs.reload();
});

bs.init({ watch: false, open: false, server: "./public" });
