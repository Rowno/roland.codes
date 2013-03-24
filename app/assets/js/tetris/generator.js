/**
 * Generates random Shape's.
 *
 * Uses the Tetris 'Random Generator' algorithm. A queue of unique Shape's
 * types is used to get the best even, random distribution of Shape's.
 */
define([
    'tetris/shape/i',
    'tetris/shape/j',
    'tetris/shape/l',
    'tetris/shape/o',
    'tetris/shape/s',
    'tetris/shape/t',
    'tetris/shape/z'
], function (ShapeI, ShapeJ, ShapeL, ShapeO, ShapeS, ShapeT, ShapeZ) {
    'use strict';

    var exports = {},
        availableShapes = [
            ShapeI,
            ShapeJ,
            ShapeL,
            ShapeO,
            ShapeS,
            ShapeT,
            ShapeZ
        ],
        shapeQueue = [];


    /**
     * Randomly fills up the queue with all the possible unique shapes.
     *
     * @private
     */
    function fillQueue() {
        var shapeNumber;

        while (shapeQueue.length < availableShapes.length) {
            shapeNumber = Math.floor(Math.random() * availableShapes.length);

            if (shapeQueue.indexOf(shapeNumber) === -1) {
                shapeQueue.push(shapeNumber);
            }
        }
    }

    /**
     * Generates a random Shape.
     *
     * @returns {Shape} A random Shape type instance.
     */
    function generate() {
        if (shapeQueue.length === 0) {
            fillQueue();
        }

        return new availableShapes[shapeQueue.pop()]();
    }
    exports.generate = generate;


    return exports;
});
