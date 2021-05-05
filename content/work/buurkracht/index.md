+++
title = "Buurkracht"
date = 2018-08-25T16:53:51.000Z
description = "A prototype for an energy initiative that brings neighborhoods together in order to promote renewable energy."
template = "work_page.html"

[extra]
thumb_alt = "Buurkracht application with the avatar configuration modal open and the game visible in the background."
styles = [
  "main"
]
+++

---

<div class="avatar">

<div class="avatar__video">

{{ video(
  type = "local",
  mute = true,
  loop = true,
  poster = "poster-avatar.png",
  vp9 = "video-avatar.vp9.webm",
  hevc = "video-avatar.hevc.mp4",
  h264 = "video-avatar.h264.mp4"
) }}

</div>

<div class="avatar__text">

### Personalization
One of the features I first implemented was the option to personalize your character. I ended up making use of <abbr title="Scalable Vector Graphics">SVG</abbr>. This made it easy to dynamically add colors, mix objects, animate and allow the player to create a truly unique character. 

</div>

</div>

The preloader I ended making and using was designed by Iconathon and even got a shout from Codepen.

<div class="preloader__video">

{{ video(
  type = "local",
  mute = true,
  loop = true,
  poster = "poster-preloader.png",
  vp9 = "video-preloader.vp9.webm",
  mp4 = "video-preloader.h264.mp4"
) }}

</div>

<div class="settings">

<div class="settings__text">

### Handling state
While React made the application easy to reason about due to its componentization, Redux helped interface and game state flow throughout the application with ease. With the help of React Intl, internationalization became a breeze and could be changed at runtime.

</div>

<div class="settings__video">

{{ video(
  type = "local",
  mute = true,
  loop = true,
  poster = "poster-settings.png",
  vp9 = "video-settings.vp9.webm",
  hevc = "video-settings.hevc.mp4",
  h264 = "video-settings.h264.mp4"
) }}

</div>

</div>

<div class="result">

{{ video(
  type = "local",
  mute = true,
  loop = true,
  poster = "poster-result.png",
  vp9 = "video-result.vp9.webm",
  hevc = "video-result.hevc.mp4",
  h264 = "video-result.h264.mp4"
) }}

</div>

### Terrain deformation
One of the key features I had demonstrated in my low-fidelity prototype was the ability to deform the terrain and making it your own. 

Most of this work involved working with <abbr title="Graphics Shader Library Language">GLSL</abbr> and writing my own shaders.

The terrain could theoretically influence the environment and thus the energy sources one should opt for, offering a more diverse playthrough.


---

In the end, I learned a lot about React, Webpack, <abbr title="Web Graphics Library">WebGL</abbr>, Canvas, Node and many other technologies while building this application. I will most likely apply them to future projects.

For those interested, the repository can be found [here](https://github.com/imjasonmiller/webgl_prototype).
