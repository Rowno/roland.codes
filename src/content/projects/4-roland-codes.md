---
title: roland.codes
socialImage: /assets/content/projects/roland.codes/social.png
twitterCard: summary_large_image
logos: [html, css, js, node]
links:
  - name: GitHub
    url: https://github.com/Rowno/roland.codes
  - name: Website
    url: https://roland.codes/
description: >
  Personal site & blog. Everything from the global color shifting effect to the beautiful ultra-optimized code under the hood.
---

This website is designed and built to push the envelope in a number of ways.

The signature [shifting color effect][theme] is created with series of classes tied to a single global class which rotates. The [moving background shapes][background] are simply two large squares, rotating in opposite directions at an offset from one another.

The demanding visual effects meant CPU usage had to be seriously optimized. I did this using a single global class to set the color which minimises DOM manipulation and using CSS transforms for any movements to allow the GPU to handle them smoothly.

The website is hosted on the [Netlify][] CDN as a static website to get fast loading times anywhere in the world.

Global load times are near-instantaneous, thanks to some extra planning and effort behind the scenes. For example, Google Fonts was originally used to host the web fonts, however I found that by hosting the fonts from my own server, page load times fell by ~20%. Doing so optimised the critical rendering path by removing a render blocking request to a third party server, resulting in all assets being served via a single HTTP/2 connection.

Under the hood, it was built using [Next.js][] with some custom code to transform directories Markdown files into separate pages.

I’m always improving the site and [suggestions are welcome][suggestions]. ;)

The site was beautifully designed by [Arlen McCluskey][arlen].

[theme]: https://github.com/Rowno/roland.codes/blob/master/app/assets/css/components/_theme.scss
[background]: https://codepen.io/Rowno/pen/EVEgJb
[netlify]: https://www.netlify.com/
[next.js]: https://github.com/vercel/next.js
[suggestions]: https://github.com/Rowno/roland.codes/issues
[arlen]: https://www.arlenmccluskey.com/
