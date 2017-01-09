'use strict'
const path = require('path')

const autoprefixer = require('autoprefixer')
const gulp = require('gulp')
const gulpif = require('gulp-if')
const livereload = require('gulp-livereload')
const minifyCss = require('gulp-minify-css')
const postCss = require('gulp-postcss')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')

const common = require('./common')

const taskGlob = 'app/assets/**/*.scss'
let watching = false

gulp.task('css', () => {
  if (!watching && common.watch) {
    gulp.watch(taskGlob, ['css'])
    watching = true
  }

  return gulp.src(taskGlob)
    .pipe(sourcemaps.init())
    .pipe(sass({sourceComments: true}))
    .pipe(postCss([autoprefixer()]))
    .pipe(sourcemaps.write())
    .pipe(gulpif(common.prod, minifyCss({
      keepSpecialComments: 0,
      // Workaround a bug that causes the vmax fallbacks to be stripped
      aggressiveMerging: false,
      compatibility: {
        units: {
          vmax: false
        }
      }
    })))
    .pipe(gulp.dest(path.join(common.dest, 'assets'), common.mode))
    .pipe(livereload())
})
