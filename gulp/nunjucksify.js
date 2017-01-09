'use strict'
const path = require('path')

const nunjucks = require('nunjucks')
const through = require('through2')

module.exports = (file, opts) => {
  const options = opts || {}
  const env = options.env || new nunjucks.Environment()
  let extensions = options.extensions || ['.html']
  let template = ''
  const templatePath = path.relative(process.cwd(), file)

  if (!Array.isArray(extensions)) {
    extensions = [extensions]
  }

  if (!extensions.includes(path.extname(file))) {
    return through()
  }

  function buffer(chunk, encoding, callback) {
    template += chunk
    callback()
  }

  function compile(callback) {
    let compiledTemplate = ''

    try {
      compiledTemplate = nunjucks.compiler.compile(
        template,
        env.asyncFilters,
        env.extensionsList,
        templatePath,
        options
      )
    } catch (err) {
      return callback(err)
    }

    compiledTemplate = `
      var nunjucks = require('nunjucks')
      var obj = (function () { ${compiledTemplate} })()
      var src = {
        obj: obj,
        type: 'code'
      }
      module.exports = function (env) {
        return new nunjucks.Template(src, env, '${templatePath}')
      }
    `

    this.push(compiledTemplate)
    return callback()
  }

  return through(buffer, compile)
}
