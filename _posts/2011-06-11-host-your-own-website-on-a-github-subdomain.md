---
layout: post
title: Host your own website on a GitHub subdomain
tags: [github, github pages]
commentsIssueId: 2
---

I've recently started learning Git, and part of that is of course learning the ropes at GitHub. One hidden little feature I found (at least I didn't find it advertised anywhere) is [GitHub Pages][]. GitHub Pages lets you host a static website under a subdomain of <http://github.com>.

To use this feature, all you have to do is create a repository with the name `[username].github.com` (replacing `[username]` with your actual username) and then push your website's files to the repository. GitHub will automatically build your website every time you push changes to the repository and make it available at `[username].github.com`. As I mentioned before, you can only host static files, .htaccess files won't work either.

GitHub Pages is designed to be used for hosting documentation for your projects, but can be used just as well for hosting other simple websites. It's available to both free and paid accounts.

It's also possible to get GitHub to automatically build project sites for a specific repository in a sub directory of your subdomain by creating a special branch in that repository. For more information about this feature and others, visit the [GitHub Pages][] home page.

[GitHub Pages]: http://pages.github.com/
