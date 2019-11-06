+++
title = "Buurkracht"
date = 2018-08-25T16:53:51.000Z
description = "A prototype for an energy initiative that brings neighborhoods together in order to promote renewable energy."
draft = false
+++

{{% article-intro title="Buurkracht" %}}

Buurkracht is an energy initiative that brings neighborhoods together in order
to save energy. I made a low-fidelity prototype that was supposed to encourage
children to learn more about renewables and how they can save energy.

The prototype did great, which sparked my interest and encouraged me to learn
about what turning it into a high-fidelity prototype would entail.

{{% /article-intro %}}

---

<div class="avatar">
<div class="avatar__video">
{{< video
    type="local"
    mute="true"
    loop="true"
    poster="img/poster-avatar.png"
    webm="vid/avatar.webm"
    mp4="vid/avatar.mp4"
>}}
</div>
<div class="avatar__text">
{{% md %}}

### Personalization
One of the features I first implemented was the option to personalize your character. I ended up making use of <abbr title="Scalable Vector Graphics">SVG</abbr>. This made it easy to dynamically add colors, mix objects, animate and allow the player to create a truly unique character. 

{{% /md %}}
</div>
</div>

The preloader I ended making and using was designed by Iconathon and even got a shout from Codepen.

<div class="preloader__video">
{{< video
    type="local"
    mute="true"
    loop="true"
    poster="img/poster-preloader.png"
    webm="vid/preloader.webm"
    mp4="vid/preloader.mp4"
>}}
</div>

<div class="settings">
<div class="settings__text">
{{% md %}}
### Handling state
While React made the application easy to reason about due to its componentization, Redux helped interface and game state flow throughout the application with ease. With the help of React Intl, internationalization became a breeze and could be changed at runtime.
{{% /md %}}
</div>
<div class="settings__video">
{{< video
    type="local"
    mute="true"
    loop="true"
    poster="img/poster-settings.png"
    webm="vid/settings.webm"
    mp4="vid/settings.mp4"
>}}
</div>
</div>

<div class="result">
{{< video
    type="local"
    mute="true"
    loop="true"
    poster="img/poster-result.jpg"
    webm="vid/result.webm"
    mp4="vid/result.mp4"
>}}
</div>

### Terrain deformation
One of the key features I had demonstrated in my low-fidelity prototype was the ability to deform the terrain and making it your own. 

Most of this work involved working with <abbr title="Graphics Shader Library Language">GLSL</abbr> and writing my own shaders.

The terrain could theoretically influence the environment and thus the energy sources one should opt for, offering a more diverse playthrough.

---

In the end, I learned a lot about React, Webpack, <abbr title="Web Graphics Library">WebGL</abbr>, Canvas, Node and many other technologies while building this application. I will most likely apply them to future projects.

For those interested, the repository can be found <a
href="https://github.com/imjasonmiller/webgl_prototype" target="_blank"
rel="noopener">here</a>. 

