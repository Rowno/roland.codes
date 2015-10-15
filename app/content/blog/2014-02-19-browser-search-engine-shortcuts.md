---
layout: blog-post.html
title: Browser search engine shortcuts
commentsIssueId: 22
---

As a developer, I spend a lot of time looking up reference documentation while programming. But I found that Googling for it was an unnecessary hassle, especially when I knew exactly what I was looking for and where to find it.

So I combined Google's I'm Feeling Lucky search with custom browser search engines to create some nice shortcuts. They allow me to get straight to the documentation that I'm looking for with just a keyword and query, right from the browser's URL bar. For example, to get to the documentation for CSS box-shadow (I always forget the order of the values), I just need to enter `m box-shadow` in the URL bar.

To set this up in Chrome, go to <kbd><kbd><samp>Settings</samp></kbd> > <kbd><samp>Manage search engines…</samp></kbd></kbd> and scroll to the inputs at the bottom.

The first input is the name of the search engine. This can be anything you want and will display in the URL bar after you enter the keyword.

The second input is the keyword that triggers the search engine. Choose something tiny to minimise repetitive typing.

The third input is the URL of the search engine. For this use this URL:
```
http://www.google.com/search?btnI&q=site:[domain]%20%s
```
Replacing `[domain]` with the domain of the website you want to search over. Press <kbd><kbd>Enter</kbd></kbd> to save the search engine.

Now you'll be able to perform a quick search of your chosen website by entering the keyword followed by a query in the URL bar.

Here are the shortcuts that I've setup in my browser:

Name: `MDN`
Keyword: `m`
URL: `http://www.google.com/search?btnI&q=site:developer.mozilla.org%20%s`

Name: `jQuery`
Keyword: `j`
URL: `http://www.google.com/search?btnI&q=site:api.jquery.com%20%s`

Name: `Can I use…`
Keyword: `c`
URL: `http://www.google.com/search?btnI&q=site:caniuse.com%20%s`
