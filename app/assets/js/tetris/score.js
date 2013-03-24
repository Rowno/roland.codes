/**
 * Encapsulates the scoring functionality.
 *
 * Keeps track of the active score and the highscore.
 * Also deletes and moves the Block's when a row is completed.
 */
define([
    'tetris/html',
    'tetris/storage',
    'tetris/block',
    'tetris/grid'
], function ($tetris, Storage, Block, Grid) {
    'use strict';

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
     *
     * @param {Shape} playerShape The Player's current shape.
     */
    function check(playerShape) {
        var blocks = Block.getBlocks(),
            rowCounts = [],
            completeRows = [],
            i,
            j;

        // Initialise the rowCounts array to the number of rows.
        for (i = 0; i < Grid.ROWS; i += 1) {
            rowCounts.push(0);
        }

        // Count the number of Block's on each row.
        for (i = 0; i < blocks.length; i += 1) {
            rowCounts[blocks[i].y] += 1;
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
            for (j = 0; j < blocks.length; j += 1) {
                // Don't delete or move the Player's current Shape.
                if (playerShape.blocks.indexOf(blocks[j]) !== -1) {
                    continue;
                }

                if (blocks[j].y === completeRows[i] - i) {
                    blocks[j].destroy();
                    j -= 1;
                } else if (blocks[j].y > completeRows[i] - i) {
                    blocks[j].y -= 1;
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
});
