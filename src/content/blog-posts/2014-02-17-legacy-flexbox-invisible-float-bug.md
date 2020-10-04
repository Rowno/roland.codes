---
title: Legacy flexbox invisible float bug
commentsIssueId: 21
---

Webkit's implementation of legacy Flexbox has an strange bug that makes flex items become invisible when they're floated. What makes it strange is that the flex items will still take up space in the DOM, as if they have `visibility: hidden` applied.

Usually you wouldn't use float on flex items (the spec even says that float has no effect on them). But it's useful for providing a fallback layout when Flexbox isn't supported.

Luckily I chanced on a hack that fixes the bug. All you have to do is give the floated flex items a position, like `position: relative`, and they'll (strangely) become visible again. Another option is to use Modernizr to only apply the float when Flexbox isn't supported.

This bug affects legacy Flexbox in all Webkit browsers. Which includes Chrome 20-, Safari 6-, iOS 6.1- and Android 4.3-.

<p class="codepen" data-id="rhlfd" data-height="380">
  See the demo: <a href="/demos/legacy-flexbox-invisible-float-bug/">Legacy flexbox invisible float bug fix</a>
</p>
