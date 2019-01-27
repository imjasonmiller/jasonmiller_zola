import * as THREE from "three"
import { MeshLine, MeshLineMaterial } from "three.meshline"
import LogoAnimation from "./Logo"
import ShapeParticles from "./ShapeParticles"
import IntersectionObserver from "intersection-observer"
import ScrollIO from "@imjasonmiller/scroll-io"

// const particleContainer = document.querySelector(".particles")
// if (particleContainer !== null && matchMedia("(min-width: 960px)").matches) {
//   new ShapeParticles({
//     container: particleContainer,
//     amount: 20,
//     speedMin: 0.05,
//     speedMax: 0.1,
//     rotationMin: -0.01,
//     rotationMax: 0.015,
//   })
// }

const serviceWorker = () => {
  // Check for Service Worker support
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("../serviceworker.js")
        .then(reg => console.log("Service worker: Registered"))
        .catch(err => console.log(`Service Worker: Error: ${err}`))
    })
  }
}

const greeting = () => {
  const elem = document.querySelector(".intro__time")

  if (elem !== null) {
    const hour = new Date().getHours()
    elem.textContent =
      (hour < 12 && "morning") || (hour < 18 && "afternoon") || "evening"
  }
}

const logo = () => {
  const elem = document.querySelector(".logo__link")
  const logo = new LogoAnimation(elem)

  let hasLeft = false

  const handleIntersect = ({ scroll, state }) => {
    const scrollUpEnter = scroll === "up" && state === "enter"
    const scrollDownLeave = scroll === "down" && state === "leave"

    if (scrollDownLeave) {
      logo.anim(false)
      hasLeft = true
    } else if (scrollUpEnter && hasLeft) {
      logo.anim(true)
    }
  }

  const logoIO = new ScrollIO({
    elements: elem,
    threshold: { min: 0.75, steps: 0 },
    onIntersect: handleIntersect,
  })
}

const features = () => {
  const swipes = document.querySelectorAll(".feature .feature__swipe")
  const images = document.querySelectorAll(".feature .feature__image img")
  const borders = document.querySelectorAll(".feature .media-border")
  const captions = document.querySelectorAll(".feature .feature__caption")

  const handleIntersect = ({ index, state, scroll }, entry) => {
    const ratio = entry.intersectionRatio

    if (
      (state === "enter" && scroll === "down") ||
      (state === "leave" && scroll === "up")
    ) {
      captions[index].style.transform = `translateY(${50 * (1 - ratio)}%)`
      captions[index].style.opacity = ratio
    }

    if (state !== "enter" || ratio < 0.5) return

    images[index].style.transform = "scale(1)"
    swipes[index].style.transform = "scaleX(0)"

    for (let i = 0; i < borders[index].children.length; i++) {
      borders[index].children[i].classList.remove("media-border__line--hidden")
    }
  }

  const featureIO = new ScrollIO({
    elements: ".feature",
    threshold: { steps: 50 },
    onIntersect: handleIntersect,
  })
}

const main = () => {
  serviceWorker()
  greeting()
  logo()
  features()
}

main()
