'use strict';
const Path = require('path');

const Babelify = require('babelify');
const Browserify = require('browserify');
const Buffered = require('vinyl-buffer');
const Gulp = require('gulp');
const Gulpif = require('gulp-if');
const Livereload = require('gulp-livereload');
const MoldSourceMap = require('mold-source-map');
const Source = require('vinyl-source-stream');
const Uglify = require('gulp-uglify');
const Watchify = require('watchify');

const Common = require('./common');
const Nunjucksify = require('./nunjucksify');


function createBundle(bundle) {
    return bundle.bundle()
        .on('error', (error) => {
            console.error(error);
        })
        // Improve source map paths
        .pipe(MoldSourceMap.transformSources(file => `/source/${Path.relative('./app/', file)}`))
        // Convert text stream to vinyl file stream
        .pipe(Source('assets/js/index.js'))
        // Buffer the streamed file contents
        .pipe(Buffered())
        .pipe(Gulpif(Common.prod, Uglify()))
        .pipe(Gulp.dest(Common.dest, Common.mode))
        .pipe(Livereload());
}


Gulp.task('browserify', () => {
    let b = Browserify({
        entries: ['./app/assets/js/index.js'],
        transform: [
            Babelify.configure(),
            Nunjucksify,
        ],
        debug: true,
        cache: {},
        packageCache: {}
    });

    if (Common.watch) {
        b = Watchify(b);
        b.on('update', () => createBundle(b));
    }

    return createBundle(b);
});
