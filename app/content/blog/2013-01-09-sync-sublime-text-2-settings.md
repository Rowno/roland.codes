---
layout: blog-post.html
title: Sync Sublime Text 2 settings
tags: [tools, sublime text 2]
commentsIssueId: 15
---

These days I find myself developing from multiple computers / operating systems (Linux at home vs Mac at work) and I found it frustrating having to manually keep my Sublime Text 2 settings and  packages in sync on every computer that I use. However I recently discovered that it's actually quite easy to sync the Sublime Text 2 setting files between computers using Dropbox and some symbolic links. This works because the Sublime Text 2 setting files are the same across all operating systems. Below is how I set this up.


On the primary computer, create a symbolic link from the Sublime Text 2 `Packages` directory to a location in the Dropbox directory.

**Linux**

```bash
cd ~/Dropbox
ln -s ~/.config/sublime-text-2/Packages sublime-text-2-settings
```

**Mac**

```bash
cd ~/Dropbox
ln -s ~/'Library/Application Support/Sublime Text 2/Packages' sublime-text-2-settings
```

**Windows**

```bat
cd %HOMEPATH%\Dropbox
mklink /D sublime-text-2-settings "AppData\Roaming\Sublime Text 2\Packages"
```

Then on every other computer create a symbolic link from the location in Dropbox to the `Packages` directory (make sure to close Sublime Text 2 and delete the existing `Packages` directory first).

**Linux**

```bash
cd ~/.config/sublime-text-2
rm -R Packages
ln -s ~/Dropbox/sublime-text-2-settings Packages
```

**Mac**

```bash
cd ~/'Library/Application Support/Sublime Text 2'
rm -R Packages
ln -s ~/Dropbox/sublime-text-2-settings Packages
```

**Windows**

```bat
cd "%HOMEPATH%\AppData\Roaming\Sublime Text 2"
rd /S /Q Packages
mklink /D Packages %HOMEPATH%\Dropbox\sublime-text-2-settings
```

This technique also works for other programs, such as for syncing Minecraft saves between computers.
