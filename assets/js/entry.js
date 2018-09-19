import * as THREE from "three"
import { MeshLine, MeshLineMaterial } from "three.meshline"
import LogoAnimation from "./Logo"
import ShapeParticles from "./ShapeParticles"
import IntersectionObserver from "intersection-observer"
import ScrollIO from "@imjasonmiller/scroll-io"

// Check for Service Worker support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../serviceworker.js")
      .then(reg => console.log("Service worker: Registered"))
      .catch(err => console.log(`Service Worker: Error: ${err}`))
  })

  console.log(`[caches]: ${caches}`)
}

const greeting = document.querySelector(".intro__greeting__time")

const hourToGreeting = () => {
  const hour = new Date().getHours()

  if (hour < 12) return "morning"
  if (hour < 18) return "afternoon"

  return "evening"
}

if (greeting !== null) {
  greeting.textContent = hourToGreeting()
}

const container = document.querySelector(".logo__link")
const logoAnimation = new LogoAnimation(container)

const particleContainer = document.querySelector(".particles")
if (particleContainer !== null && matchMedia("(min-width: 960px)").matches) {
  new ShapeParticles({
    container: particleContainer,
    amount: 20,
    speedMin: 0.05,
    speedMax: 0.1,
    rotationMin: -0.01,
    rotationMax: 0.015,
  })
}

let hasLeft = false

const handleLogoIntersect = ({ scroll, state }) => {
  if (scroll === "down" && state === "leave") {
    logoAnimation.start(false)
    hasLeft = true
  } else if (scroll === "up" && state === "enter" && hasLeft) {
    logoAnimation.start(true)
  }
}

const logoIntersect = new ScrollIO({
  elements: container,
  threshold: { min: 0.75 },
  onIntersect: handleLogoIntersect,
})

const swipes = document.querySelectorAll(".feature .feature__swipe")
const images = document.querySelectorAll(".feature .feature__image img")
const borders = document.querySelectorAll(".feature .media-border")
const captions = document.querySelectorAll(".feature .feature__caption")

const handleFeatureIntersect = ({ index, state, scroll }, entry) => {
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

const featureIntersect = new ScrollIO({
  elements: ".feature",
  threshold: { steps: 50 },
  onIntersect: handleFeatureIntersect,
})
