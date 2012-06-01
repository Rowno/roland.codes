/*jslint browser:true */
/*globals jQuery:false */

(function ($) {
    'use strict';

    var CANVAS_WIDTH = 118,
        CANVAS_HEIGHT = 236,

        $tetris = $('#tetris'),
        $canvas = $('<canvas width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '">'),

        context = $canvas.get(0).getContext('2d'),
        running = true;


    context.fillStyle = '#000';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    $tetris.append($canvas);


    function start() {
        $tetris.addClass('running');
    }

    function stop() {
        $tetris.removeClass('running');
    }


    $tetris.off('click');
    $tetris.on('click', function () {
        if (running) {
            stop();
        } else {
            start();
        }

        running = !running;
    });


    start();
    $tetris.removeClass('loading');
}(jQuery));
