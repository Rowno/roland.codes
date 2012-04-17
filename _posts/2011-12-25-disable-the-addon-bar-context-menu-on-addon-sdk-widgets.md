---
layout: post
title: Disable the Addon Bar context menu on Addon SDK widgets
tags: [addon sdk]
---

<ins datetime="2012-04-15T00:00:00+12:00">**UPDATE:** This bug was fixed in [Addon SDK 1.6](https://wiki.mozilla.org/Labs/Jetpack/Release_Notes/1.6), so this workaround isn't needed anymore.</ins>

If you've tried adding right click support to a widget when using Mozilla's [Addon SDK](https://addons.mozilla.org/en-US/developers/builder), you've probably noticed that the Addon Bar context menu appears when you right click on your widget. This is quite annoying, but thankfully the workaround is as simple as preventing the default action of the `contextmenu` event.

Just add the following code to your widget's content script to prevent a context menu from showing when right clicking on your widget:

{% highlight javascript %}
this.addEventListener('contextmenu', function (event) {
    event.preventDefault();
}, false);
{% endhighlight %}
