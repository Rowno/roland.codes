---
layout: post
title: VMWare to VirtualBox
tags: [virtual machine, virtualbox, vmware]
commentsIssueId: 9
---

Recently I had to run a VMWare VM in VirtualBox (because open source rocks ;)). Turns out you don't even need to convert the VM to the VirtualBox format because VirtualBox can directly run VMWare VM's. All you need to do is create a new VM in VirtualBox, choose the `Use existing hard disk` option on the Virtual Hard Disk step and select the `.vmdk` file from the VMWare VM's files. You should also try to match the VirtualBox VM's settings as closely as possible to those of the VMWare VM.

Below are solutions to some problems I had when trying to run the VM:

 * If the VM doesn't start, try enabling the `Enable IO APIC` option in the System settings.
 * If the VM's network doesn't work, try selecting the `Intel PRO/1000 T Server` Adapter Type under Advanced in the Network settings.
