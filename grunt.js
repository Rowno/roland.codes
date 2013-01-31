/*jshint node:true */

module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        jekyll: {
            all: {
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
        min: {
            tetris: {
                src: ['build/js/tetris.js'],
                dest: 'build/js/tetris.js'
            },
            comments: {
                src: ['build/js/comments.js'],
                dest: 'build/js/comments.js'
            }
        },
        connect: {
            all: {
                port: 4000,
                base: 'build/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-jekyll');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-connect');

    grunt.registerTask('dev', 'jekyll less:dev');
    grunt.registerTask('prod', 'jekyll less:prod min');

    grunt.registerTask('default', 'dev');
    grunt.registerTask('server', 'connect');
};
