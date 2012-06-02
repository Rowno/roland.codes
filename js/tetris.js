/*jslint browser:true */
/*globals jQuery:false */

(function ($) {
    'use strict';

    var CANVAS_WIDTH = 118,
        CANVAS_HEIGHT = 236,
        PADDING = 1,
        $tetris = $('#tetris'),
        Grid,
        Score,
        Control,
        Render;


    Grid = (function () {
        var exports = {},
            WIDTH = 12,
            HEIGHT = 12;

        exports.WIDTH = WIDTH;
        exports.HEIGHT = HEIGHT;


        function pixelX(x) {
            return x * WIDTH;
        }
        exports.pixelX = pixelX;


        function pixelY(y) {
            return y * HEIGHT;
        }
        exports.pixelY = pixelY;

        return exports;
    }());


    function Block(color, x, y) {
        this.x = x;
        this.y = y;
        this.color = color;

        Block.blocks.push(this);
    }

    Block.blocks = [];

    Block.prototype.draw = function (context) {
        context.fillStyle = this.color;
        context.fillRect(
            Grid.pixelX(this.x) + PADDING,
            Grid.pixelY(this.y) + PADDING,
            Grid.WIDTH - PADDING * 2,
            Grid.HEIGHT - PADDING * 2
        );
    };


    function Shape() {}


    function ShapeI(x, y) {
        this.x = x;
        this.y = y;
        this.rotation = 0;

        this.blocks = [
            new Block(this.COLOR, this.x, this.y),
            new Block(this.COLOR, this.x + 1, this.y),
            new Block(this.COLOR, this.x + 2, this.y),
            new Block(this.COLOR, this.x + 3, this.y)
        ];
    }
    ShapeI.prototype = new Shape();

    ShapeI.prototype.COLOR = '#00FFFF';


    function ShapeJ(x, y) {
        this.x = x;
        this.y = y;
        this.rotation = 0;

        this.blocks = [
            new Block(this.COLOR, this.x, this.y),
            new Block(this.COLOR, this.x + 1, this.y),
            new Block(this.COLOR, this.x + 2, this.y),
            new Block(this.COLOR, this.x + 2, this.y + 1)
        ];
    }
    ShapeJ.prototype = new Shape();

    ShapeJ.prototype.COLOR = '#0000FF';


    function ShapeL(x, y) {
        this.x = x;
        this.y = y;
        this.rotation = 0;

        this.blocks = [
            new Block(this.COLOR, this.x, this.y),
            new Block(this.COLOR, this.x + 1, this.y),
            new Block(this.COLOR, this.x + 2, this.y),
            new Block(this.COLOR, this.x, this.y + 1)
        ];
    }
    ShapeL.prototype = new Shape();

    ShapeL.prototype.COLOR = '#FFA500';


    function ShapeO(x, y) {
        this.x = x;
        this.y = y;
        this.rotation = 0;

        this.blocks = [
            new Block(this.COLOR, this.x, this.y),
            new Block(this.COLOR, this.x + 1, this.y),
            new Block(this.COLOR, this.x, this.y + 1),
            new Block(this.COLOR, this.x + 1, this.y + 1)
        ];
    }
    ShapeO.prototype = new Shape();

    ShapeO.prototype.COLOR = '#FFFF00';


    function ShapeS(x, y) {
        this.x = x;
        this.y = y;
        this.rotation = 0;

        this.blocks = [
            new Block(this.COLOR, this.x + 1, this.y),
            new Block(this.COLOR, this.x + 2, this.y),
            new Block(this.COLOR, this.x, this.y + 1),
            new Block(this.COLOR, this.x + 1, this.y + 1)
        ];
    }
    ShapeS.prototype = new Shape();

    ShapeS.prototype.COLOR = '#00FF00';


    function ShapeT(x, y) {
        this.x = x;
        this.y = y;
        this.rotation = 0;

        this.blocks = [
            new Block(this.COLOR, this.x, this.y),
            new Block(this.COLOR, this.x + 1, this.y),
            new Block(this.COLOR, this.x + 2, this.y),
            new Block(this.COLOR, this.x + 1, this.y + 1)
        ];
    }
    ShapeT.prototype = new Shape();

    ShapeT.prototype.COLOR = '#AA00FF';


    function ShapeZ(x, y) {
        var COLOR = '#FF0000';

        this.x = x;
        this.y = y;
        this.rotation = 0;

        this.blocks = [
            new Block(COLOR, this.x, this.y),
            new Block(COLOR, this.x + 1, this.y),
            new Block(COLOR, this.x + 1, this.y + 1),
            new Block(COLOR, this.x + 2, this.y + 1)
        ];
    }
    ShapeZ.prototype = new Shape();


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
        var shapeI = new ShapeI(0, 0),
            shapeJ = new ShapeJ(0, 2),
            shapeL = new ShapeL(0, 5),
            shapeO = new ShapeO(0, 8),
            shapeS = new ShapeS(0, 11),
            shapeT = new ShapeT(0, 14),
            shapeZ = new ShapeZ(0, 17);
    }());

    Control.start();
}(jQuery));
