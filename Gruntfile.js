/*jshint node:true */
'use strict';

module.exports = function (grunt) {
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
                    'build/assets/css/main.css': 'build/assets/css/main.less'
                }
            },
            prod: {
                options: {
                    compress: true,
                    yuicompress: true
                },
                files: {
                    'build/assets/css/main.css': 'build/assets/css/main.less'
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
                '!app/assets/js/vendor/**/*',
                '!app/assets/js/variables.js'
            ]
        },
        requirejs: {
            all: {
                options: {
                    baseUrl: 'vendor',
                    paths: {
                        app: '..'
                    },
                    appDir: 'build/assets/js',
                    dir: 'build/assets/js',
                    keepBuildDir: true,
                    removeCombined: true,
                    optimize: 'none',
                    modules: [
                        {
                            name: 'app/main'
                        }, {
                            name: 'app/comments',
                            exclude: ['jquery', 'app/variables', 'app/ga']
                        }
                    ]
                }
            }
        },
        uglify: {
            all: {
                files: [{
                    expand: true,
                    cwd: 'build/assets/js/',
                    src: ['**/*.js', '!vendor/**/*'],
                    dest: 'build/assets/js/'
                }]
            }
        },
        imagemin: {
            all: {
                options: {
                    optimizationLevel: 2
                },
                files: [{
                    expand: true,
                    cwd: 'build/assets/img/',
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

    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-jekyll');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('dev', ['jekyll', 'less:dev']);
    grunt.registerTask('prod', ['jekyll', 'less:prod', 'uglify', 'requirejs', 'imagemin']);

    grunt.registerTask('deploy', ['prod', 'upload']);

    grunt.registerTask('auto:dev', ['dev', 'connect', 'watch:dev']);
    grunt.registerTask('auto:prod', ['prod', 'connect', 'watch:prod']);

    grunt.registerTask('auto', ['auto:dev']);
    grunt.registerTask('default', ['dev']);
};
