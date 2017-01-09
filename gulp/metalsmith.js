'use strict'
const fs = require('fs')
const path = require('path')

const cheerio = require('cheerio')
const collections = require('metalsmith-collections')
const drafts = require('metalsmith-drafts')
const excerpts = require('metalsmith-excerpts')
const frontMatter = require('gulp-front-matter')
const globby = require('globby')
const gulp = require('gulp')
const gulpsmith = require('gulpsmith')
const he = require('he')
const highlight = require('highlight.js')
const layouts = require('metalsmith-layouts')
const livereload = require('gulp-livereload')
const markdown = require('metalsmith-markdownit')
const moment = require('moment')
const nunjucks = require('nunjucks')
const permalinks = require('metalsmith-permalinks')

const common = require('./common')

const taskGlob = 'app/content/**/*'
let watching = false

const nunjucksEnv = nunjucks.configure(common.templatesPath, {
  autoescape: false,
  watch: false,
  noCache: true
})

nunjucksEnv.addFilter('date', (input, format) => moment(input).format(format))

nunjucksEnv.addFilter('startswith', (input, value) => {
  if (typeof input === 'string') {
    return input.startsWith(value)
  }

  return input
})

// Unicode encodes all characters
nunjucksEnv.addFilter('encode', input => {
  if (typeof input === 'string') {
    return he.encode(input, {encodeEverything: true})
  }

  return input
})

// Adds classes to an html element
nunjucksEnv.addFilter('class', (input, classes) => {
  if (typeof input === 'string') {
    const $ = cheerio.load(input)
    $('> *').addClass(classes)
    return $.html()
  }

  return input
})

gulp.task('metalsmith', done => {
  if (!watching && common.watch) {
    gulp.watch([
      taskGlob,
      `${common.templatesPath}/**/*`
    ], ['metalsmith'])
    watching = true
  }

  const metadata = {
    baseurl: 'https://roland.codes',
    buildDate: new Date(),
    copyright: `Copyright © 2011-${new Date().getFullYear()} Roland Warmerdam`,
    email: 'hi@roland.codes',
    svgs: {}
  }

  // Load svgs into variables so they can be inlined using metalsmith
  globby('app/static/assets/images/*.svg').then(paths => {
    return Promise.all(paths.map(svgPath => {
      return new Promise((resolve, reject) => {
        const svgName = path.basename(svgPath, '.svg')

        fs.readFile(svgPath, {encoding: 'utf8'}, (error, contents) => {
          if (error) {
            reject(error)
          }

          resolve([svgName, contents])
        })
      })
    }))
  }).then(svgs => {
    svgs.forEach(([svgName, contents]) => {
      metadata.svgs[svgName] = contents
    })
  }).then(() => {
    gulp.src(taskGlob)
      // Parse front matter for metalsmith
      .pipe(frontMatter()).on('data', file => {
        Object.assign(file, file.frontMatter)
        Reflect.deleteProperty(file, 'frontMatter')
      })
      .pipe(gulpsmith()
        .metadata(metadata)
        .use(drafts()) // First to avoid unnecessary parsing
        .use(files => { // Extract date from filenames before sorting on them
          const DATE_REGEX = /(\d{4}-\d{2}-\d{2})-(.*?)$/

          Object.keys(files).forEach(filename => {
            const {base, dir} = path.parse(filename)
            const data = files[filename]
            const match = DATE_REGEX.exec(base)

            if (!match) {
              return
            }

            data.date = new Date(match[1])
            files[path.join(dir, match[2])] = data
            Reflect.deleteProperty(files, filename)
          })
        })
        .use(markdown({
          html: true,
          linkify: true,
          typographer: true,
          highlight: (code, lang) => {
            if (lang && highlight.getLanguage(lang)) {
              return highlight.highlight(lang, code).value
            }

            return highlight.highlightAuto(code).value
          }
        }))
        .use(collections({
          blog: {
            pattern: 'blog/*.html',
            sortBy: 'date',
            reverse: true
          },
          projects: {
            pattern: 'projects/*.html',
            sortBy: 'order'
          },
          html: {
            pattern: '**/*.html'
          }
        }))
        .use(permalinks({relative: false})) // After markdown because it only renames .html files
        .use(excerpts())
        .use(files => { // Keep a copy of the contents without layout applied
          Object.keys(files)
            .filter(filename => path.extname(filename) === '.html')
            .forEach(filename => {
              const data = files[filename]
              data.prelayoutContents = data.contents
            })
        })
        .use(layouts({ // Last when all the metadata is available
          engine: 'nunjucks',
          directory: common.templatesPath
        })))
      .pipe(gulp.dest(common.dest, common.mode))
      .pipe(livereload())
      .on('end', done)
  })
})
