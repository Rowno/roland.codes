/*jshint node:true */

module.exports = function (grunt) {
    'use strict';

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
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                '.jshintrc',
                'Gruntfile.js',
                'package.json',
                'app/js/**/*.js',
                '!app/js/vendor/**/*'
            ]
        },
        uglify: {
            all: {
                files: [{
                    expand: true,
                    cwd: 'app/js/',
                    src: ['**/*.js', '!vendor/**/*'],
                    dest: 'build/js/'
                }]
            }
        },
        imagemin: {
            all: {
                options: {
                    optimizationLevel: 7
                },
                files: [{
                    expand: true,
                    cwd: 'build/img/',
                    src: ['**/*'],
                    dest: 'build/img/'
                }]
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
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    grunt.registerTask('dev', ['jekyll', 'less:dev']);
    grunt.registerTask('prod', ['jekyll', 'less:prod', 'uglify', 'imagemin']);

    grunt.registerTask('auto:dev', ['dev', 'connect', 'watch:dev']);
    grunt.registerTask('auto:prod', ['prod', 'connect', 'watch:prod']);
    grunt.registerTask('auto', ['auto:dev']);

    grunt.registerTask('default', ['dev']);
};
