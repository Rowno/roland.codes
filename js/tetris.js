/*jslint browser:true */
/*globals jQuery:false */

(function ($) {
    'use strict';

    var CANVAS_WIDTH = 118,
        CANVAS_HEIGHT = 236,

        $tetris = $('#tetris'),
        $score = $tetris.find('.score'),

        context = $tetris.find('canvas').get(0).getContext('2d'),
        running = true,
        score = 0;


    context.fillStyle = '#000';
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);


    function start() {
        score = 0;
        $score.text(score);
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
