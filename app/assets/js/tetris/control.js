/**
 * Main control for starting and stopping the game.
 *
 * Also handles the game help information.
 */
define([
    'tetris/html',
    'tetris/keyboard',
    'tetris/player',
    'tetris/sound',
    'tetris/block',
    'tetris/score',
    'tetris/shape/i',
    'tetris/shape/j',
    'tetris/shape/l',
    'tetris/shape/o',
    'tetris/shape/s',
    'tetris/shape/t',
    'tetris/shape/z'
], function ($tetris, Keyboard, Player, Sound, Block, Score, ShapeI, ShapeJ, ShapeL, ShapeO, ShapeS, ShapeT, ShapeZ) {
    'use strict';

    var exports = {},
        running = true,
        helpActive = false,
        $helpButton = $tetris.find('.help-button'),
        $helpBox = $tetris.find('.help-box');


    /**
     * Starts the game.
     */
    function start() {
        /*jshint nonew:false */
        new ShapeZ(1, 0);
        new ShapeT(4, 0);
        new ShapeI(6, 2, 1);
        new ShapeO(7, 0);
        new ShapeJ(9, 1, 1);
        new ShapeJ(1, 2, 2);
        new ShapeS(4, 2, 1);
        new ShapeL(5, 3, 3);
        new ShapeZ(8, 3);
        new ShapeI(1, 3);
        new ShapeT(1, 5, 2);
        new ShapeJ(3, 4);

        Keyboard.start();
        Player.start();
        Sound.start();

        running = true;
        $tetris.addClass('running');
    }
    exports.start = start;

    /**
     * Stops and resets the game.
     */
    function stop() {
        Block.reset();
        Keyboard.stop();
        Player.stop();
        Score.reset();
        Sound.stop();

        running = false;
        $tetris.removeClass('running');

        if (helpActive) {
            toggleHelp();
        }
    }
    exports.stop = stop;

    function toggleHelp() {
        if (helpActive) {
            helpActive = false;
            $helpButton.removeClass('active');
            $helpBox.hide();
        } else {
            helpActive = true;
            $helpButton.addClass('active');
            $helpBox.show();
        }
    }

    // escape
    Keyboard.on({
        key: 27,
        down: function () {
            stop();
        }
    });

    // ?
    Keyboard.on({
        key: 191,
        up: function () {
            toggleHelp();
        }
    });

    // Remove the initial click handler that loads the javascript file.
    $tetris.find('.image').off('click');

    // Register handler to start the game.
    $tetris.find('.image').on('click', function () {
        start();
    });

    // Register game close button.
    $tetris.find('.close').on('click', function () {
        stop();
    });

    // Register help toggle button.
    $helpButton.on('click', function () {
        toggleHelp();
    });


    return exports;
});
