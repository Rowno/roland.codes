'use strict'
const fs = require('fs')
const path = require('path')

const minimist = require('minimist')

const options = minimist(process.argv)

exports.prod = options.prod || process.env.NODE_ENV === 'production'
exports.watch = options.watch
exports.templatesPath = 'app/templates'
exports.dest = 'build'
exports.mode = {mode: '644'}

exports.privateKey = fs.readFileSync(path.join(__dirname, 'server.key'), 'utf8')
exports.certificate = fs.readFileSync(path.join(__dirname, 'server.crt'), 'utf8')
