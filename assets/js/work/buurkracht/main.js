import IntersectionObserver from "intersection-observer"
import ScrollIO from "@imjasonmiller/scroll-io"

// Random int, includes max.
const randInt = (min, max) => {
  return Math.round(Math.random() * (max - min) + min)
}

// Map of all displayed elements
const display = {
  avatar: false,
  result: false,
  settings: false,
}

// Cache selectors
const elemAvatar = document.querySelector(".ava-edit__wrap")
const itemList = document.querySelectorAll(".ava-edit__item > svg")
const wearList = document.querySelectorAll(".ava-edit__wear > svg")

const handleAvatarIntersect = ({ state }) => {
  if (!display.avatar && state === "enter") {
    elemAvatar.classList.add("visible")
    display.avatar = true

    setInterval(() => {
      const list = [itemList, wearList][randInt(0, 1)]
      const randIndex = randInt(0, list.length - 1)

      list.forEach((option, index) => {
        if (index === randIndex) {
          option.classList.add("visible")
        } else {
          option.classList.remove("visible")
        }
      })
    }, 2500)
  }
}

const avatarScroll = new ScrollIO({
  elements: document.querySelector(".ava-edit"),
  threshold: { min: 0.5 },
  onIntersect: handleAvatarIntersect,
})

// Cache selector
const elemResult = document.querySelector(".result__full")

const handleResultIntersect = ({ state, scroll }) => {
  if (!display.result && state === "enter") {
    elemResult.classList.add("visible")
    display.result = true
  }
}

const resultScroll = new ScrollIO({
  elements: document.querySelector(".result"),
  threshold: { min: 0.5 },
  onIntersect: handleResultIntersect,
})

// Cache selector
const elemSettingsImg = document.querySelector(".settings__img")

const handleSettingsIntersect = ({ state, scroll }) => {
  if (!display.settings && state === "enter") {
    elemSettingsImg.classList.add("visible")
    display.settings = true
  }
}

const settingsScroll = new ScrollIO({
  elements: document.querySelector(".settings"),
  threshold: { min: 0.5 },
  onIntersect: handleSettingsIntersect,
})
