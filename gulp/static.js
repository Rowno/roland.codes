'use strict'
const changed = require('gulp-changed')
const gulp = require('gulp')
const livereload = require('gulp-livereload')

const common = require('./common')

const taskGlob = 'app/static/**/*'
let watching = false

gulp.task('static', () => {
  if (!watching && common.watch) {
    gulp.watch(taskGlob, ['static'])
    watching = true
  }

  return gulp.src(taskGlob)
    .pipe(changed(common.dest))
    .pipe(gulp.dest(common.dest, common.mode))
    .pipe(livereload())
})
