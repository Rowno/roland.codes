'use strict';
const Changed = require('gulp-changed');
const Gulp = require('gulp');
const Livereload = require('gulp-livereload');

const Common = require('./common');

const taskGlob = 'app/static/**/*';
let watching = false;


Gulp.task('static', () => {
    if (!watching && Common.watch) {
        Gulp.watch(taskGlob, ['static']);
        watching = true;
    }

    return Gulp.src(taskGlob)
        .pipe(Changed(Common.dest))
        .pipe(Gulp.dest(Common.dest, Common.mode))
        .pipe(Livereload());
});
