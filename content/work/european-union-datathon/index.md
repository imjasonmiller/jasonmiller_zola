---
title: "European Union Datathon"
date: 2018-08-25T18:53:51+02:00
draft: false
---

## European Union Datathon

It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.

{{% grid size="sm-left" %}}

{{< image border="right" src="https://orig00.deviantart.net/6323/f/2017/190/e/2/20170707_rover_2560_001_by_macrebisz-dbfocxw.jpg" >}}

{{% /grid %}}

{{% grid size="sm-right" %}}

The hallway smelt of boiled cabbage and old rag mats. At one end of it a coloured poster, too large for indoor display, had been tacked to the wall. It depicted simply an enormous face, more than a metre wide: the face of a man of about forty-five, with a heavy **black moustache** and ruggedly handsome features.

{{% /grid %}}

> The hallway smelt of boiled cabbage and old rag mats.  
> — Winston

The hallway smelt of boiled cabbage and old rag mats. At one end of it a coloured poster, too large for indoor display, had been tacked to the wall. It depicted simply an enormous face, more than a metre wide: the face of a man of about forty-five, with a heavy black moustache and ruggedly handsome features. Winston made for the stairs. It was no use trying the lift. Even at the best of times it was seldom working, and at present the electric current was cut off during daylight hours.

{{< grid size="md" >}}

{{< video vimeo="260314795" border="right" >}}

{{< /grid >}}

{{% grid size="sm-left" %}}

It was part of the economy drive in preparation for Hate Week. The flat was seven flights up, and Winston, who was thirty-nine and had a varicose ulcer above his right ankle, went slowly, resting several times on the way.

{{% /grid %}}

{{< grid size="sm-right" >}}

{{< video vimeo="260312436" border="left" >}}

{{< /grid >}}

On each landing, opposite the lift-shaft, the poster with the enormous face gazed from the wall. It was one of those pictures which are so contrived that the eyes follow you about when you move. BIG BROTHER IS WATCHING YOU, the `caption` beneath it ran.

{{% grid size="md" %}}

```js
const handleFeatureIntersect = ({ index, state }, entry) => {
  const currentRatio = entry.intersectionRatio

  captions[index].style.transform = `translateY(${50 * (1 - currentRatio)}%)`
  captions[index].style.opacity = currentRatio

  if (state !== "enter" || currentRatio < 0.5) return

  swipes[index].style.transform = "scaleX(0)"

  for (let i = 0; i < borders[index].children.length; i++) {
    borders[index].children[i].classList.remove(
      "media-border__line--top-animate",
      "media-border__line--right-animate",
      "media-border__line--bottom-animate",
      "media-border__line--left-animate",
    )
  }
}
```

{{% /grid %}}

Outside, even through the shut window-pane, the world looked cold. Down in the street little eddies of wind were whirling dust and torn paper into spirals, and though the sun was shining and the sky a harsh blue, there seemed to be no colour in anything, except the posters that were plastered everywhere. The blackmoustachio'd face gazed down from every commanding corner. There was one on the house-front immediately opposite. BIG BROTHER IS WATCHING YOU, the caption said, while the dark eyes looked deep into Winston's own. Down at streetlevel another poster, torn at one corner, flapped fitfully in the wind, alternately covering and uncovering the single word INGSOC. In the far distance a helicopter skimmed down between the roofs, hovered for an instant like a bluebottle, and darted away again with a curving flight. It was the police patrol, snooping into people's windows. The patrols did not matter, however. Only the Thought Police mattered.
