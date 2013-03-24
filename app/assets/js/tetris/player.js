/**
 * Handles the player controlled Shape.
 */
define([
    'tetris/html',
    'tetris/score',
    'tetris/generator',
    'tetris/keyboard'
], function ($tetris, Score, Generator, Keyboard) {
    'use strict';

    var exports = {},
        SPEED_NORMAL = 500,
        SPEED_SOFT_DROP = 50,
        KEYS = [],
        shape,
        shapeMoves = 0,
        forwardTimer,
        softDropCount = 0,
        gameover = false;


    KEYS.push({ // up arrow
        key: 38,
        down: function () {
            softDropCount = 0;
            clearInterval(forwardTimer);
        },
        press: function () {
            moveForward();
            softDropCount += 1;
        },
        up: function () {
            forwardTimer = setInterval(moveForward, SPEED_NORMAL);
        },
        repeat: SPEED_SOFT_DROP
    });

    KEYS.push({ // right arrow
        key: 39,
        press: function () {
            try {
                shape.move(1, 0);
            } catch (exception) {}
        }
    });

    KEYS.push({ // down arrow
        key: 40,
        down: function () {
            try {
                shape.rotate();
            } catch (exception) {}
        }
    });

    KEYS.push({ // left arrow
        key: 37,
        press: function () {
            try {
                shape.move(-1, 0);
            } catch (exception) {}
        }
    });


    function endGame() {
        gameover = true;
        $tetris.addClass('gameover');
        stop();
    }

    function moveForward() {
        try {
            shape.move(0, -1);
            shapeMoves += 1;
        } catch (exception) {
            // If the Shape collided with a Block or the top boundary.
            if (exception.name === 'BlockCollision' ||
               (exception.name === 'BoundaryCollision' && exception.boundary === 1)) {
                if (shapeMoves === 0) {
                    endGame();
                } else {
                    if (softDropCount > 0) {
                        Score.softDrop(softDropCount);
                    }

                    spawn();
                    Score.check(shape);
                }
            }
        }
    }

    function spawn() {
        shapeMoves = 0;
        softDropCount = 0;
        shape = Generator.generate();
    }

    /**
     * Retrieves the player controlled Shape.
     *
     * @returns {Shape} A type of Shape.
     */
    function getShape() {
        return shape;
    }
    exports.getShape = getShape;

    /**
     * Start spawning Shape's and moving them.
     */
    function start() {
        if (gameover) {
            gameover = false;
            $tetris.removeClass('gameover');
        }

        spawn();

        for (var i = 0; i < KEYS.length; i += 1) {
            Keyboard.on(KEYS[i]);
        }

        forwardTimer = setInterval(moveForward, SPEED_NORMAL);
    }
    exports.start = start;

    /**
     * Stop spawning Shape's and moving them.
     */
    function stop() {
        for (var i = 0; i < KEYS.length; i += 1) {
            Keyboard.off(KEYS[i].key);
        }

        shape = null;
        clearInterval(forwardTimer);
    }
    exports.stop = stop;


    return exports;
});
