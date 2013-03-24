define(function () {
    'use strict';

    var exports = {};
    var constants = {
        CANVAS_WIDTH: 120,
        CANVAS_HEIGHT: 240,
        PADDING: 1
    };


    function get(name) {
        return constants[name];
    }
    exports.get = get;


    return exports;
});
