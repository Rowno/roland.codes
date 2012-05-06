---
layout: post
title: Disable the Addon Bar context menu on Addon SDK widgets
tags: [addon sdk]
commentsIssueId: 4
---

<p>
<ins datetime="2012-04-15T00:00:00+12:00">
<strong>UPDATE:</strong> This bug was fixed in <a href="https://wiki.mozilla.org/Labs/Jetpack/Release_Notes/1.6">Addon SDK 1.6</a>, so this workaround isn't needed anymore.
</ins>
</p>

If you've tried adding right click support to a widget when using Mozilla's [Addon SDK][], you've probably noticed that the Addon Bar context menu appears when you right click on your widget. This is quite annoying, but thankfully the workaround is as simple as preventing the default action of the `contextmenu` event.

Just add the following code to your widget's content script to prevent a context menu from showing when right clicking on your widget:

{% highlight javascript %}
this.addEventListener('contextmenu', function (event) {
    event.preventDefault();
}, false);
{% endhighlight %}

[Addon SDK]: https://addons.mozilla.org/en-US/developers/builder
