---
layout: post
title: Introducing JSLinter!
tags: [addon sdk, firefox addon, jslint, jslinter]
commentsIssueId: 8
---

I was looking for a Firefox addon that would easily allow me to run all Javascript on a web page through JSLint, since copying and pasting code into the JSLint website gets very tedious. But to my surprise, the only JSLint addon I could find was the JSLint feature in YSlow! But I find YSlow to be very unreliable and it's JSLint feature leaves a lot to be desired. So I decided to fix this problem. Introducing [JSLinter][]!

JSLinter is a simple Firefox addon that analyses all the Javascript files on a web page using JSLint. Internally it uses the same Javascript that's used on the official JSLint website, so you can rely on getting the same results when using this addon. I'll also try to release regular updates to the addon to keep it up to date with changes to JSLint. JSLinter also allows you to change all the same options that are available on the JSLint website and even allows you to exclude specific Javascript files from analysis. These are all features that YSlow lacks.

Because JSLinter was only a simple addon, I decided to create it using Mozilla's [Addon SDK][], which made it's development quite pleasant and resulted in a bunch of free features (restartless, compatibility with future Firefox releases, etc).

However, because JSLinter is only a simple addon, it may not be able to detect all the Javascript files on a web page if the website is using a script loader. This is because some script loaders don't leave `<script>` tags in the DOM (internally JSLinter just calls `document.querySelectorAll('script')` on the target page).

JSLinter is available for download at [addons.mozilla.org][JSLinter] and it's source code is available at [Github][] (pull requests are welcome). I hope you find it useful! :)

[JSLinter]: https://addons.mozilla.org/addon/jslinter?src=external-rolandwarmerdam.co.nz
[Addon SDK]: https://addons.mozilla.org/developers/builder
[Github]: https://github.com/Rowno/jslinter
