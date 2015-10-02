'use strict';
const Path = require('path');

const Nunjucks = require('nunjucks');
const Through = require('through2');


module.exports = function nunjucksify(file, opts) {
    const options = opts || {};
    const env = options.env || new Nunjucks.Environment();
    let extensions = options.extensions || ['.html'];
    let template = '';
    const templatePath = Path.relative(process.cwd(), file);

    if (!Array.isArray(extensions)) {
        extensions = [extensions];
    }

    if (!extensions.includes(Path.extname(file))) {
        return Through();
    }

    function buffer(chunk, encoding, callback) {
        template += chunk;
        callback();
    }

    function compile(callback) {
        let compiledTemplate = '';

        try {
            compiledTemplate = Nunjucks.compiler.compile(
                template,
                env.asyncFilters,
                env.extensionsList,
                templatePath,
                options
            );
        } catch (error) {
            return callback(error);
        }

        compiledTemplate = `
            var nunjucks = require('nunjucks');
            var obj = (function () { ${compiledTemplate} })();
            var src = {
                obj: obj,
                type: 'code'
            };
            module.exports = function (env) {
                return new nunjucks.Template(src, env, '${templatePath}')
            };
        `;

        this.push(compiledTemplate);
        return callback();
    }

    return Through(buffer, compile);
};
