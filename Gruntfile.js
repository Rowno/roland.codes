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
                    'build/assets/css/style.css': 'app/assets/css/style.less'
                }
            },
            prod: {
                options: {
                    compress: true,
                    yuicompress: true
                },
                files: {
                    'build/assets/css/style.css': 'app/assets/css/style.less'
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
                'app/assets/js/**/*.js',
                '!app/assets/js/vendor/**/*'
            ]
        },
        uglify: {
            all: {
                files: [{
                    expand: true,
                    cwd: 'app/assets/js/',
                    src: ['**/*.js', '!vendor/**/*'],
                    dest: 'build/assets/js/'
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
                    cwd: 'app/assets/img/',
                    src: ['**/*'],
                    dest: 'build/assets/img/'
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
