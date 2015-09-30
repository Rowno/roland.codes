---
layout: blog-post.html
title: Auto indent on paste in Sublime Text 2
commentsIssueId: 16
---

One thing that I find annoying when developing in Sublime Text 2 is that when you copy and paste code, Sublime doesn't auto indent it to match the current indentation level. However it turns out that Sublime does in fact have this functionality built-in under 'Paste and Indent' (<kbd>ctrl+shift+v</kbd>), but this isn't good enough for me because I have custom mouse button bindings for copy and paste (more on that in a future post). Then I realised that I could just swap the keybindings for 'Paste' and 'Paste and Indent' using Sublime's 'Key Bindings – User' preference file.

```json
[
    { "keys": ["ctrl+shift+v"], "command": "paste" },
    { "keys": ["ctrl+v"], "command": "paste_and_indent" }
]
```
(You'll of course want to change `ctrl` to `super` on Mac)

Now Sublime automatically corrects the indentation of everything I paste! :)
