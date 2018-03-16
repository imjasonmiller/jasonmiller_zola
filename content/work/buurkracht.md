---
title: "Buurkracht"
date: 2017-12-12T17:25:32+01:00
draft: false
slug: "buurkracht"
categories: 
    - "work"
intro: |
    Buurkracht is an energy initiative that brings neighborhoods together in order to save energy. I ended up making a low-fidelity prototype that was supposed to encourage children to learn more about saving energy. The prototype did great, but the teacher did mention it might be too _complex and costly_ to make. This sparked my interest and encouraged me to learn about what turning it into a high-fidelity prototype would entail.
    
    I ended up learning a lot about Webpack, React, WebGL, Canvas, Node and many, many other things. In the end, time, being part of the cost, did prove to be a limiting factor, but I gained a lot of knowledge I did not posses beforehand. 
image: thumb-lg.png
tags:
    - buurkracht
    - webgl
    - prototype
    - 3D
---

### Terrain Editor

One of the key features I had demonstrated in my low-fidelity prototype was the ability to deform the terrain and make it your own. These features could theoretically influence which energy sources one should opt for and offer a more diverse playthrough.

The land, water, sky, stars, sun and moon allowed me to learn quite a bit about [shaders](https://en.wikipedia.org/wiki/Shader) and [topology](https://stackoverflow.com/questions/47917067/webgl-triangle-layout-for-deformation).

{{< video vimeo="260314795" width="1280" height="720" autoplay="0" loop="1" >}}

### Settings and internationalization

React made most of the application very easy to reason about due to its componentization and updates based on underlying data changes. Internationalization also became an effortless task with the use of `react-intl`. By updating a single `locale` property, all components that depended on that property would reflect their new `locale`.

{{< video vimeo="260312436" width="1280" height="720" autoplay="0" loop="1" >}}
    
### Avatar Editor

The avatar editor makes heavy use of scalable vector graphics. They, unlike rasterized images, are crisp on any given resolution. It allows you to create many geometric shapes with ease, as Adobe Illustrator offers an export path. The files can also easily be inspected and modified by a text editor. This made it quite easy to dynamically add colors and mix objects as can be seen below:

{{< video vimeo="259896500" width="1280" height="720" autoplay="0" loop="1" >}}

### Result

{{< video vimeo="260311059" width="1280" height="720" autoplay="0" loop="1" >}}

If you have any questions, please don't hesitate to contact me. The Github repository can be found [here](https://github.com/imjasonmiller/webgl_prototype).