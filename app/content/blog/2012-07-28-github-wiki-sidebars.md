---
layout: post.html
title: GitHub Wiki sidebars
tags: [github]
commentsIssueId: 13
---

GitHub Wiki doesn't expose it in the UI, but it's actually possible to create a simple sidebar that can be displayed across multiple pages in a wiki.

To create a sidebar, you first need to clone the wiki using Git. To find out how to do this, see the 'Git Access' tab of the wiki.

Once you have a local copy of the wiki, simply create a file called `_Sidebar.ext` containing the sidebar content. The sidebar will appear on all pages in the current directory and on all pages in sub directories that don't have their own `_Sidebar.ext` file. So if you want to create a sidebar that's only displayed on a couple of pages, create a sub directory and move the pages and sidebar into it. Directories have no effect on the URL structure of the wiki.

Once you're done, don't forget to commit and push the changes back to GitHub.

This feature is actually inherited [Gollum][], GitHub Wiki's underlying wiki engine. GitHub Wiki has couple of other hidden features as well, such as header and footer includes, so be sure to checkout [Gollum][] to find out what GitHub Wikis are truly capable of.

Interestingly though, once you've created a sidebar, GitHub displays a textarea for editing it's content on the edit page of the pages it's displayed on.


[gollum]: https://github.com/github/gollum
