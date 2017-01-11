'use strict'
const app = require('./app')
const {logger} = require('./utils')

logger.info('Server starting...')
const server = app.listen(3000, () => {
  logger.info('Server started at http://localhost:3000')
})

// Gracefully stop the server on system signals

function shutdown(exitCode) {
  logger.info('Server stopping...')

  server.close(() => {
    logger.info('Server stopped')
    process.exitCode = exitCode
  })

  // Forcibly shutdown after 10 seconds
  setTimeout(() => {
    throw new Error('Forcibly shutting down')
  }, 10000).unref()
}

// Termination signal sent by Systemd on stop
process.on('SIGTERM', () => shutdown(0))
// Interrupt signal sent by Ctrl+C
process.on('SIGINT', () => shutdown(0))
