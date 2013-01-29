/*jshint node:true */

module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        jekyll: {
            dev: {
                src: 'app',
                dest: 'build'
            }
        },
        less: {
            dev: {
                options: {
                    dumpLineNumbers: 'mediaquery'
                },
                files: {
                    'build/css/style.css': 'build/css/style.less'
                }
            },
            prod: {
                options: {
                    compress: true,
                    yuicompress: true
                },
                files: {
                    'build/css/style.css': 'build/css/style.less'
                }
            }
        },
        connect: {
            server: {
                port: 4000,
                base: 'build'
            }
        }
    });

    grunt.loadNpmTasks('grunt-jekyll');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-connect');

    grunt.registerTask('default', 'jekyll less:dev');
    grunt.registerTask('server', 'default connect');
    grunt.registerTask('prod', 'jekyll less:prod');
};
