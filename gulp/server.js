'use strict';
const Https = require('https');

const Csp = require('helmet-csp');
const Express = require('express');
const Gulp = require('gulp');

const Common = require('./common');
require('./build');


Gulp.task('server', ['build'], callback => {
    const app = Express();

    app.use(Csp({
        childSrc: ["'self'", 'https://codepen.io'],
        connectSrc: ["'self'", 'https://api.github.com', 'wss://localhost:35729'],
        defaultSrc: ["'self'"],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        frameSrc: ["'self'", 'https://codepen.io'],
        imgSrc: ['*'],
        manifestSrc: ["'self'"],
        mediaSrc: ["'self'"],
        objectSrc: ["'none'"],
        reportUri: ['/csp-report'],
        scriptSrc: ["'self'", "'unsafe-eval'", 'https://www.google-analytics.com', 'https://assets.codepen.io', 'https://localhost:35729'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        upgradeInsecureRequests: [],
    }));

    app.use(Express.static('build', {
        setHeaders(res) {
            res.setHeader('X-UA-Compatible', 'IE=Edge');
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        }
    }));

    Https.createServer({
        key: Common.privateKey,
        cert: Common.certificate
    }, app).listen(8000, callback);

    console.log('Server listening on https://localhost:8000');
});
