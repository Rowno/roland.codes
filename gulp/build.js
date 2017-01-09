'use strict'
const gulp = require('gulp')
const livereload = require('gulp-livereload')
const runSequence = require('run-sequence')

const common = require('./common')
require('./static')
require('./metalsmith')
require('./css')
require('./browserify')

gulp.task('build', callback => {
  return runSequence('clean', ['static', 'metalsmith', 'css', 'browserify'], () => {
    if (common.watch) {
      livereload.listen({
        key: common.privateKey,
        cert: common.certificate
      })
    }

    callback()
  })
})
