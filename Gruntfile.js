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
                    dumpLineNumbers: 'all'
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
        uglify: {
            tetris: {
                src: ['build/js/tetris.js'],
                dest: 'build/js/tetris.js'
            },
            comments: {
                src: ['build/js/comments.js'],
                dest: 'build/js/comments.js'
            }
        },
        watch: {
            dev: {
                files: 'app/**/*',
                tasks: ['dev']
            },
            prod: {
                files: 'app/**/*',
                tasks: ['prod']
            }
        },
        connect: {
            all: {
                options: {
                    base: 'build'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-jekyll');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('dev', ['jekyll', 'less:dev']);
    grunt.registerTask('prod', ['jekyll', 'less:prod', 'uglify']);

    grunt.registerTask('auto:dev', ['dev', 'connect', 'watch:dev']);
    grunt.registerTask('auto:prod', ['prod', 'connect', 'watch:prod']);
    grunt.registerTask('auto', ['auto:dev']);

    grunt.registerTask('default', ['dev']);
};
