/*eslint-env node */
'use strict';
const Path = require('path');

const Assign = require('lodash.assign');
const Autoprefixer = require('gulp-autoprefixer');
const Babelify = require('babelify');
const Browserify = require('browserify');
const Buffered = require('vinyl-buffer');
const Changed = require('gulp-changed');
const Del = require('del');
const Express = require('express');
const FrontMatter = require('gulp-front-matter');
const Gulp = require('gulp');
const Gulpif = require('gulp-if');
const Gulpsmith = require('gulpsmith');
const Layouts = require('metalsmith-layouts');
const He = require('he');
const Livereload = require('gulp-livereload');
const Markdown = require('metalsmith-markdownit');
const MinifyCss = require('gulp-minify-css');
const Minimist = require('minimist');
const MoldSourceMap = require('mold-source-map');
const Permalinks = require('metalsmith-permalinks');
const RunSequence = require('run-sequence');
const Sass = require('gulp-sass');
const Source = require('vinyl-source-stream');
const Sourcemaps = require('gulp-sourcemaps');
const Swig = require('swig');
const Uglify = require('gulp-uglify');
const Watchify = require('watchify');

const internals = {};
internals.options = Minimist(process.argv);
internals.prod = internals.options.prod || process.env.NODE_ENV === 'production';
internals.watch = internals.options.watch;
internals.staticGlob = 'app/static/**/*';
internals.metalsmithGlob = 'app/content/**/*';
internals.sassGlob = 'app/assets/**/*.scss';
internals.templates = 'app/templates';
internals.dest = 'build';


Gulp.task('clean', cb => Del(internals.dest, cb));

Gulp.task('static', () => {
    return Gulp.src(internals.staticGlob)
        .pipe(Changed(internals.dest))
        .pipe(Gulp.dest(internals.dest))
        .pipe(Livereload());
});

Gulp.task('metalsmith', () => {
    Swig.setDefaults({ cache: false });
    Swig.setFilter('encode', input => He.encode(input, { encodeEverything: true }));

    const metalsmith = Gulpsmith()
        .metadata({
            email: 'hi@roland.codes'
        })
        .use(Markdown())
        .use(Permalinks({ pattern: ':title' }))
        .use(Layouts({
            engine: 'swig',
            directory: internals.templates
        }));

    return Gulp.src(internals.metalsmithGlob)
        .pipe(FrontMatter()).on('data', file => {
            Assign(file, file.frontMatter);
            delete file.frontMatter;
        })
        .pipe(metalsmith)
        .pipe(Gulp.dest(internals.dest))
        .pipe(Livereload());
});

Gulp.task('sass', () => {
    return Gulp.src(internals.sassGlob)
        .pipe(Sourcemaps.init())
        .pipe(Sass({ sourceComments: true }))
        .pipe(Autoprefixer())
        .pipe(Sourcemaps.write())
        .pipe(Gulpif(internals.prod, MinifyCss({ keepSpecialComments: 0 })))
        .pipe(Gulp.dest(Path.join(internals.dest, 'assets')))
        .pipe(Livereload());
});

Gulp.task('browserify', () => {
    let b = Browserify({
        entries: ['./app/assets/js/index.js'],
        transform: [Babelify],
        debug: true,
        cache: {},
        packageCache: {}
    });

    function createBundle(bundle) {
        return bundle.bundle()
            .pipe(MoldSourceMap.transformSources(file => '/source/' + Path.relative('./app/', file)))
            .pipe(Source('assets/js/index.js'))
            .pipe(Buffered())
            .pipe(Gulpif(internals.prod, Uglify()))
            .pipe(Gulp.dest(internals.dest))
            .pipe(Livereload());
    }

    if (internals.watch) {
        b = Watchify(b);
        b.on('update', () => createBundle(b));
    }

    return createBundle(b);
});

Gulp.task('build', callback => {
    return RunSequence('clean', ['static', 'metalsmith', 'sass', 'browserify'], () => {
        if (internals.watch) {
            Gulp.watch(internals.staticGlob, ['static']);

            Gulp.watch([
                internals.metalsmithGlob,
                internals.templates + '/**/*'
            ], ['metalsmith']);

            Gulp.watch(internals.sassGlob, ['sass']);

            Livereload.listen();
        }

        callback();
    });
});

Gulp.task('server', ['build'], callback => {
    const app = Express();
    app.use(Express.static('build'));
    app.listen(8000, callback);
});

Gulp.task('default', () => {
    internals.watch = true;
    Gulp.start('server');
});
