---
layout: post
title: Understanding Git
tags: [git]
commentsIssueId: 5
---

When I started using Git, I came from using Subversion which is on the other end for the VCS spectrum (centralised vs distributed). It took me a while to properly understand Git due to how different it's from Subversion. However, I found an easy way to understand how Git worked was to look at it from the perspective of how objects and references (or pointers) work in your favourite programming language.

![Git object linked list example][example]

A single commit in Git is just an object which contains a reference to it's parent commit object. This forms a series of interconnecting linked lists, which make up the branches in Git. In fact, a branch in Git is really just a reference to a single commit object, which is usually located at the end of one of these linked lists (but doesn't have to be). And a tag is just a simple object that contains a reference to a commit object. A lot of these references also work exactly as you'd expect, for example you can easily change an existing branch to point to ANY existing commit object.

This may be a bit of a simplification of how Git works in reality, but it helped me to picture in my mind how a Git repository fits together, and made it a lot easier for me to understand advanced Git concepts and techniques.

[example]: {{ site.baseurl }}/img/content/git-linked-list-example.png
