/**
 * Encapsulates localStorage persistent storage.
 *
 * Does feature detection, namespacing and JSON encoding.
 */
define(function () {
    'use strict';

    var exports = {},
        NAMESPACE = 'tetris.';


    function get(key) {
        var value = null;

        if (Modernizr.localstorage) {
            value = localStorage.getItem(NAMESPACE + key);
            value = JSON.parse(value);
        }

        return value;
    }
    exports.get = get;

    function set(key, value) {
        if (Modernizr.localstorage) {
            value = JSON.stringify(value);
            localStorage.setItem(NAMESPACE + key, value);
        }
    }
    exports.set = set;


    return exports;
});
