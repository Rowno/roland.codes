---
title: Architect, a Javascript template editor
commentsIssueId: 11
---

[Architect][] is a web app for editing Javascript templates in various engines. It started life as a simple page for testing Mustache templates. But when I started to get annoyed with the limitations of writing code in `<textarea>`'s and replaced them with [Ace][] editors, it quickly grew into a fully featured web app with support for multiple templating engines.

Architect was built using [HTML5 Boilerplate][] and [Bootstrap][] and a number of HTML5 technologies including Web Workers, Media Queries, Application Cache and LocalStorage. Architect also utilises a responsive design and WAI-ARIA accessibility.

As a learning experience, I also decided to make Architect without using jQuery or any polyfills. Using the native DOM methods of modern browsers turned out to be quite easy (though more verbose) and allowed me to avoid jQuery's bloat. Since the app is targeted at web developers, browser support shouldn't be a problem (if you're a web developer using an outdated browser, shame on you!).

More information about Architect and it's source code is available at [GitHub][].

As always, pull requests are welcome. :)

[architect]: https://rowno.github.io/architect/
[ace]: https://github.com/ajaxorg/ace
[html5 boilerplate]: https://html5boilerplate.com/
[bootstrap]: https://getbootstrap.com/
[github]: https://github.com/Rowno/architect
