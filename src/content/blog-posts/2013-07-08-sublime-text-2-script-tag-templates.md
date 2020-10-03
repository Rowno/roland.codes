---
title: Make Sublime Text 2 treat script tag templates as HTML
commentsIssueId: 17
---

Using templates to render HTML in Javascript is great; but unfortunately Sublime Text 2 treats templates embedded in script tags as Javascript (which means syntax highlighting and completions don't work correctly). Luckily, this can easily be fixed by tweaking Sublime's HTML language file.

Here's what you need to do:

1.  Go to Sublime's `Packages` directory (or the use the `Preferences -> Browse Packages…` menu item).
2.  Open the `HTML/HTML.tmLanguage` file.
3.  Change line 286 from:

    ```xml
    <string>(?:^\s+)?(&lt;)((?i:script))\b(?![^&gt;]*/&gt;)</string>
    ```

    to:

    ```xml
    <string>(?:^\s+)?(&lt;)((?i:script))\b(?![^&gt;]*/&gt;)(?!.*type=["']text/template['"])</string>
    ```

Now any script tags with a `type` of `text/template` will be treated as HTML:

```handlebars
<script type="text/template">
    <h1>{{title}}</h1>
</script>
```
