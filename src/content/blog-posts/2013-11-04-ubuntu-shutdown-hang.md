---
title: Ubuntu shutdown hang
commentsIssueId: 19
---

Ever since upgrading to Ubuntu 13.04, I've been having a problem where my computer would hang on shutdown (after the OS had shutdown and the partitions had been unmounted).

Turns out the graphics driver wasn't shutting down correctly (should have guessed as much). When I went to Software & Updates > Additional Drivers, I saw that I was using `nvidia-310-updates (proprietary)` and switching to `nvidia-310 (proprietary, tested)` fixed the problem.

Lesson learnt? Don't use untested graphics drivers. ;)
