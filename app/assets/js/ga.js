/*global _gaq:true */

var _gaq = _gaq || [];

define(['app/variables'], function (variables) {
    'use strict';

    _gaq.push(['_setAccount', variables.googleAnalyticsID]);
    _gaq.push(['_setSiteSpeedSampleRate', 100]);
    _gaq.push(['_trackPageview']);

    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
});
