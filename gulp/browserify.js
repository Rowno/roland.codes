'use strict'
const path = require('path')

const babelify = require('babelify')
const browserify = require('browserify')
const buffered = require('vinyl-buffer')
const gulp = require('gulp')
const gulpif = require('gulp-if')
const livereload = require('gulp-livereload')
const moldSourceMap = require('mold-source-map')
const source = require('vinyl-source-stream')
const uglify = require('gulp-uglify')
const watchify = require('watchify')

const common = require('./common')
const nunjucksify = require('./nunjucksify')

function createBundle(bundle) {
  return bundle.bundle()
    .on('error', error => {
      console.error(error)
    })
    // Improve source map paths
    .pipe(moldSourceMap.transformSources(file => `/source/${path.relative('./app/assets/', file)}`))
    // Convert text stream to vinyl file stream
    .pipe(source('assets/js/index.js'))
    // Buffer the streamed file contents
    .pipe(buffered())
    .pipe(gulpif(common.prod, uglify()))
    .pipe(gulp.dest(common.dest, common.mode))
    .pipe(livereload())
}

gulp.task('browserify', () => {
  let b = browserify({
    entries: ['./app/assets/js/index.js'],
    transform: [
      babelify,
      nunjucksify
    ],
    debug: true,
    cache: {},
    packageCache: {}
  })

  if (common.watch) {
    b = watchify(b)
    b.on('update', () => createBundle(b))
  }

  return createBundle(b)
})
