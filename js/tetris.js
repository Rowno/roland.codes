/*jslint browser:true */
/*globals jQuery:false */

(function ($) {
    'use strict';

    var CANVAS_WIDTH = 118,
        CANVAS_HEIGHT = 236,
        PADDING = 2,
        $tetris = $('#tetris'),
        Score,
        Control,
        Render;


    function Block(color, x, y) {
        this.x = x;
        this.y = y;
        this.color = color;

        Block.blocks.push(this);
    }

    Block.blocks = [];
    Block.width = 10;
    Block.height = 10;

    Block.prototype.draw = function (context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, Block.width, Block.height);
    };


    function Shape(type, x, y, rotate) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.rotate = 0 || rotate;

        this.blocks = [
            new Block('red', this.x, this.y),
            new Block('red', this.x + Block.width + PADDING, this.y),
            new Block('red', this.x + Block.width + PADDING, this.y + Block.height + PADDING),
            new Block('red', this.x + (Block.width + PADDING) * 2, this.y + Block.height + PADDING)
        ];
    }


    Score = (function () {
        var exports = {},
            score = 0,
            $score = $tetris.find('.score');


        function reset() {
            score = 0;
            $score.text(score);
        }
        exports.reset = reset;

        return exports;
    }());


    Control = (function () {
        var exports = {},
            running = true;


        function start() {
            Score.reset();
            Render.requestDraw();
            $tetris.addClass('running');
        }
        exports.start = start;


        function stop() {
            $tetris.removeClass('running');
        }
        exports.stop = stop;


        $tetris.off('click');
        $tetris.on('click', function () {
            if (running) {
                stop();
            } else {
                start();
            }

            running = !running;
        });

        return exports;
    }());


    Render = (function () {
        var exports = {},
            context = $tetris.find('canvas').get(0).getContext('2d'),
            queued = false,
            drawing = false;


        /**
         * requestAnimationFrame polyfill
         */
        (function () {
            var lastTime = 0,
                vendors = ['ms', 'moz', 'webkit', 'o'],
                x;

            for (x = 0; x < vendors.length && !window.requestAnimationFrame; x += 1) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
                                              window[vendors[x] + 'CancelRequestAnimationFrame'];
            }

            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = function (callback, element) {
                    var currTime = new Date().getTime(),
                        timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                        id = window.setTimeout(
                            function () { callback(currTime + timeToCall); },
                            timeToCall
                        );
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }

            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = function (id) {
                    clearTimeout(id);
                };
            }
        }());


        function draw() {
            drawing = true;

            window.requestAnimationFrame(function () {
                Block.blocks.forEach(function (block) {
                    block.draw(context);
                });

                if (queued) {
                    queued = false;
                    draw();
                }

                drawing = false;
            });
        }


        function requestDraw() {
            if (drawing) {
                queued = true;
            } else {
                draw();
            }
        }
        exports.requestDraw = requestDraw;

        return exports;
    }());


    (function () {
        var shape = new Shape(0, 0, 0);
    }());

    Control.start();
}(jQuery));
