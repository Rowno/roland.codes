define(['tetris/shape', 'polyfill/object.create'], function (Shape) {
    'use strict';

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

    return ShapeS;
});
