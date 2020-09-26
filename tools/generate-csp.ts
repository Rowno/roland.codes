#!/usr/bin/env -S node -r ts-node/register/transpile-only
import builder from 'content-security-policy-builder'

const csp = builder({
  directives: {
    baseUri: [`'none'`],
    blockAllMixedContent: true,
    connectSrc: [`'self'`, 'https://api.github.com', 'https://api.segment.io'],
    defaultSrc: [`'self'`],
    fontSrc: [`'self'`],
    formAction: [`'self'`],
    frameAncestors: [`'self'`],
    frameSrc: [`'self'`, 'https://codepen.io'],
    imgSrc: ['*'],
    manifestSrc: [`'self'`],
    mediaSrc: [`'self'`],
    objectSrc: [`'none'`],
    scriptSrc: [`'self'`, 'https://www.google-analytics.com', 'https://cdn.segment.com'],
    styleSrc: [`'self'`, `'unsafe-inline'`],
    upgradeInsecureRequests: true,
    workerSrc: [`'self'`],
  },
})

process.stdout.write(csp)
