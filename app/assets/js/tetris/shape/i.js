define(['tetris/shape', 'polyfill/object.create'], function (Shape) {
    'use strict';

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

    return ShapeI;
});
