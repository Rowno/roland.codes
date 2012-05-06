---
layout: post
title: Access your localhost from inside a virtual machine
tags: [localhost, virtual machine]
commentsIssueId: 1
---

If you develop on Linux or Mac, and you care about supporting IE, you've probably had to deal with running a Windows VM for testing. However to access your computer's localhost from inside the VM you generally have to use your computer's IP address (since localhost now refers to the VM's localhost) and this can cause a number of things to break if you don't change your website's base url. This is quite annoying because every time you go to test something in IE, you have to remember to change the base url as well. This gets even more annoying if your IP address changes.

However, there's an easier way to access your localhost. Inside a VM the IP address `10.0.2.2` always refers to the host machine's localhost. So using this IP address it's possible to map the VM's localhost to the host machine's localhost. All you need to do is add the following line to the VM's hosts file (replacing the existing localhost entry):

    10.0.2.2        localhost

Now when you access localhost in your VM, you'll get your computer's localhost! :)

Unfortunately you can't change the localhost IP address on Windows XP because it's hard coded into the network stack. I've read reports of the same thing on Windows Vista as well.
