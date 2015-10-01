---
layout: blog-post.html
title: IE flex collapse bug
commentsIssueId: 20
---

While using Flexbox in production for the first time I discovered a bug that causes flex items to collapse to nothing in IE 10-11. The bug happens when using the `flex` shorthand property on flex items inside a vertical Flexbox layout.

Turns out this was a red herring. The actual bug is that IE 10-11 treats `flex-basis` as an absolute `height` when all flex items are flexible. And since the default value for `flex-basis` is `0px` when using `flex`, the elements end up being `0px` high.

The solution is to explicitly set the `flex-basis` to `auto` (e.g `flex: 1 1 auto`) or use the separate properties (e.g: `flex-grow: 1`). If you need to use a `flex-basis` in this kind of layout, you should be able to use `min-height` or `max-height` to achieve the same result.

Note: Autoprefixer inserts the `-ms-flex` shorthand property even if you use the separate properties. So in this case you'll need to set the `flex-basis` explicitly.

<p class="codepen" data-id="Abtqg" data-height="300">
    See the demo:
    <a href="/demos/ie-flex-collapse-bug/">
        IE flex collapse bug fix
    </a>.
</p>
