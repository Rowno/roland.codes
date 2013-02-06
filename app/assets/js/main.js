requirejs.config({
    baseUrl: '/assets/js/vendor',
    paths: {
        app: '..'
    }
});


require(['app/variables', 'jquery'], function (variables, $) {
    'use strict';

    $(function () {
        if (Modernizr.canvas) {
            $('#tetris .image').on('click', function () {
                require(['app/tetris']);
            });
        }

        if ($('#comments').length > 0) {
            require(['app/comments']);
        }
    });

    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', variables.googleAnalyticsID]);
    _gaq.push(['_setSiteSpeedSampleRate', 100]);
    _gaq.push(['_trackPageview']);
    (function () {
        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    })();
});
