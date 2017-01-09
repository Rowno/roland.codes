'use strict'
require('babel-polyfill')
const alex = require('gulp-alex')
const del = require('del')
const gulp = require('gulp')

const common = require('./gulp/common')
require('./gulp/server')
require('./gulp/build')

gulp.task('clean', () => del(common.dest))

gulp.task('alex', () => {
  return gulp.src([
    'app/**/*.md',
    'README.md'
  ])
  .pipe(alex())
  .pipe(alex.reporter())
})

gulp.task('default', () => {
  common.watch = true
  gulp.start('server')
})
