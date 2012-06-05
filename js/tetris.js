/*jslint browser:true */
/*globals jQuery:false, Modernizr:false */

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

(function ($, Modernizr) {
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


    /**
     * Array.isArray polyfill
     */
    if (!Array.isArray) {
        Array.isArray = function (vArg) {
            return vArg.constructor === Array;
        };
    }


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


        function BoundaryCollision(boundary) {
            this.name = 'BoundaryCollision';
            this.boundary = boundary;
        }

        function BlockCollision() {
            this.name = 'BlockCollision';
        }


        function checkBlock(block) {
            if (block.x < 0) {
                throw new BoundaryCollision(4);
            }

            if (block.y < 0) {
                throw new BoundaryCollision(1);
            }

            if (block.x >= Grid.COLUMNS) {
                throw new BoundaryCollision(2);
            }

            if (block.y >= Grid.ROWS) {
                throw new BoundaryCollision(3);
            }

            for (var i = 0; i < Block.blocks.length; i += 1) {
                if (block === Block.blocks[i]) {
                    return;
                }

                if (block.x === Block.blocks[i].x && block.y === Block.blocks[i].y) {
                    throw new BlockCollision();
                }
            }
        }


        function check(blocks) {
            if (Array.isArray(blocks)) {
                for (var i = 0; i < blocks.length; i += 1) {
                    checkBlock(blocks[i]);
                }
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
        Render.requestDraw();
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
        var that = this,
            positions,
            i;

        if (x !== undefined) {
            this.x = x;
            this.y = y;
        }

        this.orientation = orientation || 0;
        this.blocks = [];

        positions = this.ORIENTATIONS[this.orientation];

        for (i = 0; i < positions.length; i += 1) {
            that.blocks.push(new Block(
                that.COLOR,
                that.x + positions[i].x,
                that.y + positions[i].y
            ));

        }

        Render.requestDraw();
    };

    Shape.prototype.destroy = function () {
        for (var i = 0; i < this.blocks.length; i += 1) {
            this.blocks[i].destroy();
        }
    };

    Shape.prototype.rotate = function () {
        var that = this,
            positions,
            prevOrientation = this.orientation,
            prevBlockPositions = [],
            i;

        this.orientation += 1;

        if (this.orientation === this.ORIENTATIONS.length) {
            this.orientation = 0;
        }

        positions = this.ORIENTATIONS[this.orientation];

        for (i = 0; i < positions.length; i += 1) {
            prevBlockPositions.push({
                x: that.blocks[i].x,
                y: that.blocks[i].y
            });

            that.blocks[i].x = that.x + positions[i].x;
            that.blocks[i].y = that.y + positions[i].y;
        }

        try {
            Collision.check(this.blocks);
        } catch (exception) {
            for (i = 0; i < prevBlockPositions.length; i += 1) {
                that.blocks[i].x = prevBlockPositions[i].x;
                that.blocks[i].y = prevBlockPositions[i].y;
            }

            this.orientation = prevOrientation;

            throw exception;
        }

        Render.requestDraw();
    };

    Shape.prototype.move = function (x, y) {
        var that = this,
            prevBlocksPosition = [],
            i;


        for (i = 0; i < this.blocks.length; i += 1) {
            prevBlocksPosition.push({
                x: this.blocks[i].x,
                y: this.blocks[i].y
            });

            this.blocks[i].x += x;
            this.blocks[i].y += y;
        }

        try {
            Collision.check(this.blocks);
        } catch (exception) {
            for (i = 0; i < prevBlocksPosition.length; i += 1) {
                that.blocks[i].x = prevBlocksPosition[i].x;
                that.blocks[i].y = prevBlocksPosition[i].y;
            }

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
            ROW_COMPLETE = 100,
            score = 0,
            highscore,
            $score = $tetris.find('.score .count'),
            $highscore = $tetris.find('.highscore .count');


        $score.text(score);

        if (Modernizr.localstorage) {
            highscore = localStorage.highscore || 0;
            $highscore.text(highscore);
        }


        function update() {
            $score.text(score);

            if (Modernizr.localstorage && score > highscore) {
                highscore = score;
                localStorage.highscore = highscore;
                $highscore.text(highscore);
            }
        }


        function check() {
            var rowCounts = {},
                completeRows = [],
                i,
                j;


            for (i = 0; i < Block.blocks.length; i += 1) {

                if (rowCounts[Block.blocks[i].y]) {
                    rowCounts[Block.blocks[i].y] += 1;
                } else {
                    rowCounts[Block.blocks[i].y] = 1;
                }
            }

            for (i in rowCounts) {
                if (rowCounts[i] === Grid.COLUMNS) {
                    completeRows.push(i);
                    score += ROW_COMPLETE;
                }
            }

            for (i = 0; i < Block.blocks.length; i += 1) {
                for (j = 0; j < completeRows.length; j += 1) {
                    if (Block.blocks[i].y === parseInt(completeRows[j], 10)) {
                        Block.blocks[i].destroy();
                        i -= 1;
                    }
                }
            }

            update();
        }
        exports.check = check;


        function reset() {
            score = 0;
            update();
        }
        exports.reset = reset;

        return exports;
    }());


    Render = (function () {
        var exports = {},
            context = $tetris.find('canvas').get(0).getContext('2d'),
            queued = false,
            drawing = false;


        function draw() {
            drawing = true;

            window.requestAnimationFrame(function () {
                context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

                for (var i = 0; i < Block.blocks.length; i += 1) {
                    Block.blocks[i].draw(context);
                }

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


        function on(options) {
            keys[options.key] = options;
        }
        exports.on = on;


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


        function start() {
            $body.on('keydown', keydown);
            $body.on('keyup', keyup);
        }
        exports.start = start;


        function stop() {
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
    }());


    Player = (function () {
        var exports = {},
            SPEED_NORMAL = 500,
            SPEED_FAST = 75,
            shape,
            shapeMoves = 0,
            availableShapes = [
                ShapeI,
                ShapeJ,
                ShapeL,
                ShapeO,
                ShapeS,
                ShapeT,
                ShapeZ
            ],
            forwardTimer,
            keys = [];


        keys.push({ // up arrow
            key: 38,
            down: function () {
                clearInterval(forwardTimer);
            },
            press: function () {
                moveForward();
            },
            up: function () {
                forwardTimer = setInterval(moveForward, SPEED_NORMAL);
            },
            repeat: SPEED_FAST
        });

        keys.push({ // right arrow
            key: 39,
            press: function () {
                try {
                    shape.move(1, 0);
                } catch (exception) {}
            }
        });

        keys.push({ // down arrow
            key: 40,
            down: function () {
                try {
                    shape.rotate();
                } catch (exception) {}
            }
        });

        keys.push({ // left arrow
            key: 37,
            press: function () {
                try {
                    shape.move(-1, 0);
                } catch (exception) {}
            }
        });


        function moveForward() {
            try {
                shape.move(0, -1);
                shapeMoves += 1;
            } catch (exception) {
                if (exception.name === 'BlockCollision') {
                    if (shapeMoves === 0) {
                        stop();
                    } else {
                        spawn();
                        Score.check();
                    }
                }
            }
        }


        function spawn() {
            var shapeNumber = Math.floor(Math.random() * availableShapes.length);
            shapeMoves = 0;
            shape = new availableShapes[shapeNumber]();
        }


        function start() {
            spawn();

            for (var i = 0; i < keys.length; i += 1) {
                Keyboard.on(keys[i]);
            }

            forwardTimer = setInterval(moveForward, SPEED_NORMAL);
        }
        exports.start = start;


        function stop() {
            for (var i = 0; i < keys.length; i += 1) {
                Keyboard.off(keys[i].key);
            }

            shape = null;
            clearInterval(forwardTimer);
        }
        exports.stop = stop;

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
            Player.start();

            running = true;
            $tetris.addClass('running');
        }
        exports.start = start;


        function stop() {
            Block.blocks = [];
            Keyboard.stop();
            Player.stop();
            Score.reset();

            running = false;
            $tetris.removeClass('running');
        }
        exports.stop = stop;


        // escape
        Keyboard.on({
            key: 27,
            down: function () {
                Control.stop();
            }
        });


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
}(jQuery, Modernizr));
