---
layout: post.html
title: Controlling line breaks
tags: [css]
commentsIssueId: 14
---

If you've ever used `<br>`'s to force blocks of text to wrap 'perfectly', you'll probably know that this screws up in fluid layouts:

<div style="width:22em; text-align:center;" class="well">Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br> Duis augue metus, pellentesque sed molestie non, porta eget odio.</div>

So the other day I was wondering:
 > If you apply `display: none` to a `<br>`, does it remove the line break?

Yeah it does!
<div style="width:22em; text-align:center;" class="well">Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br style="display:none"> Duis augue metus, pellentesque sed molestie non, porta eget odio.</div>

Combining this with Media Queries, it's possible to remove all the `<br>`'s before the text starts to wrap. Best of both worlds! :)
