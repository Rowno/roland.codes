define(['tetris/shape', 'polyfill/object.create'], function (Shape) {
    'use strict';

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

    return ShapeZ;
});
