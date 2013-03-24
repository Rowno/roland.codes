define(['tetris/shape', 'polyfill/object.create'], function (Shape) {
    'use strict';

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

    return ShapeL;
});
