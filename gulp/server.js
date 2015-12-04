'use strict';
const Https = require('https');
const Path = require('path');

const Csp = require('helmet-csp');
const Express = require('express');
const Gulp = require('gulp');

const Common = require('./common');
require('./build');

const NOT_FOUND = 404;
const PORT = 8000;


Gulp.task('server', ['build'], (callback) => {
    const app = Express();

    app.use(Csp({
        childSrc: ["'self'", 'https://codepen.io'],
        connectSrc: ["'self'", 'https://api.github.com', 'https://api.segment.io', 'wss://localhost:35729'],
        defaultSrc: ["'self'"],
        fontSrc: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        frameSrc: ["'self'", 'https://codepen.io'], // Replaced by childSrc
        imgSrc: ['*'],
        manifestSrc: ["'self'"],
        mediaSrc: ["'self'"],
        objectSrc: ["'none'"],
        reportUri: ['/csp-report'],
        scriptSrc: ["'self'", 'https://www.google-analytics.com', 'https://cdn.segment.com', 'https://localhost:35729'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        upgradeInsecureRequests: [],
    }));

    app.use((req, res, next) => {
        res.set({
            'X-UA-Compatible': 'IE=Edge',
            'X-Content-Type-Options': 'nosniff',
            'X-XSS-Protection': '1; mode=block',
            'X-Frame-Options': 'SAMEORIGIN',
        });
        next();
    });

    app.use(Express.static('build'));

    app.use((req, res) => {
        res.status(NOT_FOUND).sendFile(Path.resolve('build/404.html'), (error) => {
            if (error) {
                console.log(error);
                res.status(error.status).end();
            }
        });
    });

    Https.createServer({
        key: Common.privateKey,
        cert: Common.certificate
    }, app).listen(PORT, callback);

    console.log(`Server listening on https://localhost:${PORT}`);
});
