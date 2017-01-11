'use strict'
const url = require('url')
const winston = require('winston')

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)()
  ]
})
exports.logger = logger

exports.redirect = destination => (req, res) => {
  const destinationParsed = url.parse(destination, true)

  destinationParsed.search = null
  destinationParsed.query = Object.assign({}, destinationParsed.query, req.query)

  const destinationUrl = url.format(destinationParsed)

  logger.info(`${req.originalUrl} -> ${destinationUrl}`)
  res.redirect(301, destinationUrl)
}
