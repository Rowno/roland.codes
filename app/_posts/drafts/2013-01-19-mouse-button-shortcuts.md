---
layout: post
title: Mouse button shortcuts
tags: [tools]
commentsIssueId: 17
published: false
---

## Linux - xbindkeys + xautomation ##

.xbindkeysrc

```
# Left Wheel Copy
"xte 'keydown Control_L' 'key C' 'keyup Control_L'"
    release + b:6

# Right Wheel Paste
"xte 'keydown Control_L' 'key V' 'keyup Control_L'"
    release + b:7

# GNOME Shell Application Overview
"xte 'keydown Alt_L' 'key F1' 'keyup Alt_L'"
    release + b:10

# Browser Refresh
"xte 'key F5'"
    release + b:8
```


## Mac - SteerMouse ##

Simple app for assigning various actions (such as shortcut keys, execute program, switch applications etc) to mouse buttons.

**Buttons**
Button 4: cmd + R
Button 5: cmd + tab
Button 6: Switch Application

**Tilt Wheel**
Tilt Left: cmd + C
Tilt Right: cmd + V


## Windows - AutoHotkey ##

Doucments/AutoHotkey.ahk

```
WheelLeft::^c
WheelRight::^v
XButton1::F5
```
