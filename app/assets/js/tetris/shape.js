define(['tetris/render', 'tetris/block'], function (Render, Block) {
    'use strict';

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


    return Shape;
});
