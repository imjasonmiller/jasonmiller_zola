import Logo from "./Logo";
import { Player } from "./Video";
/* eslint-disable */
// @ts-ignore
import IntersectionObserver from "intersection-observer";
/* eslint-enable */
import { ScrollIO, Handler } from "@imjasonmiller/scroll-io";

function registerServiceWorker(): void {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/serviceworker.js")
        .then(() => console.info("[sw] registered"))
        .catch((err) => console.error(`[sw] error: ${err}`));
    });
  }
}

function initVideos(): void {
  for (const video of document.querySelectorAll(".player")) {
    new Player(video);
  }
}

function initLogo(): void {
  const logo = new Logo(
    document.querySelector("#logo__canvas") as HTMLCanvasElement,
  );

  let hasLeft = false;

  const handleIntersect: Handler = ({ enterUp, leaveDown }): void => {
    if (leaveDown) {
      logo.animate();
      hasLeft = true;
    } else if (enterUp && hasLeft) {
      logo.animate(true);
    }
  };

  new ScrollIO(".logo__link", handleIntersect, {
    range: { min: 0.75, steps: 0 },
  });
}

const tableOfContents = (): void => {
  const toc = [...document.querySelectorAll("#TableOfContents li a")];

  if (!toc.length) return;

  const headings = document.querySelectorAll("h3");

  const handleIntersect: Handler = ({ enterUp, leaveUp }): void => {
    toc.forEach((item) => item.classList.remove("toc__link--active"));

    const topHeading = [...headings].reduce((a, b) => {
      // Calculate the real distance to the top of the viewport by adding
      // the element's height, depending on which way we scroll
      const f = enterUp || leaveUp ? 1 : -1;
      const topA = a.getBoundingClientRect().top + a.offsetHeight * f;
      const topB = b.getBoundingClientRect().top + b.offsetHeight * f;

      if (topA < topB && topA > 0) {
        return a;
      }

      return b;
    });

    toc[[...headings].indexOf(topHeading)].classList.add("toc__link--active");
  };

  new ScrollIO(headings, handleIntersect, { range: { steps: 0 } });
};

const features = (): void => {
  const swipes = document.querySelectorAll(
    ".feature .feature__swipe",
  ) as NodeListOf<HTMLElement>;
  const images = document.querySelectorAll(
    ".feature .feature__image img",
  ) as NodeListOf<HTMLElement>;
  const borders = document.querySelectorAll(
    ".feature .media-border",
  ) as NodeListOf<HTMLElement>;
  const captions = document.querySelectorAll(
    ".feature .feature__caption",
  ) as NodeListOf<HTMLElement>;

  const handleIntersect: Handler = (
    { index, leaveUp, enterDown, leaveDown },
    entry,
  ): void => {
    const ratio = entry.intersectionRatio;

    if (enterDown || leaveUp) {
      captions[index].style.transform = `translateY(${50 * (1 - ratio)}%)`;
      captions[index].style.opacity = ratio.toString();
    }

    if (leaveDown || leaveUp || ratio < 0.5) return;

    images[index].style.transform = "scale(1)";
    swipes[index].style.transform = "scaleX(0)";

    Array.from(borders[index].children).forEach((border) => {
      border.classList.remove("media-border__line--hidden");
    });
  };

  new ScrollIO(".feature", handleIntersect, { range: { steps: 50 } });
};

// registerServiceWorker();
features();
tableOfContents();
initVideos();
initLogo();
