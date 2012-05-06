---
layout: post
title: Addon SDK double keyboard events bug
tags: [addon sdk]
commentsIssueId: 3
---

Recently, while I was adding keyboard navigation support to an addon, I discovered a very frustrating bug in Mozilla's Addon SDK. Basically, keyboards events (keyup, keydown, etc) were being fired twice on various elements inside a panel. Strangely, this seems to be a Linux specific bug (can't vouch for Mac though) because it isn't happening in Firefox on Windows. I've reported to the bug to Mozilla along with a testcase ([Bug 707623][]), lets hope it get's fixed soon.

In the meantime, I found a workaround which is to call preventDefault() on the keyboard event, which prevents the second event from firing for some reason.

[Bug 707623]: https://bugzilla.mozilla.org/show_bug.cgi?id=707623
