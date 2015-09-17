/* eslint-env node */
'use strict';
const Fs = require('fs');
const Path = require('path');

const Alex = require('gulp-alex');
const Autoprefixer = require('autoprefixer');
const Babelify = require('babelify');
const Browserify = require('browserify');
const Buffered = require('vinyl-buffer');
const Changed = require('gulp-changed');
const Cheerio = require('cheerio');
const Collections = require('metalsmith-collections');
const Del = require('del');
const Drafts = require('metalsmith-drafts');
const Excerpts = require('metalsmith-excerpts');
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
const PostCss = require('gulp-postcss');
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
internals.prod = internals.options.prod || process.env.NODE_ENV === 'production'; // eslint-disable-line no-process-env
internals.watch = internals.options.watch;
internals.staticGlob = 'app/static/**/*';
internals.metalsmithGlob = 'app/content/**/*';
internals.sassGlob = 'app/assets/**/*.scss';
internals.templates = 'app/templates';
internals.dest = 'build';
internals.mode = { mode: '644' };
internals.metadata = {
    baseurl: 'https://roland.codes',
    buildDate: new Date(),
    copyright: `Copyright © 2011-${new Date().getFullYear()} Roland Warmerdam`,
    email: 'hi@roland.codes',
    svgs: {},
};


/* eslint-disable no-sync */

// Load svgs into variables so they can be inlined using metalsmith
Globby.sync('app/static/assets/images/*.svg').forEach(path => {
    const svgName = Path.basename(path, '.svg');
    internals.metadata.svgs[svgName] = Fs.readFileSync(path, { encoding: 'utf8' });
});

/* eslint-enable no-sync */


Gulp.task('clean', () => Del(internals.dest));

Gulp.task('static', () => {
    return Gulp.src(internals.staticGlob)
        .pipe(Changed(internals.dest))
        .pipe(Gulp.dest(internals.dest, internals.mode))
        .pipe(Livereload());
});

Gulp.task('metalsmith', () => {
    Swig.setDefaults({ cache: false, autoescape: false });
    // Encodes all characters to HTML entities (for obfuscation)
    Swig.setFilter('encode', input => He.encode(input, { encodeEverything: true }));
    // Adds classes to an html element
    Swig.setFilter('class', (input, classes) => {
        const $ = Cheerio.load(input);
        $('> *').addClass(classes);
        return $.html();
    });

    const metalsmith = Gulpsmith()
        .metadata(internals.metadata)
        .use(Drafts()) // First to avoid unnecessary parsing
        .use((files) => { // Extract date from filenames before sorting on them
            const DATE_REGEX = /(\d{4}-\d{2}-\d{2})-(.*?)$/;

            Object.keys(files).forEach((filename) => {
                const { base, dir } = Path.parse(filename);
                const metadata = files[filename];
                const match = DATE_REGEX.exec(base);

                if (!match) {
                    return;
                }

                metadata.date = new Date(match[1]);
                files[Path.join(dir, match[2])] = metadata;
                Reflect.deleteProperty(files, filename);
            });
        })
        .use(Collections({
            blog: {
                pattern: 'blog/*.md',
                sortBy: 'date',
                reverse: true,
            },
            projects: { pattern: 'projects/*.md' }
        }))
        .use(Markdown({
            html: true,
            linkify: true,
            typographer: true
        }))
        .use(Permalinks()) // After markdown because it only renames .html files
        .use(Excerpts())
        .use((files) => { // Keep a copy of the contents without layout applied
            Object.keys(files)
                .filter((filename) => Path.extname(filename) === '.html')
                .forEach((filename) => {
                    const metadata = files[filename];
                    metadata.prelayoutContents = metadata.contents;
                });
        })
        .use(Layouts({ // Last when all the metadata is available
            engine: 'swig',
            directory: internals.templates
        }));

    return Gulp.src(internals.metalsmithGlob)
        // Parse front matter for metalsmith
        .pipe(FrontMatter()).on('data', file => {
            Object.assign(file, file.frontMatter);
            Reflect.deleteProperty(file, 'frontMatter');
        })
        .pipe(metalsmith)
        .pipe(Gulp.dest(internals.dest, internals.mode))
        .pipe(Livereload());
});

Gulp.task('sass', () => {
    return Gulp.src(internals.sassGlob)
        .pipe(Sourcemaps.init())
        .pipe(Sass({ sourceComments: true }))
        .pipe(PostCss([Autoprefixer()]))
        .pipe(Sourcemaps.write())
        .pipe(Gulpif(internals.prod, MinifyCss({ keepSpecialComments: 0 })))
        .pipe(Gulp.dest(Path.join(internals.dest, 'assets'), internals.mode))
        .pipe(Livereload());
});

Gulp.task('browserify', () => {
    let b = Browserify({
        entries: ['./app/assets/js/index.js'],
        transform: [
            Babelify.configure({ optional: ['runtime'] })
        ],
        debug: true,
        cache: {},
        packageCache: {}
    });

    function createBundle(bundle) {
        return bundle.bundle()
            // Improve source map paths
            .pipe(MoldSourceMap.transformSources(file => `/source/${Path.relative('./app/', file)}`))
            // Convert text stream to vinyl file stream
            .pipe(Source('assets/js/index.js'))
            // Buffer the streamed file contents
            .pipe(Buffered())
            .pipe(Gulpif(internals.prod, Uglify()))
            .pipe(Gulp.dest(internals.dest, internals.mode))
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
                `${internals.templates}/**/*`
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

Gulp.task('alex', () => {
    return Gulp.src('app/**/*.md').pipe(Alex());
});

Gulp.task('default', () => {
    internals.watch = true;
    Gulp.start('server');
});
