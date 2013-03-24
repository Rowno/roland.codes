/**
 * Handles keyboard key events and normalises the key repeat rate.
 */
define(['jquery'], function ($) {
    'use strict';

    var exports = {},
        REPEAT_DEFAULT = 100,
        keys = {},
        pressedKeys = {},
        $body = $('body');


    function keydown(event) {
        // Don't capture key events on form elements.
        if ($(event.target).is('input, textarea, select')) {
            return;
        }

        // Key is being pressed (key down event has already been fired).
        if (pressedKeys[event.which]) {
            return false;
        }

        if (keys[event.which]) {
            // Mark key as being pressed and register key repeat interval.
            if (typeof keys[event.which].press === 'function') {
                pressedKeys[event.which] = setInterval(
                    keys[event.which].press,
                    keys[event.which].repeat || REPEAT_DEFAULT
                );

                keys[event.which].press();
            } else {
                pressedKeys[event.which] = true;
            }

            // Fire key down event.
            if (typeof keys[event.which].down === 'function') {
                keys[event.which].down.call(null);
            }

            return false;
        }
    }

    function keyup(event) {
        if (keys[event.which]) {
            // Clear the key as being pressed.
            if (keys[event.which].press) {
                clearInterval(pressedKeys[event.which]);
            }

            delete pressedKeys[event.which];

            // Fire the key up event.
            if (typeof keys[event.which].up === 'function') {
                keys[event.which].up.call(null);
            }
        }
    }

    /**
     * Registers event listeners to a key.
     *
     * @param {object} options Object map of options. Available options are:
     *                         key {number} Key code.
     *                         down {function} [optional] Callback fired on key down.
     *                         press {function} [optional] Callback fired on key repeat.
     *                         up {function} [optional] Callback fired on key up.
     *                         repeat {number} [optional] Key repeat rate in milliseconds.
     */
    function on(options) {
        keys[options.key] = options;
    }
    exports.on = on;

    /**
     * Removes all event listeners for key.
     *
     * @param {number} key Key code.
     */
    function off(key) {
        if (pressedKeys[key]) {
            if (typeof keys[key].press === 'function') {
                clearInterval(pressedKeys[key]);
            }

            delete pressedKeys[key];
        }

        delete keys[key];
    }
    exports.off = off;

    /**
     * Start listening to key events.
     */
    function start() {
        $body.on('keydown', keydown);
        $body.on('keyup', keyup);
    }
    exports.start = start;

    /**
     * Stop listening to key events.
     *
     * Doesn't remove the event listeners, just 'pauses' them.
     */
    function stop() {
        // Clear of pressed keys.
        for (var key in pressedKeys) {
            if (pressedKeys.hasOwnProperty(key)) {
                if (typeof keys[key].press === 'function') {
                    clearInterval(pressedKeys[key]);
                }
            }
        }
        pressedKeys = {};

        $body.off('keydown', keydown);
        $body.off('keyup', keyup);
    }
    exports.stop = stop;


    return exports;
});
