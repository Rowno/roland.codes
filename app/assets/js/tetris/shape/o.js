define(['tetris/shape', 'polyfill/object.create'], function (Shape) {
    'use strict';

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

    return ShapeO;
});
