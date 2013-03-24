define(['tetris/shape', 'polyfill/object.create'], function (Shape) {
    'use strict';

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

    return ShapeJ;
});
