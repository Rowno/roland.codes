'use strict'
const path = require('path')
const express = require('express')
const helmet = require('helmet')
const {logger, redirect} = require('./utils')

const app = express()
app.set('trust proxy', true)

app.use(helmet({
  hsts: false, // Set by Now
  contentSecurityPolicy: {
    directives: {
      baseUri: [`'none'`],
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
      reportUri: 'https://rowno.report-uri.io/r/default/csp/enforce',
      scriptSrc: [`'self'`, 'https://www.google-analytics.com', 'https://cdn.segment.com'],
      styleSrc: [`'self'`, `'unsafe-inline'`],
      blockAllMixedContent: true,
      upgradeInsecureRequests: true
    },
    browserSniff: false
  }
}))

app.get('/feed/', redirect('/feed.xml'))
app.get('/rss.xml', redirect('/feed.xml'))
app.get('/feed.rss', redirect('/feed.xml'))
app.get('/archives/', redirect('/blog/'))
app.get('/about/', redirect('/#about'))
app.get('/projects/', redirect('/#projects'))
app.get(/^\/page[0-9]+\/?$/, redirect('/blog/'))

app.get('/access-your-localhost-from-inside-a-virtual-machine/', redirect('/blog/access-your-localhost-from-inside-a-virtual-machine/'))
app.get('/host-your-own-website-on-a-github-subdomain/', redirect('/blog/host-your-own-website-on-a-github-subdomain/'))
app.get('/addon-sdk-double-keyboard-events-bug/', redirect('/blog/addon-sdk-double-keyboard-events-bug/'))
app.get('/disable-the-addon-bar-context-menu-on-addon-sdk-widgets/', redirect('/blog/disable-the-addon-bar-context-menu-on-addon-sdk-widgets/'))
app.get('/understanding-git/', redirect('/blog/understanding-git/'))
app.get('/adding-ipv6-support-to-your-server/', redirect('/blog/adding-ipv6-support-to-your-server/'))
app.get('/conditions-for-text-overflow-to-be-applied/', redirect('/blog/conditions-for-text-overflow-to-be-applied/'))
app.get('/introducing-jslinter/', redirect('/blog/introducing-jslinter/'))
app.get('/vmware-to-virtualbox/', redirect('/blog/vmware-to-virtualbox/'))
app.get('/node-boilerplate/', redirect('/blog/node-boilerplate/'))
app.get('/architect-a-javascript-template-editor/', redirect('/blog/architect-a-javascript-template-editor/'))
app.get('/mime-types-demystified/', redirect('/blog/mime-types-demystified/'))
app.get('/github-wiki-sidebars/', redirect('/blog/github-wiki-sidebars/'))
app.get('/controlling-line-breaks/', redirect('/blog/controlling-line-breaks/'))
app.get('/sync-sublime-text-2-settings/', redirect('/blog/sync-sublime-text-2-settings/'))
app.get('/auto-indent-on-paste-in-sublime-text-2/', redirect('/blog/auto-indent-on-paste-in-sublime-text-2/ '))
app.get('/sublime-text-2-script-tag-templates/', redirect('/blog/sublime-text-2-script-tag-templates/'))
app.get('/ubuntu-shutdown-hang/', redirect('/blog/ubuntu-shutdown-hang/'))
app.get('/ie-flex-collapse-bug/', redirect('/blog/ie-flex-collapse-bug/'))
app.get('/legacy-flexbox-invisible-float-bug/', redirect('/blog/legacy-flexbox-invisible-float-bug/'))
app.get('/browser-search-engine-shortcuts/', redirect('/blog/browser-search-engine-shortcuts/'))

app.use(express.static('build'))

app.use((req, res) => {
  res.status(404).sendFile(path.resolve('build/404.html'), err => {
    if (err) {
      logger.error(err)
      res.status(err.status).end()
    }
  })
})

module.exports = app
