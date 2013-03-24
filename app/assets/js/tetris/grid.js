/**
 * Abstracts the canvas from pixels to grid coordinates.
 *
 * The grid is zero based.
 */
define(function () {
    'use strict';

    var exports = {},
        WIDTH = 12,
        HEIGHT = 12,
        COLUMNS = 10,
        ROWS = 22;

    exports.WIDTH = WIDTH; // Width of a single grid space.
    exports.HEIGHT = HEIGHT; // Height of a single grid space.
    exports.COLUMNS = COLUMNS; // Number of columns in the grid.
    exports.ROWS = ROWS; // Number of rows in the grid.


    /**
     * Converts the X coordinate to pixels.
     *
     * @param {number} x X coordinate.
     * @returns {number} Number of pixels.
     */
    function pixelX(x) {
        return x * WIDTH;
    }
    exports.pixelX = pixelX;

    /**
     * Converts the Y coordinate to pixels.
     *
     * @param {number} y Y coordinate.
     * @returns {number} Number of pixels.
     */
    function pixelY(y) {
        return y * HEIGHT;
    }
    exports.pixelY = pixelY;


    return exports;
});
