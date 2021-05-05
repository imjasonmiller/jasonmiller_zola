import crypto from "crypto";
import fs from "fs";

// As Zola does not support custom output formats,
// we generate the `serviceworker-cache.json` via Node.
function getChecksum(path) {
  return new Promise(function (resolve, reject) {
    const hash = crypto.createHash("sha256");
    const input = fs.createReadStream(path);

    input.on("error", reject);

    input.on("data", function (chunk) {
      hash.update(chunk);
    });

    input.on("close", function () {
      resolve(hash.digest("hex"));
    });
  });
}

/**
 * @param {publicPath} publicPath - Resulting path to be used
 * @param {localPath} localPath - Path to where the file for checksum resides
 * @example
 *
 * hash("/js/main.js", "static/js/main.js");
 *
 */
async function hash(publicPath, localPath) {
  const checkSum = await getChecksum(localPath);

  return `${publicPath}?h=${checkSum}`;
}

const cache = {
  data: {
    pages: ["/", "/work/", "/journal/"],
    files: [
      "/favicon.ico",
      "manifest.json",
      await hash("/js/main.mjs", "./static/js/main.mjs"),
      await hash("/css/main.css", "./public/css/main.css"),
      "/fonts/CircularStd-Book.woff2",
      "/fonts/CircularStd-Bold.woff2",
      "/fonts/Larsseit-Bold.woff2",
      "/fonts/FiraCode-Regular.woff2",
      "/img/footer__icons.svg",
      "/img/icons-36.png",
      "/img/icons-48.png",
      "/img/icons-60.png",
      "/img/icons-72.png",
      "/img/icons-76.png",
      "/img/icons-96.png",
      "/img/icons-120.png",
      "/img/icons-152.png",
      "/img/icons-180.png",
      "/img/icons-192.png",
      "/img/icons-512.png",
    ],
  },
};

fs.writeFileSync("public/serviceworker-cache.json", JSON.stringify(cache));
