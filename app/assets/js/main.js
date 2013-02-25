requirejs.config({
    baseUrl: '/assets/js/vendor',
    paths: {
        app: '..'
    }
});


require(['jquery', 'app/variables', 'app/ga'], function ($) {
    'use strict';

    // Track JavaScript errors in Google Analytics
    (function (window, undefined) {
        var link = function (href) {
                var a = window.document.createElement('a');
                a.href = href;
                return a;
            };
        window.onerror = function (message, file, row) {
            var host = link(file).hostname;
            _gaq.push([
                '_trackEvent',
                (host === window.location.hostname || host === undefined || host === '' ? '' : 'external ') + 'error',
                message, file + ' LINE: ' + row, undefined, undefined, true
            ]);
        };
    }(window));


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
});
