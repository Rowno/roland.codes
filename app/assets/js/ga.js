/*global _gaq:true */

var _gaq = [];

define(['app/variables'], function (variables) {
    'use strict';

    _gaq.push(
        ['_setAccount', variables.googleAnalyticsID],
        ['_setSiteSpeedSampleRate', 100],
        ['_trackPageview']
    );

    (function (d, t) {
        var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
        g.src = ('https:' === location.protocol ? '//ssl':'//www') + '.google-analytics.com/ga.js';
        s.parentNode.insertBefore(g, s);
    }(document, 'script'));
});
