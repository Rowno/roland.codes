'use strict';
const Path = require('path');

const Autoprefixer = require('autoprefixer');
const Gulp = require('gulp');
const Gulpif = require('gulp-if');
const Livereload = require('gulp-livereload');
const MinifyCss = require('gulp-minify-css');
const PostCss = require('gulp-postcss');
const Sass = require('gulp-sass');
const Sourcemaps = require('gulp-sourcemaps');

const Common = require('./common');

const taskGlob = 'app/assets/**/*.scss';
let watching = false;


Gulp.task('css', () => {
    if (!watching && Common.watch) {
        Gulp.watch(taskGlob, ['css']);
        watching = true;
    }

    return Gulp.src(taskGlob)
        .pipe(Sourcemaps.init())
        .pipe(Sass({ sourceComments: true }))
        .pipe(PostCss([Autoprefixer()]))
        .pipe(Sourcemaps.write())
        .pipe(Gulpif(Common.prod, MinifyCss({ keepSpecialComments: 0 })))
        .pipe(Gulp.dest(Path.join(Common.dest, 'assets'), Common.mode))
        .pipe(Livereload());
});
