---
layout: post
title: Conditions for text-overflow to be applied
tags: [css3, text-overflow]
commentsIssueId: 7
---

I've been experimenting with the CSS3 text-overflow property a bit lately, and I've discovered that trying to figure out the conditions in which it's applied can be a bit frustrating, since they're not very well documented. In this post I'll outline the conditions that are required for text-overflow to be applied to text.

Basically, the element that has text-overflow applied to it must also have it's overflow set to hidden. Then any text that overflows **_horizontally_** (ie: out the left or right of the element) will have text-overflow applied to it. But there's only 2 situations in which text will overflow horizontally, due to the fact that it wraps automatically.


The first is when the text is prevented from wrapping by using the white-space property:

**Code example:**

{% highlight html %}
<div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis augue metus, pellentesque sed molestie non, porta eget odio. Pellentesque vitae neque euismod purus dignissim aliquet. Nullam sit amet elit neque, et auctor nisi. Quisque suscipit elit eu nulla interdum tempus ac at nisl. Vivamus feugiat vestibulum sollicitudin. Aliquam erat volutpat.
</div>
{% endhighlight %}

**Live example:**

<div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" class="well">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis augue metus, pellentesque sed molestie non, porta eget odio. Pellentesque vitae neque euismod purus dignissim aliquet. Nullam sit amet elit neque, et auctor nisi. Quisque suscipit elit eu nulla interdum tempus ac at nisl. Vivamus feugiat vestibulum sollicitudin. Aliquam erat volutpat.
</div>


The second is when the text contains a *very* long word that can't wrap automatically:

**Code example:**

{% highlight html %}
<div style="overflow: hidden; text-overflow: ellipsis;">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis augue metus, pellentesque sed molestie non, porta eget odio. Pellentesquevitaenequeeuismodpurusdignissimaliquet.Nullamsitametelitneque,etauctornisi.Quisquesuscipiteliteunullainterdumtempusacatnisl. Vivamus feugiat vestibulum sollicitudin. Aliquam erat volutpat.
</div>
{% endhighlight %}

**Live example:**

<div style="overflow: hidden; text-overflow: ellipsis;" class="well">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis augue metus, pellentesque sed molestie non, porta eget odio. Pellentesquevitaenequeeuismodpurusdignissimaliquet.Nullamsitametelitneque,etauctornisi.Quisquesuscipiteliteunullainterdumtempusacatnisl. Vivamus feugiat vestibulum sollicitudin. Aliquam erat volutpat.
</div>


Unfortunately, constraining the height of an element and expecting text-overflow to be applied to any overflowing text will not work. This is because the text is overflowing **_vertically_**, not horizontally.

**Code example:**

{% highlight html %}
<div style="overflow: hidden; text-overflow: ellipsis; height: 4em;">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis augue metus, pellentesque sed molestie non, porta eget odio. Pellentesque vitae neque euismod purus dignissim aliquet. Nullam sit amet elit neque, et auctor nisi. Quisque suscipit elit eu nulla interdum tempus ac at nisl. Vivamus feugiat vestibulum sollicitudin. Aliquam erat volutpat.
</div>
{% endhighlight %}

**Live example:**

<div style="overflow: hidden; text-overflow: ellipsis; height: 4em;" class="well">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis augue metus, pellentesque sed molestie non, porta eget odio. Pellentesque vitae neque euismod purus dignissim aliquet. Nullam sit amet elit neque, et auctor nisi. Quisque suscipit elit eu nulla interdum tempus ac at nisl. Vivamus feugiat vestibulum sollicitudin. Aliquam erat volutpat.
</div>


This means that text-overflow can only really be used for a single word/line of text or for preventing your page layouts from breaking due to extremely long words.

More information about the text-overflow property can be found on the [MDN text-overflow][] page.

[MDN text-overflow]: https://developer.mozilla.org/en/CSS/text-overflow
