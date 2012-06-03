/*jslint browser:true */
/*globals jQuery:false */

/*
 CONTENTS
 ========
 Grid
 Block
 Shape
 ShapeI
 ShapeJ
 ShapeL
 ShapeO
 ShapeS
 ShapeT
 ShapeZ
 Score
 Render
 Player
 Control
*/

(function ($) {
    'use strict';

    var CANVAS_WIDTH = 120,
        CANVAS_HEIGHT = 240,
        PADDING = 1,
        $tetris = $('#tetris'),
        Grid,
        Score,
        Render,
        Player,
        Control;


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

    Block.prototype.destroy = function () {
        var index = Block.blocks.indexOf(this);
        Block.blocks.splice(index, 1);
    };

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

    Shape.prototype.init = function (x, y, orientation) {
        var that = this;

        if (x !== undefined) {
            this.x = x;
            this.y = y;
        }

        this.orientation = orientation || 0;
        this.blocks = [];

        this.ORIENTATIONS[this.orientation].forEach(function (position) {
            that.blocks.push(new Block(
                that.COLOR,
                that.x + position.x,
                that.y + position.y
            ));
        });

        Render.requestDraw();
    };

    Shape.prototype.destroy = function () {
        this.blocks.forEach(function (block) {
            block.destroy();
        });
    };

    Shape.prototype.rotate = function () {
        var that = this;

        this.orientation += 1;

        if (this.orientation === this.ORIENTATIONS.length) {
            this.orientation = 0;
        }

        this.ORIENTATIONS[this.orientation].forEach(function (position, index) {
            that.blocks[index].x = that.x + position.x;
            that.blocks[index].y = that.y + position.y;
        });
    };


    function ShapeI(x, y, orientation) {
        this.x = 4;
        this.y = 19;

        this.init.apply(this, arguments);
    }
    ShapeI.prototype = new Shape();

    ShapeI.prototype.COLOR = '#00FFFF';
    ShapeI.prototype.ORIENTATIONS = [
        [
            {x: -1, y: 0},
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 2, y: 0}
        ],
        [
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: 0, y: 1},
            {x: 0, y: 2}
        ]
    ];


    function ShapeJ(x, y, orientation) {
        this.x = 4;
        this.y = 18;

        this.init.apply(this, arguments);
    }
    ShapeJ.prototype = new Shape();

    ShapeJ.prototype.COLOR = '#0000FF';
    ShapeJ.prototype.ORIENTATIONS = [
        [
            {x: 1, y: 0},
            {x: 0, y: 0},
            {x: -1, y: 0},
            {x: 1, y: 1}
        ],
        [
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: 0, y: 1},
            {x: -1, y: 1}
        ],
        [
            {x: 1, y: 0},
            {x: 0, y: 0},
            {x: -1, y: 0},
            {x: -1, y: -1}
        ],
        [
            {x: 1, y: -1},
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: 0, y: 1}
        ]
    ];


    function ShapeL(x, y, orientation) {
        this.x = 4;
        this.y = 18;

        this.init.apply(this, arguments);
    }
    ShapeL.prototype = new Shape();

    ShapeL.prototype.COLOR = '#FFA500';
    ShapeL.prototype.ORIENTATIONS = [
        [
            {x: 1, y: 0},
            {x: 0, y: 0},
            {x: -1, y: 0},
            {x: -1, y: 1}
        ],
        [
            {x: -1, y: -1},
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: 0, y: 1}
        ],
        [
            {x: 1, y: -1},
            {x: 1, y: 0},
            {x: 0, y: 0},
            {x: -1, y: 0}
        ],
        [
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: 0, y: 1},
            {x: 1, y: 1}
        ]
    ];


    function ShapeO(x, y, orientation) {
        this.x = 4;
        this.y = 18;

        this.init.apply(this, arguments);
    }
    ShapeO.prototype = new Shape();

    ShapeO.prototype.COLOR = '#FFFF00';
    ShapeO.prototype.ORIENTATIONS = [
        [
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 0, y: 1},
            {x: 1, y: 1}
        ]
    ];


    function ShapeS(x, y, orientation) {
        this.x = 4;
        this.y = 18;

        this.init.apply(this, arguments);
    }
    ShapeS.prototype = new Shape();

    ShapeS.prototype.COLOR = '#00FF00';
    ShapeS.prototype.ORIENTATIONS = [
        [
            {x: 1, y: 0},
            {x: 0, y: 0},
            {x: 0, y: 1},
            {x: -1, y: 1}
        ],
        [
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 1, y: 1}
        ]
    ];


    function ShapeT(x, y, orientation) {
        this.x = 4;
        this.y = 18;

        this.init.apply(this, arguments);
    }
    ShapeT.prototype = new Shape();

    ShapeT.prototype.COLOR = '#AA00FF';
    ShapeT.prototype.ORIENTATIONS = [
        [
            {x: -1, y: 0},
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 0, y: 1}
        ],
        [
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: -1, y: 0},
            {x: 0, y: 1}
        ],
        [
            {x: -1, y: 0},
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 0, y: -1}
        ],
        [
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 0, y: 1}
        ]
    ];


    function ShapeZ(x, y, orientation) {
        this.x = 4;
        this.y = 18;

        this.init.apply(this, arguments);
    }
    ShapeZ.prototype = new Shape();

    ShapeZ.prototype.COLOR = '#FF0000';
    ShapeZ.prototype.ORIENTATIONS = [
        [
            {x: -1, y: 0},
            {x: 0, y: 0},
            {x: 0, y: 1},
            {x: 1, y: 1}
        ],
        [
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: -1, y: 0},
            {x: -1, y: 1}
        ]
    ];


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
                context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

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


    Player = (function () {
        var exports = {},
            shape,
            availableShapes = [
                ShapeI,
                ShapeJ,
                ShapeL,
                ShapeO,
                ShapeS,
                ShapeT,
                ShapeZ
            ];


        function spawn() {
            var shapeNumber = Math.floor(Math.random() * availableShapes.length);
            shape = new availableShapes[shapeNumber]();
        }


        function init() {
            spawn();
        }
        exports.init = init;


        function destroy() {
            shape.destroy();
            shape = null;
        }
        exports.destroy = destroy;

        return exports;
    }());


    Control = (function () {
        var exports = {},
            running = true,
            timer;


        function start() {
            var shapes = [
                    new ShapeZ(1, 0),
                    new ShapeT(4, 0),
                    new ShapeI(6, 1, 1),
                    new ShapeO(7, 0),
                    new ShapeJ(9, 1, 1),
                    new ShapeJ(1, 2, 2),
                    new ShapeS(3, 2, 1),
                    new ShapeL(5, 3, 3),
                    new ShapeZ(8, 3),
                    new ShapeI(1, 3),
                    new ShapeT(1, 5, 2),
                    new ShapeJ(3, 4)
                ];

            Player.init();
            timer = setInterval(function () {
                Player.destroy();
                Player.init();
            }, 500);

            Score.reset();
            $tetris.addClass('running');
        }
        exports.start = start;


        function stop() {
            clearInterval(timer);
            Block.blocks = [];
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


    Control.start();
}(jQuery));
