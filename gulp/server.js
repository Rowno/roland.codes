'use strict'
const https = require('https')
const path = require('path')

const csp = require('helmet-csp')
const express = require('express')
const gulp = require('gulp')

const common = require('./common')
require('./build')

const NOT_FOUND = 404
const PORT = 8000

gulp.task('server', ['build'], callback => {
  const app = express()

  app.use(csp({
    childSrc: [`'self'`, 'https://codepen.io'],
    connectSrc: [`'self'`, 'https://api.github.com', 'https://api.segment.io', 'wss://localhost:35729'],
    defaultSrc: [`'self'`],
    fontSrc: [`'self'`],
    formAction: [`'self'`],
    frameAncestors: [`'self'`],
    frameSrc: [`'self'`, 'https://codepen.io'], // Replaced by childSrc
    imgSrc: ['*'],
    manifestSrc: [`'self'`],
    mediaSrc: [`'self'`],
    objectSrc: [`'none'`],
    reportUri: ['https://rowno.report-uri.io/r/default/csp/enforce'],
    scriptSrc: [`'self'`, 'https://www.google-analytics.com', 'https://cdn.segment.com', 'https://localhost:35729'],
    styleSrc: [`'self'`, `'unsafe-inline'`],
    upgradeInsecureRequests: []
  }))

  app.use((req, res, next) => {
    res.set({
      'X-UA-Compatible': 'IE=Edge',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'X-Frame-Options': 'SAMEORIGIN'
    })
    next()
  })

  app.use(express.static('build'))

  app.use((req, res) => {
    res.status(NOT_FOUND).sendFile(path.resolve('build/404.html'), error => {
      if (error) {
        console.log(error)
        res.status(error.status).end()
      }
    })
  })

  https.createServer({
    key: common.privateKey,
    cert: common.certificate
  }, app).listen(PORT, callback)

  console.log(`Server listening on https://localhost:${PORT}`)
})
