requirejs.config({
    baseUrl: '/assets/js/vendor',
    paths: {
        app: '..'
    }
});


require(['jquery', 'app/variables', 'app/ga'], function ($) {
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
});
