import { ScrollIO, Handler } from "@imjasonmiller/scroll-io";

import { ThemeEvent, MobileEvent } from "./Events";

import {
  ARTICLE_SAVE,
  ARTICLE_SAVE_FAILED,
  ARTICLE_SAVE_SUCCESS,
} from "./Actions";

function Theme() {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
  const checkbox = document.querySelector(
    "#theme-checkbox",
  ) as HTMLInputElement;

  function getInitialState() {
    // The default theme
    let theme = "light";

    // Derive initial state from the user possibly having a system preference.
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      theme = "light";
    }

    // Override derived state if the user manually selected a preferred theme.
    //
    // NOTE: The script responsible for setting the `data-theme` attribute on
    // the <html> element is inside the page's <head>.
    if (document.documentElement?.dataset?.theme) {
      theme = document.documentElement.dataset.theme;
    }

    // Set checkbox state to match theme.
    checkbox.checked = theme === "light";
  }

  function handleCheckbox() {
    const state = checkbox.checked ? "light" : "dark";

    // Add `data-theme` with `light` or `dark` value to <html> tag.
    document.documentElement.setAttribute("data-theme", state);
    // Persist selected theme using the localStorage API.
    localStorage.setItem("theme", state);
    // Notify listeners of theme changes.
    window.dispatchEvent(new ThemeEvent(state));
  }

  function handleMediaQuery(event: MediaQueryListEvent) {
    // Return early if the user has explicitly set a theme.
    if (document.documentElement?.dataset?.theme) return;

    const state = event.matches ? "light" : "dark";
    // Set checkbox state to match theme.
    checkbox.checked = state === "light";
    // Notify listeners of theme change.
    window.dispatchEvent(new ThemeEvent(state));
  }

  getInitialState();

  // Update state if the user locally changes theme via checkbox.
  try {
    mediaQuery.addEventListener("change", handleMediaQuery);
  } catch {
    try {
      // @ts-ignore: iOS Safari < 14 support
      // See: https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/addListener
      mediaQuery.addListener("change", handleMediaQuery);
    } catch (err) {
      console.error(
        "could not attach event listener to theme media query",
        err,
      );
    }
  }

  checkbox.addEventListener("change", handleCheckbox);
}

function Featured() {
  const captions = document.querySelectorAll(
    ".feature .feature__caption",
  ) as NodeListOf<HTMLElement>;
  const borders = document.querySelectorAll(
    ".feature .media-border",
  ) as NodeListOf<HTMLElement>;
  const images = document.querySelectorAll(
    ".feature .feature__image picture",
  ) as NodeListOf<HTMLElement>;
  const masks = document.querySelectorAll(
    ".feature .feature__swipe",
  ) as NodeListOf<HTMLElement>;
  let isMobile = false;

  const handleIntersection: Handler = (
    { index, enterDown, enterUp },
    { isIntersecting, intersectionRatio: ratio },
  ) => {
    // Use a smaller offset on mobile to prevent the caption overlapping with the thumbnail.
    const offset = isMobile ? 25 : 50;

    // Caption animations that are tied to scrolling position.
    if (isIntersecting) {
      captions[index].style.transform = `translateY(${offset * (1 - ratio)}%)`;
      captions[index].style.opacity = ratio.toString();
    }

    // Start featured image animations once one of the following conditions are
    // met:
    // - Enter the viewport while scrolling down
    // - Enter the viewport while scrolling up
    // - More than half is visible
    if (enterDown || enterUp || ratio > 0.5) {
      // Animated zoom out of image.
      images[index].style.transform = "scale(1)";
      // Remove mask that hides image.
      masks[index].style.transform = "scaleX(0)";

      // Animate the borders around the image.
      Array.from(borders[index].children).forEach((border) => {
        border.classList.remove("media-border__line--hidden");
      });
    }
  };

  function handleMobile(event: any): void {
    isMobile = event.isMobile;
  }

  new ScrollIO(".feature", handleIntersection, { range: { steps: 50 } });

  window.addEventListener("ismobile", handleMobile);
}

function DeviceDetector() {
  const mobileQuery = window.matchMedia("(max-width: 480px)");

  try {
    mobileQuery.addEventListener("change", (event: MediaQueryListEvent) =>
      window.dispatchEvent(new MobileEvent(event.matches)),
    );
  } catch {
    try {
      // @ts-ignore: iOS Safari < 14 support
      // See: https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/addListener
      mobileQuery.addListener("change", (event: MediaQueryListEvent) =>
        window.dispatchEvent(new MobileEvent(event.matches)),
      );
    } catch (err) {
      console.error(
        "could not attach event listener to mobile media query",
        err,
      );
    }
  }

  // Dispatch initial state to listening components
  window.dispatchEvent(new MobileEvent(mobileQuery.matches));
}

async function Videos() {
  try {
    await import(/* webpackPreload: true */ "./VideoPlayer").then(
      (VideoPlayer) => {
        for (const video of document.querySelectorAll(".player")) {
          new VideoPlayer.default(video);
        }
      },
    );
  } catch (err) {
    console.error(`could not instantiate VideoPlayer: ${err}`);
  }
}

interface Message {
  command: string;
  [key: string]: any;
}

// Wrap messageing in a Promise using the MessageChannel API.
// See: https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel
function sendMessage(message: Message) {
  return new Promise(function (resolve, reject) {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = function (event: MessageEvent) {
      if (event.data.error) {
        reject(event.data.error);
      }

      resolve(event.data);
    };

    navigator.serviceWorker.controller?.postMessage(message, [
      messageChannel.port2,
    ]);
  });
}

/**
 * @param {duration} Duration - Delay duration in milliseconds.
 * @example
 *
 * await delay(350).then(() => console.log("Done!"));
 *
 */
const delay = (duration: number): Promise<void> =>
  new Promise((resolve, _) => setTimeout(resolve, duration));

async function SaveArticle(): Promise<void> {
  // Return early if we're not on a `/journal/` page.
  if (!/^\/journal\/[a-zA-Z0-9-._~]+/.test(window.location.pathname)) {
    return;
  }

  const button = document.querySelector(
    ".btn--save-article",
  ) as HTMLInputElement;

  if (button?.disabled) return;

  button?.addEventListener(
    "click",
    function (event: Event) {
      const elem = event.currentTarget as HTMLInputElement;

      elem.classList.add("btn--saving-article");

      // Update button text state
      if (elem.lastChild) {
        elem.lastChild.textContent = "Saving article";
      }

      const start = performance.now();
      const minimumAnimationTime = 3000;

      if (navigator?.serviceWorker?.controller) {
        sendMessage({
          command: ARTICLE_SAVE,
          path: window.location.pathname,
        }).then(async (message) => {
          switch (message) {
            case ARTICLE_SAVE_SUCCESS:
              // We want the animation to
              await delay(minimumAnimationTime - (start - performance.now()));

              if (elem.lastChild) {
                // Update button text state
                elem.lastChild.textContent =
                  "Article saved for offline reading";
                elem.disabled = true;
              }
              elem.classList.remove("btn--saving-article");
              break;
            case ARTICLE_SAVE_FAILED:
              break;
            default:
              console.error(`Unknown message type ${message}`);
          }
        });
      }
    },
    { once: true },
  );
}

async function TableOfContents(): Promise<void> {
  // Return early if we're not on a `/journal/` page.
  if (!/^\/journal\/[a-zA-Z0-9-._~]+/.test(window.location.pathname)) {
    return;
  }

  await import(/* webpackPreload: true */ "./TableOfContents").then(
    (module) => {
      module.default();
    },
  );
}

async function Logo(): Promise<void> {
  const container = document.querySelector(".logo__link") as HTMLElement;

  try {
    const logo = await import(/* webpackPreload: true */ "./AnimatedLogo").then(
      (AnimatedLogo) => new AnimatedLogo.default(container),
    );

    const handleIntersect: Handler = ({ enterUp, leaveDown }): void => {
      if (leaveDown) {
        logo.animateIn();
      } else if (enterUp) {
        logo.animateOut();
      }
    };

    new ScrollIO(".logo__link", handleIntersect, {
      range: { min: 0.75, steps: 0 },
    });
  } catch (err) {
    console.error(`could not instantiate AnimatedLogo: ${err}`);
  }
}

function ServiceWorker(): void {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/serviceworker.js")
        .then(() => console.info("[SW] Registered"))
        .catch((err) => console.error(`[SW] Error: ${err}`));
    });
  }
}

Theme();
Featured();
DeviceDetector();
Logo();
TableOfContents();
Videos();
ServiceWorker();
SaveArticle();
