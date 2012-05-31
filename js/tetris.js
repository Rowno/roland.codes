/*jslint browser: true */
/*globals jQuery:false */

(function ($) {
    'use strict';

    var CANVAS_WIDTH = 250,
        CANVAS_HEIGHT = 400,
        $canvas = $('<canvas />'),
        canvas = $canvas.get(0).getContext('2d');

    $canvas.width(CANVAS_WIDTH);
    $canvas.height(CANVAS_HEIGHT);
    //$canvas.prependTo('body');

    canvas.fillStyle = '#000';
    canvas.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}(jQuery));
