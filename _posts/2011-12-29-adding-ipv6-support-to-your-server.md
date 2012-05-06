---
layout: post
title: Adding IPv6 support to your server
tags: [apache, ipv6, linode, ubuntu]
commentsIssueId: 6
---

With the exhaustion of IPv4 addresses [coming closer to reality][ipv4depletion], I decided it was about time that I added IPv6 support to my server. This turned out to be quite an easy process (at least it was on [Linode][] + Ubuntu 10.04). In this post I'll show you how to add IPv6 support to your own server in 4 easy steps.

The first step, of course, is to request an IPv6 address for your server. On [Linode][] this was as simple as clicking the 'Enable IPv6' link and restarting the server. When the server came back online it automatically had an IPv6 address assigned to it and the IPv6 interfaces configured. This step might be more complicated on other hosts.

The second step is to allow the IPv6 ports through the firewall. If you're using UFW, you'll need to do the following:

 * Edit `/etc/default/ufw` and change `IPV6=no` to `IPV6=yes` (I think that `IPV6=yes` is now the default value starting Ubuntu 11.10).
 * Disable and enable the firewall for the changes to take affect. A server restart may also be required.
 * Re-add all your existing firewall rules so that the IPv6 rules get added.

The third step is to configure Apache to listen to both the IPv4 and IPv6 interfaces. All you need to do is make sure that Apache is using IP agnostic rules for both the Listen and VirtualHost directives, as Apache will then automatically listen to both of the interfaces. For example:

{% highlight apache %}
Listen 80

<VirtualHost *:80>
{% endhighlight %}

This is the default setup for Apache, so chances are you wouldn't need to change a thing! However, if you're using IP-based Virtual Hosts, you'll need to add your IPv6 addresses to your VirtualHost directives as well, which can be done like the following:

{% highlight apache %}
<VirtualHost 173.255.241.34:80, [2600:3c01::f03c:91ff:fe93:fafd]:80>
{% endhighlight %}

Don't forget to restart Apache if you made any changes.

Finally you'll need add AAAA records containing your IPv6 address to your DNS. These records should correspond to your existing A records.

Now it's time to test your new IPv6 setup! This can be a little difficult at the moment, since it's likely that your ISP doesn't support IPv6 yet, but you can use a service like <http://ipv6-test.com/validate.php> to validate your setup or you can try visiting your website through an IPv6 proxy. More information about IPv6 networking on [Linode][] is available in the [Linode Library][].

The future of the internet relies on the adoption of IPv6, so take the initiative!

[ipv4depletion]: http://www.ipv4depletion.com/?page_id=326
[Linode]: http://www.linode.com/?r=65f866a7004f627ae37fa3283f8a89b4fa9cecbe
[Linode Library]: http://library.linode.com/networking/ipv6
