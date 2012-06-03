/*jslint browser:true */
/*globals jQuery:false */

/*
 CONTENTS
 ========
 Grid
 Collision
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
 Keyboard
 Player
 Control
*/

(function ($) {
    'use strict';

    var CANVAS_WIDTH = 120,
        CANVAS_HEIGHT = 240,
        PADDING = 1,
        $body = $('body'),
        $tetris = $('#tetris'),
        Grid,
        Collision,
        Score,
        Render,
        Keyboard,
        Player,
        Control;


    // Array.isArray polyfill
    if (!Array.isArray) {
        Array.isArray = function (vArg) {
            return vArg.constructor === Array;
        };
    }


    Grid = (function () {
        var exports = {},
            WIDTH = 12,
            HEIGHT = 12,
            COLUMNS = 10,
            ROWS = 20;

        exports.WIDTH = WIDTH;
        exports.HEIGHT = HEIGHT;
        exports.COLUMNS = COLUMNS;
        exports.ROWS = ROWS;


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


    Collision = (function () {
        var exports = {};


        function BoundaryCollision() {
            this.name = 'BoundaryCollision';
        }

        function BlockCollision() {
            this.name = 'BlockCollision';
        }


        function checkBlock(block) {
            if (!(block.x >= 0 &&
                block.y >= 0 &&
                block.x < Grid.COLUMNS &&
                block.y < Grid.ROWS)) {
                throw new BoundaryCollision();
            }

            Block.blocks.forEach(function (otherBlock) {
                if (block === otherBlock) {
                    return;
                }

                if (block.x === otherBlock.x && block.y === otherBlock.y) {
                    throw new BlockCollision();
                }
            });
        }


        function check(blocks) {
            if (Array.isArray(blocks)) {
                blocks.forEach(function (block) {
                    checkBlock(block);
                });
            } else {
                checkBlock(blocks);
            }

            return false;
        }
        exports.check = check;

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
        var that = this,
            prevOrientation = this.orientation,
            prevBlockPositions = [];

        this.orientation += 1;

        if (this.orientation === this.ORIENTATIONS.length) {
            this.orientation = 0;
        }

        this.ORIENTATIONS[this.orientation].forEach(function (position, index) {
            prevBlockPositions.push({
                x: that.blocks[index].x,
                y: that.blocks[index].y
            });

            that.blocks[index].x = that.x + position.x;
            that.blocks[index].y = that.y + position.y;
        });

        try {
            Collision.check(this.blocks);
        } catch (exception) {
            prevBlockPositions.forEach(function (position, index) {
                that.blocks[index].x = position.x;
                that.blocks[index].y = position.y;
            });

            this.orientation = prevOrientation;

            throw exception;
        }

        Render.requestDraw();
    };

    Shape.prototype.move = function (x, y) {
        var that = this,
            prevBlocksPosition = [];


        this.blocks.forEach(function (block) {
            prevBlocksPosition.push({
                x: block.x,
                y: block.y
            });

            block.x += x;
            block.y += y;
        });

        try {
            Collision.check(this.blocks);
        } catch (exception) {
            prevBlocksPosition.forEach(function (position, index) {
                that.blocks[index].x = position.x;
                that.blocks[index].y = position.y;
            });

            throw exception;
        }

        this.x += x;
        this.y += y;

        Render.requestDraw();
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


    Keyboard = (function () {
        var exports = {},
            REPEAT_DEFAULT = 100,
            keys = {},
            pressedKeys = {};


        function keydown(event) {
            if ($(event.target).is(':input')) {
                return;
            }

            if (pressedKeys[event.which]) {
                return false;
            }

            if (keys[event.which]) {
                if (typeof keys[event.which].press === 'function') {
                    pressedKeys[event.which] = setInterval(
                        keys[event.which].press,
                        keys[event.which].repeat || REPEAT_DEFAULT
                    );

                    keys[event.which].press();
                } else {
                    pressedKeys[event.which] = true;
                }

                if (typeof keys[event.which].down === 'function') {
                    keys[event.which].down();
                }

                return false;
            }
        }


        function keyup(event) {
            if (keys[event.which]) {
                if (keys[event.which].press) {
                    clearInterval(pressedKeys[event.which]);
                }

                if (typeof keys[event.which].up === 'function') {
                    keys[event.which].up();
                }

                delete pressedKeys[event.which];
            }
        }


        function register(options) {
            keys[options.key] = options;
        }
        exports.register = register;


        function start() {
            $body.on('keydown', keydown);
            $body.on('keyup', keyup);
        }
        exports.start = start;


        function stop() {
            $body.off('keydown', keydown);
            $body.off('keyup', keyup);
        }
        exports.stop = stop;

        return exports;
    }());


    Player = (function () {
        var exports = {},
            SPEED_NORMAL = 500,
            SPEED_FAST = 75,
            shape,
            availableShapes = [
                ShapeI,
                ShapeJ,
                ShapeL,
                ShapeO,
                ShapeS,
                ShapeT,
                ShapeZ
            ],
            timer;


        // up arrow
        Keyboard.register({
            key: 38,
            down: function () {
                clearInterval(timer);
            },
            press: function () {
                moveForward();
            },
            up: function () {
                timer = setInterval(moveForward, SPEED_NORMAL);
            },
            repeat: SPEED_FAST
        });

        // right arrow
        Keyboard.register({
            key: 39,
            press: function () {
                try {
                    shape.move(1, 0);
                } catch (exception) {}
            }
        });

        // down arrow
        Keyboard.register({
            key: 40,
            down: function () {
                try {
                    shape.rotate();
                } catch (exception) {}
            }
        });

        // left arrow
        Keyboard.register({
            key: 37,
            press: function () {
                try {
                    shape.move(-1, 0);
                } catch (exception) {}
            }
        });

        // escape
        Keyboard.register({
            key: 27,
            down: function () {
                Control.stop();
            }
        });


        function moveForward() {
            try {
                shape.move(0, -1);
            } catch (exception) {
                if (exception.name === 'BlockCollision') {
                    spawn();
                }
            }
        }


        function spawn() {
            var shapeNumber = Math.floor(Math.random() * availableShapes.length);
            shape = new availableShapes[shapeNumber]();
        }


        function init() {
            spawn();
        }
        exports.init = init;


        function destroy() {
            shape = null;
            clearInterval(timer);
        }
        exports.destroy = destroy;


        timer = setInterval(moveForward, SPEED_NORMAL);

        return exports;
    }());


    Control = (function () {
        var exports = {},
            running = true;


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

            Keyboard.start();
            Player.init();
            Score.reset();

            running = true;
            $tetris.addClass('running');
        }
        exports.start = start;


        function stop() {
            Block.blocks = [];
            Keyboard.stop();
            Player.destroy();

            running = false;
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
        });

        return exports;
    }());


    Control.start();
}(jQuery));