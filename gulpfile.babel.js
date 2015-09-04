/*eslint-env node */
'use strict';
const Fs = require('fs');
const Path = require('path');

const Assign = require('lodash.assign');
const Autoprefixer = require('gulp-autoprefixer');
const Babelify = require('babelify');
const Browserify = require('browserify');
const Buffered = require('vinyl-buffer');
const Changed = require('gulp-changed');
const Cheerio = require('cheerio');
const Collections = require('metalsmith-collections');
const Del = require('del');
const Express = require('express');
const FrontMatter = require('gulp-front-matter');
const Globby = require('globby');
const Gulp = require('gulp');
const Gulpif = require('gulp-if');
const Gulpsmith = require('gulpsmith');
const He = require('he');
const Layouts = require('metalsmith-layouts');
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
internals.svgs = {};


// Load svgs into variables so they can be inlined using metalsmith
Globby.sync('app/static/assets/images/*.svg').forEach(path => {
    var name = Path.basename(path, '.svg');
    internals.svgs[name] = Fs.readFileSync(path, { encoding: 'utf8' });
});


Gulp.task('clean', () => Del(internals.dest));

Gulp.task('static', () => {
    return Gulp.src(internals.staticGlob)
        .pipe(Changed(internals.dest))
        .pipe(Gulp.dest(internals.dest))
        .pipe(Livereload());
});

Gulp.task('metalsmith', () => {
    Swig.setDefaults({ cache: false, autoescape: false });
    // Encodes all characters to HTML entities (for obfuscation)
    Swig.setFilter('encode', input => He.encode(input, { encodeEverything: true }));
    // Adds classes to an html element
    Swig.setFilter('class', (input, classes) => {
        let $ = Cheerio.load(input);
        $('> *').addClass(classes);
        return $.html();
    });

    const metalsmith = Gulpsmith()
        .metadata({
            email: 'hi@roland.codes',
            svgs: internals.svgs
        })
        .use(Collections({
            projects: { pattern: 'projects/*.md' }
        }))
        .use(Markdown())
        .use(Permalinks())
        .use(Layouts({
            engine: 'swig',
            directory: internals.templates
        }));

    return Gulp.src(internals.metalsmithGlob)
        // Parse front matter for metalsmith
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
        transform: [
            Babelify.configure({
                optional: ['runtime']
            })
        ],
        debug: true,
        cache: {},
        packageCache: {}
    });

    function createBundle(bundle) {
        return bundle.bundle()
            // Improve source map paths
            .pipe(MoldSourceMap.transformSources(file => '/source/' + Path.relative('./app/', file)))
            // Convert text stream to vinyl file stream
            .pipe(Source('assets/js/index.js'))
            // Buffer the streamed file contents
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
