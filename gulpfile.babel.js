'use strict';
const Alex = require('gulp-alex');
const Del = require('del');
const Eslint = require('gulp-eslint');
const Gulp = require('gulp');

const Common = require('./gulp/common');
require('./gulp/server');
require('./gulp/build');


Gulp.task('clean', () => Del(Common.dest));

Gulp.task('alex', () => {
    return Gulp.src([
        'app/**/*.md',
        'README.md',
    ])
    .pipe(Alex());
});

Gulp.task('lint', () => {
    return Gulp.src([
        'app/**/*.js',
        '!app/**/vendor/**/*',
        '!app/static/demos/**/*',
        'gulpfile.babel.js',
        'gulp/**/*.js',
    ])
    .pipe(Eslint())
    .pipe(Eslint.format())
    .pipe(Eslint.failOnError());
});

Gulp.task('default', () => {
    Common.watch = true;
    Gulp.start('server');
});
