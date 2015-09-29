'use strict';
const Fs = require('fs');
const Path = require('path');

const Minimist = require('minimist');

const options = Minimist(process.argv);


exports.prod = options.prod || process.env.NODE_ENV === 'production'; // eslint-disable-line no-process-env
exports.watch = options.watch;
exports.templatesPath = 'app/templates';
exports.dest = 'build';
exports.mode = { mode: '644' };

/* eslint-disable no-sync */

exports.privateKey = Fs.readFileSync(Path.join(__dirname, 'server.key'), 'utf8');
exports.certificate = Fs.readFileSync(Path.join(__dirname, 'server.crt'), 'utf8');

/* eslint-enable no-sync */
