/** Generates the development and production Content Security Policies */
import builder from 'content-security-policy-builder'

const production = {
  baseUri: [`'none'`],
  blockAllMixedContent: true,
  connectSrc: [`'self'`, 'https://api.github.com', 'https://www.google-analytics.com'],
  defaultSrc: [`'self'`],
  formAction: [`'self'`],
  frameAncestors: [`'self'`],
  frameSrc: [`'self'`, 'https://codepen.io'],
  imgSrc: ['*'],
  objectSrc: [`'none'`],
  scriptSrc: [`'self'`, 'https://www.google-analytics.com'],
  styleSrc: [`'self'`, `'unsafe-inline'`],
  styleSrcElem: [`'self'`],
  upgradeInsecureRequests: true,
}

const development = {
  ...production,
  scriptSrc: [...production.scriptSrc, `'unsafe-eval'`],
  styleSrcElem: [...production.styleSrcElem, `'unsafe-inline'`],
}

const csp = builder({
  directives: process.argv[2] === 'development' ? development : production,
})

console.log(`\n${csp}\n`)
