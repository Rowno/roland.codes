requirejs.config({
    baseUrl: '/assets/js/vendor',
    paths: {
        app: '..'
    }
});

require(['jquery'], function ($) {
    'use strict';

    $(function () {
        if (Modernizr.canvas) {
            $('#tetris .image').on('click', function () {
                require(['app/tetris']);
            });
        }

        if ($(document.body).is('#post')) {
            require(['app/comments']);
        }
    });
});
