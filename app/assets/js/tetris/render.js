/**
 * Handles rendering of all the game objects.
 *
 * Which is really just Block's.
 */
define(['tetris/constants', 'polyfill/requestanimationframe'], function (Constants) {
    'use strict';

    var exports = {},
        queued = false,
        drawing = false,
        blocks = [],
        canvas = Constants.get('$TETRIS').find('canvas')[0],
        context = canvas.getContext('2d'),
        devicePixelRatio,
        backingStoreRatio,
        ratio,
        canvasWidth,
        canvasHeight;


    // Initialise high DPI canvas

    devicePixelRatio = window.devicePixelRatio || 1;
    backingStoreRatio = context.webkitBackingStorePixelRatio ||
                        context.mozBackingStorePixelRatio ||
                        context.msBackingStorePixelRatio ||
                        context.oBackingStorePixelRatio ||
                        context.backingStorePixelRatio || 1;
    ratio = devicePixelRatio / backingStoreRatio;

    if (devicePixelRatio !== backingStoreRatio) {
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;

        canvas.width = canvasWidth * ratio;
        canvas.height = canvasHeight * ratio;

        canvas.style.width = canvasWidth + 'px';
        canvas.style.height = canvasHeight + 'px';

        context.scale(ratio, ratio);
    }


    function draw() {
        drawing = true;

        window.requestAnimationFrame(function () {
            context.clearRect(0, 0, Constants.get('CANVAS_WIDTH'), Constants.get('CANVAS_HEIGHT'));

            for (var i = 0; i < blocks.length; i += 1) {
                blocks[i].draw(context);
            }

            if (queued) {
                queued = false;
                draw();
            }

            drawing = false;
        });
    }

    /**
     * Requests the game to be drawn.
     *
     * This method can be executed as many times as necessary without any
     * huge performance hit. As only one animation frame will be requested
     * at a time.
     */
    function requestDraw() {
        if (drawing) {
            queued = true;
        } else {
            draw();
        }
    }
    exports.requestDraw = requestDraw;

    /**
     * Sets the array holding the blocks to be drawn.
     */
    function setBlocks(blocksArray) {
        blocks = blocksArray;
    }
    exports.setBlocks = setBlocks;


    return exports;
});
