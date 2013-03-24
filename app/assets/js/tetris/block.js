define([
    'tetris/constants',
    'tetris/render',
    'tetris/grid'
], function (Constants, Render, Grid) {
    'use strict';

    var blocks;


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

        blocks.push(this);
    }


    /**
     * Resets the internal Block array.
     */
    function reset() {
        /**
         * Static array of all the instantiated Block's.
         */
        blocks = [];
        Render.setBlocks(blocks);
    }
    Block.reset = reset;
    reset();

    /**
     * Gets all the Block's.
     *
     * @returns {Array.<Block>}
     */
    function getBlocks() {
        return blocks;
    }
    Block.getBlocks = getBlocks;


    Block.prototype.destroy = function () {
        var index = blocks.indexOf(this);
        blocks.splice(index, 1);
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
            Grid.pixelX(this.x) + Constants.get('PADDING'),
            Grid.pixelY(this.y) + Constants.get('PADDING'),
            Grid.WIDTH - Constants.get('PADDING') * 2,
            Grid.HEIGHT - Constants.get('PADDING') * 2
        );
    };

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

        for (var i = 0; i < blocks.length; i += 1) {
            // Block can't collide with itself.
            if (this === blocks[i]) {
                continue;
            }

            if (this.x === blocks[i].x && this.y === blocks[i].y) {
                throw new BlockCollision(blocks[i]);
            }
        }

        return false;
    };

    return Block;
});
