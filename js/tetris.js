/*jslint browser:true */
/*globals jQuery:false, Modernizr:false */

/*
CONTENTS
========
Polyfills
Storage
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
Keyboard
Generator
Player
Sound
Control
*/

(function ($, Modernizr) {
    'use strict';

    var CANVAS_WIDTH = 120,
        CANVAS_HEIGHT = 240,
        PADDING = 1,
        $body = $('body'),
        $tetris = $('#tetris'),
        Storage,
        Grid,
        Score,
        Render,
        Keyboard,
        Generator,
        Player,
        Sound,
        Control;


    /**
     * Polyfills
     */

    // Array.isArray polyfills
    if (!Array.isArray) {
        Array.isArray = function (vArg) {
            return vArg.constructor === Array;
        };
    }

    // requestAnimationFrame polyfill
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

    // Object.create polyfill
    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }


    /**
     * Encapsulates localStorage persistent storage.
     *
     * Does feature detection, namespacing and JSON encoding.
     */
    Storage = (function () {
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
    }());


    /**
     * Abstracts the canvas from pixels to grid coordinates.
     *
     * The grid is zero based.
     */
    Grid = (function () {
        var exports = {},
            WIDTH = 12,
            HEIGHT = 12,
            COLUMNS = 10,
            ROWS = 22;

        exports.WIDTH = WIDTH; // Width of a single grid space.
        exports.HEIGHT = HEIGHT; // Height of a single grid space.
        exports.COLUMNS = COLUMNS; // Number of columns in the grid.
        exports.ROWS = ROWS; // Number of rows in the grid.

        /**
         * Converts the X coordinate to pixels.
         *
         * @param {number} x X coordinate.
         * @returns {number} Number of pixels.
         */
        function pixelX(x) {
            return x * WIDTH;
        }
        exports.pixelX = pixelX;

        /**
         * Converts the Y coordinate to pixels.
         *
         * @param {number} y Y coordinate.
         * @returns {number} Number of pixels.
         */
        function pixelY(y) {
            return y * HEIGHT;
        }
        exports.pixelY = pixelY;

        return exports;
    }());


    /**
     * Represents a single Tetris block.
     *
     * @param {string} color Valid CSS color value.
     * @param {number} x X Grid position.
     * @param {number} y Y Grid position.
     */
    function Block(color, x, y) {
        this.x = x;
        this.y = y;
        this.color = color;

        Block.blocks.push(this);
    }

    /**
     * Static array of all the instantiated Block's.
     */
    Block.blocks = [];

    Block.prototype.destroy = function () {
        var index = Block.blocks.indexOf(this);
        Block.blocks.splice(index, 1);
        Render.requestDraw();
    };

    /**
     * Draws the Block.
     *
     * @param {CanvasRenderingContext2D} context Canvas 2D drawing context.
     */
    Block.prototype.draw = function (context) {
        context.fillStyle = this.color;
        context.fillRect(
            Grid.pixelX(this.x) + PADDING,
            Grid.pixelY(this.y) + PADDING,
            Grid.WIDTH - PADDING * 2,
            Grid.HEIGHT - PADDING * 2
        );
    };

    (function () {
        function BoundaryCollision(boundary) {
            this.name = 'BoundaryCollision';
            this.boundary = boundary;
        }

        function BlockCollision(block) {
            this.name = 'BlockCollision';
            this.block = block;
        }

        /**
         * Checks if the Block has collided with another Block or has crossed
         * the Grid boundary.
         *
         * @returns {boolean} False if the Block hasn't collided with anything.
         * @throws {BoundaryCollision} If the Block has crossed a Grid boundary.
         * @throws {BlockCollision} If the Block has collided with another Block.
         */
        Block.prototype.checkCollision = function () {
            if (this.x < 0) {
                throw new BoundaryCollision(4);
            }

            if (this.y < 0) {
                throw new BoundaryCollision(1);
            }

            if (this.x >= Grid.COLUMNS) {
                throw new BoundaryCollision(2);
            }

            if (this.y >= Grid.ROWS) {
                throw new BoundaryCollision(3);
            }

            for (var i = 0; i < Block.blocks.length; i += 1) {
                // Block can't collide with itself.
                if (this === Block.blocks[i]) {
                    continue;
                }

                if (this.x === Block.blocks[i].x && this.y === Block.blocks[i].y) {
                    throw new BlockCollision(Block.blocks[i]);
                }
            }

            return false;
        };
    }());


    /**
     * An abstract object representing a Tetris shape.
     *
     * This object shouldn't be instantiated directly.
     *
     * Inheriting Shape objects must implement the ORIENTATIONS and COLOR
     * properties and must execute `Shape.apply(this, arguments);` in their
     * constructor.
     *
     * @param {number} x [optional] X Grid position.
     * @param {number} y [optional] Y Grid position.
     * @param {number} orientation [optional] The initial orientation of the Shape.
     */
    function Shape(x, y, orientation) {
        var positions,
            i;

        if (x === undefined) {
            this.x = 4;
            this.y = 20;
        } else {
            this.x = x;
            this.y = y;
        }

        this.orientation = orientation || 0;
        this.blocks = [];

        positions = this.ORIENTATIONS[this.orientation];

        for (i = 0; i < positions.length; i += 1) {
            this.blocks.push(new Block(
                this.COLOR,
                this.x + positions[i].x,
                this.y + positions[i].y
            ));

        }

        Render.requestDraw();
    }

    Shape.prototype.destroy = function () {
        for (var i = 0; i < this.blocks.length; i += 1) {
            this.blocks[i].destroy();
        }
    };

    /**
     * Rotates the Shape clockwise.
     *
     * @throws {BoundaryCollision|BlockCollision} If the Shape collided with
     *                                            anything while rotating.
     */
    Shape.prototype.rotate = function () {
        var positions,
            prevOrientation = this.orientation,
            i;

        this.orientation += 1;

        if (this.orientation === this.ORIENTATIONS.length) {
            this.orientation = 0;
        }

        positions = this.ORIENTATIONS[this.orientation];

        for (i = 0; i < positions.length; i += 1) {
            this.blocks[i].x = this.x + positions[i].x;
            this.blocks[i].y = this.y + positions[i].y;
        }

        try {
            for (i = 0; i < this.blocks.length; i += 1) {
                this.blocks[i].checkCollision();
            }
        } catch (exception) {
            // Revert the rotation on collision.
            this.orientation = prevOrientation;
            positions = this.ORIENTATIONS[this.orientation];

            for (i = 0; i < positions.length; i += 1) {
                this.blocks[i].x = this.x + positions[i].x;
                this.blocks[i].y = this.y + positions[i].y;
            }

            throw exception;
        }

        Render.requestDraw();
    };

    /**
     * Moves the Shape in the given direction.
     *
     * @param {number} x Relative X amount to move by (+/-).
     * @param {number} y Relative Y amount to move by (+/-).
     * @throws {BoundaryCollision|BlockCollision} If the Shape collided with
     *                                            anything while moving.
     */
    Shape.prototype.move = function (x, y) {
        var i;

        for (i = 0; i < this.blocks.length; i += 1) {
            this.blocks[i].x += x;
            this.blocks[i].y += y;
        }

        try {
            for (i = 0; i < this.blocks.length; i += 1) {
                this.blocks[i].checkCollision();
            }
        } catch (exception) {
            // Revert the move on collision.
            for (i = 0; i < this.blocks.length; i += 1) {
                this.blocks[i].x += x * -1;
                this.blocks[i].y += y * -1;
            }

            throw exception;
        }

        this.x += x;
        this.y += y;

        Render.requestDraw();
    };


    function ShapeI() {
        Shape.apply(this, arguments);
    }
    ShapeI.prototype = Object.create(Shape.prototype);

    ShapeI.prototype.COLOR = '#00FFFF';
    ShapeI.prototype.ORIENTATIONS = [
        [
            {x: -1, y: 0},
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 2, y: 0}
        ], [
            {x: 0, y: -2},
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: 0, y: 1}
        ], [
            {x: -1, y: -1},
            {x: 0, y: -1},
            {x: 1, y: -1},
            {x: 2, y: -1}
        ], [
            {x: 1, y: -2},
            {x: 1, y: -1},
            {x: 1, y: 0},
            {x: 1, y: 1}
        ]
    ];


    function ShapeJ() {
        Shape.apply(this, arguments);
    }
    ShapeJ.prototype = Object.create(Shape.prototype);

    ShapeJ.prototype.COLOR = '#0000FF';
    ShapeJ.prototype.ORIENTATIONS = [
        [
            {x: 1, y: 0},
            {x: 0, y: 0},
            {x: -1, y: 0},
            {x: 1, y: 1}
        ], [
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: 0, y: 1},
            {x: -1, y: 1}
        ], [
            {x: -1, y: -1},
            {x: -1, y: 0},
            {x: 0, y: 0},
            {x: 1, y: 0}
        ], [
            {x: 1, y: -1},
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: 0, y: 1}
        ]
    ];


    function ShapeL() {
        Shape.apply(this, arguments);
    }
    ShapeL.prototype = Object.create(Shape.prototype);

    ShapeL.prototype.COLOR = '#FFA500';
    ShapeL.prototype.ORIENTATIONS = [
        [
            {x: 1, y: 0},
            {x: 0, y: 0},
            {x: -1, y: 0},
            {x: -1, y: 1}
        ], [
            {x: -1, y: -1},
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: 0, y: 1}
        ], [
            {x: 1, y: -1},
            {x: 1, y: 0},
            {x: 0, y: 0},
            {x: -1, y: 0}
        ], [
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: 0, y: 1},
            {x: 1, y: 1}
        ]
    ];


    function ShapeO() {
        Shape.apply(this, arguments);
    }
    ShapeO.prototype = Object.create(Shape.prototype);

    ShapeO.prototype.COLOR = '#FFFF00';
    ShapeO.prototype.ORIENTATIONS = [
        [
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 0, y: 1},
            {x: 1, y: 1}
        ]
    ];


    function ShapeS() {
        Shape.apply(this, arguments);
    }
    ShapeS.prototype = Object.create(Shape.prototype);

    ShapeS.prototype.COLOR = '#00FF00';
    ShapeS.prototype.ORIENTATIONS = [
        [
            {x: 1, y: 0},
            {x: 0, y: 0},
            {x: 0, y: 1},
            {x: -1, y: 1}
        ], [
            {x: -1, y: -1},
            {x: -1, y: 0},
            {x: 0, y: 0},
            {x: 0, y: 1}
        ], [
            {x: 1, y: -1},
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: -1, y: 0}
        ], [
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 1, y: 1}
        ]
    ];


    function ShapeT() {
        Shape.apply(this, arguments);
    }
    ShapeT.prototype = Object.create(Shape.prototype);

    ShapeT.prototype.COLOR = '#AA00FF';
    ShapeT.prototype.ORIENTATIONS = [
        [
            {x: -1, y: 0},
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 0, y: 1}
        ], [
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: -1, y: 0},
            {x: 0, y: 1}
        ], [
            {x: -1, y: 0},
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 0, y: -1}
        ], [
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 0, y: 1}
        ]
    ];


    function ShapeZ() {
        Shape.apply(this, arguments);
    }
    ShapeZ.prototype = Object.create(Shape.prototype);

    ShapeZ.prototype.COLOR = '#FF0000';
    ShapeZ.prototype.ORIENTATIONS = [
        [
            {x: -1, y: 0},
            {x: 0, y: 0},
            {x: 0, y: 1},
            {x: 1, y: 1}
        ], [
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: -1, y: 0},
            {x: -1, y: 1}
        ], [
            {x: -1, y: -1},
            {x: 0, y: -1},
            {x: 0, y: 0},
            {x: 1, y: 0}
        ], [
            {x: 1, y: -1},
            {x: 1, y: 0},
            {x: 0, y: 0},
            {x: 0, y: 1}
        ]
    ];


    /**
     * Encapsulates the scoring functionality.
     *
     * Keeps track of the active score and the highscore.
     * Also deletes and moves the Block's when a row is completed.
     */
    Score = (function () {
        var exports = {},
            ROW_COMPLETE_SCORES = [40, 100, 300, 1200],
            score = 0,
            highscore = Storage.get('highscore') || 0,
            $score = $tetris.find('.score .count'),
            $highscore = $tetris.find('.highscore .count');

        $score.text(score);
        $highscore.text(highscore);

        /**
         * Updates the score UI and saves the highscore.
         *
         * @private
         */
        function update() {
            $score.text(score);

            if (score > highscore) {
                highscore = score;
                Storage.set('highscore', highscore);
                $highscore.text(highscore);
            }
        }

        /**
         * Checks for completed rows.
         *
         * Also deletes and moves the Block's when completed rows are found.
         */
        function check() {
            var rowCounts = [],
                completeRows = [],
                i,
                j;

            // Initialise the rowCounts array to the number of rows.
            for (i = 0; i < Grid.ROWS; i += 1) {
                rowCounts.push(0);
            }

            // Count the number of Block's on each row.
            for (i = 0; i < Block.blocks.length; i += 1) {
                rowCounts[Block.blocks[i].y] += 1;
            }

            // Check for complete rows.
            for (i = 0; i < rowCounts.length; i += 1) {
                if (rowCounts[i] === Grid.COLUMNS) {
                    completeRows.push(i);
                }
            }

            // For each completed row, delete all the Block's on that row and
            // move up all the Block's under it.
            for (i = 0; i < completeRows.length; i += 1) {
                for (j = 0; j < Block.blocks.length; j += 1) {
                    // Don't delete or move the Player's current Shape.
                    if (Player.getShape().blocks.indexOf(Block.blocks[j]) !== -1) {
                        continue;
                    }

                    if (Block.blocks[j].y === completeRows[i] - i) {
                        Block.blocks[j].destroy();
                        j -= 1;
                    } else if (Block.blocks[j].y > completeRows[i] - i) {
                        Block.blocks[j].y -= 1;
                    }
                }
            }

            // Add the score for the number of rows completed.
            if (completeRows.length > 0) {
                score += ROW_COMPLETE_SCORES[completeRows.length - 1];
            }

            update();
        }
        exports.check = check;

        /**
         * Adds the score for a soft drop.
         *
         * @param {number} dropAmount Number of rows that the shape dropped.
         */
        function softDrop(dropAmount) {
            score += dropAmount;
            update();
        }
        exports.softDrop = softDrop;

        /**
         * Resets the active score to zero.
         */
        function reset() {
            score = 0;
            update();
        }
        exports.reset = reset;

        return exports;
    }());


    /**
     * Handles rendering of all the game objects.
     *
     * Which is really just Block's.
     */
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

        /**
         * Requests the game to be drawn.
         *
         * This method can be executed as many times as necessary without any
         * huge performance hit. As only one animation frame will be requested
         * at a time.
         */
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


    /**
     * Handles keyboard key events and normalises the key repeat rate.
     */
    Keyboard = (function () {
        var exports = {},
            REPEAT_DEFAULT = 100,
            keys = {},
            pressedKeys = {};

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
    }());


    /**
     * Generates random Shape's.
     *
     * Uses the Tetris 'Random Generator' algorithm. A queue of unique Shape's
     * types is used to get the best even, random distribution of Shape's.
     */
    Generator = (function () {
        var exports = {},
            availableShapes = [
                ShapeI,
                ShapeJ,
                ShapeL,
                ShapeO,
                ShapeS,
                ShapeT,
                ShapeZ
            ],
            shapeQueue = [];

        /**
         * Randomly fills up the queue with all the possible unique shapes.
         *
         * @private
         */
        function fillQueue() {
            var shapeNumber;

            while (shapeQueue.length < availableShapes.length) {
                shapeNumber = Math.floor(Math.random() * availableShapes.length);

                if (shapeQueue.indexOf(shapeNumber) === -1) {
                    shapeQueue.push(shapeNumber);
                }
            }
        }

        /**
         * Generates a random Shape.
         *
         * @returns {Shape} A random Shape type instance.
         */
        function generate() {
            if (shapeQueue.length === 0) {
                fillQueue();
            }

            return new availableShapes[shapeQueue.pop()]();
        }
        exports.generate = generate;

        return exports;
    }());


    /**
     * Handles the player controlled Shape.
     */
    Player = (function () {
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
                        Score.check();
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
    }());


    /**
     * Handles the game's sound.
     *
     * Doesn't do anything if the browser doesn't support HTML5 Audio.
     */
    Sound = (function () {
        var exports = {},
            audio = $tetris.find('audio').get(0),
            sound = Storage.get('sound') || false,
            $sound = $tetris.find('.sound');

        function renderButton() {
            if (sound) {
                $sound.attr('title', 'Disable sound');
                $sound.find('i')
                    .removeClass('icon-volume-off')
                    .addClass('icon-volume-up');
            } else {
                $sound.attr('title', 'Enable sound');
                $tetris.find('.sound i')
                    .removeClass('icon-volume-up')
                    .addClass('icon-volume-off');
            }
        }

        /**
         * Starts the sound.
         *
         * Doesn't necessarily cause sound to start *playing*, as the sound
         * preference could be disabled by the user.
         */
        function start() {
            if (!Modernizr.audio) {
                return;
            }

            if (sound) {
                audio.play();
            }
        }
        exports.start = start;

        /**
         * Stops the sound.
         */
        function stop() {
            if (!Modernizr.audio) {
                return;
            }

            if (sound) {
                audio.pause();
            }

            if (audio.currentTime > 0) {
                audio.currentTime = 0;
            }
        }
        exports.stop = stop;

        if (Modernizr.audio) {
            // Register sound preference toggle button.
            $sound.on('click', function () {
                if (sound) {
                    sound = false;
                    audio.pause();
                } else {
                    sound = true;
                    audio.play();
                }

                Storage.set('sound', sound);
                renderButton();
            });

            // Initial render of the sound button.
            renderButton();
        }

        return exports;
    }());


    /**
     * Main control for starting and stopping the game.
     *
     * Also handles the game help information.
     */
    Control = (function () {
        var exports = {},
            running = true,
            helpActive = false,
            $helpButton = $tetris.find('.help-button'),
            $helpBox = $tetris.find('.help-box');

        /**
         * Starts the game.
         */
        function start() {
            var shapes = [
                    new ShapeZ(1, 0),
                    new ShapeT(4, 0),
                    new ShapeI(6, 2, 1),
                    new ShapeO(7, 0),
                    new ShapeJ(9, 1, 1),
                    new ShapeJ(1, 2, 2),
                    new ShapeS(4, 2, 1),
                    new ShapeL(5, 3, 3),
                    new ShapeZ(8, 3),
                    new ShapeI(1, 3),
                    new ShapeT(1, 5, 2),
                    new ShapeJ(3, 4)
                ];

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
            Block.blocks = [];
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
                Control.stop();
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
        $tetris.find('img').off('click');

        // Register handler to start the game.
        $tetris.find('img').on('click', function () {
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
    }());


    // Initial start of the game.
    Control.start();
}(jQuery, Modernizr));
