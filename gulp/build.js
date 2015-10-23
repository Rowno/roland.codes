'use strict';
const Gulp = require('gulp');
const Livereload = require('gulp-livereload');
const RunSequence = require('run-sequence');

const Common = require('./common');
require('./static');
require('./metalsmith');
require('./css');
require('./browserify');


Gulp.task('build', (callback) => {
    return RunSequence('clean', ['static', 'metalsmith', 'css', 'browserify'], () => {
        if (Common.watch) {
            Livereload.listen({
                key: Common.privateKey,
                cert: Common.certificate
            });
        }

        callback();
    });
});
