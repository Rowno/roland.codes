define(['variables'], function (variables) {
    'use strict';

    window._gaq = [];
    _gaq.push(
        ['_setAccount', variables.googleAnalyticsId],
        ['_setSiteSpeedSampleRate', 100],
        ['_trackPageview']
    );

    (function (d, t) {
        var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
        g.async = g.src = 'https://ssl.google-analytics.com/ga.js';
        s.parentNode.insertBefore(g, s);
    }(document, 'script'));


    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-21361814-6', {'siteSpeedSampleRate': 100});
    ga('send', 'pageview');
});
