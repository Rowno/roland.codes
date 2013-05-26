/*jshint node:true */
'use strict';

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.loadTasks('tasks');


    grunt.initConfig({
        jekyll: {
            all: {
                src: 'app',
                dest: 'temp',
                config: '_config.yml'
            }
        },
        less: {
            dev: {
                options: {
                    dumpLineNumbers: 'comments'
                },
                files: {
                    'build/assets/css/main.css': 'temp/assets/css/main.less'
                }
            },
            prod: {
                options: {
                    compress: true,
                    yuicompress: true
                },
                files: {
                    'build/assets/css/main.css': 'temp/assets/css/main.less'
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
                '!app/assets/js/ga.js',
                '!app/assets/js/variables.js'
            ]
        },
        copy: {
            dev: {
                expand: true,
                filter: 'isFile',
                cwd: 'temp/',
                src: ['**/*'],
                dest: 'build/'
            },
            prod: {
                expand: true,
                filter: 'isFile',
                cwd: 'temp/',
                src: [
                    '**/*',
                    '!assets/css/**/*.less',
                    '!assets/img/**/*.{png,jpg,jpeg,svg}',
                    '!assets/js/**/*'
                ],
                dest: 'build/'
            }
        },
        clean: {
            build: ['build'],
            unneeded: [
                'build/assets/js/build.txt'
            ]
        },
        requirejs: {
            all: {
                options: {
                    mainConfigFile: 'temp/assets/js/main.js',
                    baseUrl: 'temp/assets/js',
                    dir: 'build/assets/js',
                    removeCombined: true,
                    wrap: true,
                    useStrict: true,
                    optimize: 'uglify2',
                    preserveLicenseComments: false,
                    modules: [
                        {
                            name: 'main',
                            include: ['jquery', 'variables', 'ga']
                        }, {
                            name: 'comments',
                            exclude: ['jquery', 'variables', 'ga']
                        }, {
                            name: 'tetris',
                            exclude: ['jquery', 'variables', 'ga']
                        }
                    ]
                }
            }
        },
        imagemin: {
            all: {
                options: {
                    optimizationLevel: 2
                },
                files: [{
                    expand: true,
                    cwd: 'temp/',
                    src: ['assets/img/**/*.{png,jpg,jpeg}'],
                    dest: 'build/'
                }]
            }
        },
        svgmin: {
            all: {
                files: [{
                    expand: true,
                    cwd: 'temp/',
                    src: 'assets/img/**/*.svg',
                    dest: 'build/'
                }]
            }
        },
        watch: {
            options: {
                livereload: true
            },
            dev: {
                files: [
                    'app/**/*',
                    'Gruntfile.js',
                    '_config.yml'
                ],
                tasks: ['dev']
            },
            prod: {
                files: [
                    'app/**/*',
                    'Gruntfile.js',
                    '_config.yml'
                ],
                tasks: ['prod']
            }
        },
        connect: {
            all: {
                options: {
                    base: 'build',
                    middleware: function (connect, options) {
                        return [
                            function (req, res, next) {
                                /*jshint quotmark:false */
                                res.setHeader('X-UA-Compatible', 'IE=Edge,chrome=1');
                                res.setHeader('X-Content-Type-Options', 'nosniff');
                                res.setHeader('X-XSS-Protection', '1; mode=block');
                                res.setHeader('X-Frame-Options', 'SAMEORIGIN');
                                res.setHeader(
                                    'Content-Security-Policy',
                                    "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' https://www.google-analytics.com https://ssl.google-analytics.com; img-src 'self' https://a248.e.akamai.net https://www.google-analytics.com https://ssl.google-analytics.com https://secure.gravatar.com; connect-src 'self' https://api.github.com ws://127.0.0.1:35729; report-uri /csp-report;        connect-src ws://127.0.0.1:35729;"
                                );
                                next();
                            },
                            connect.compress({
                                filter: function (req, res) {
                                    return (/json|text|javascript|xml/).test(res.getHeader('Content-Type'));
                                }
                            }),
                            connect.static(options.base)
                        ];
                    }
                }
            }
        },
        concurrent: {
            dev: [
                'copy:dev',
                'less:dev'
            ],
            prod: [
                'copy:prod',
                'less:prod',
                'imagemin',
                'svgmin',
                'requirejs'
            ]
        }
    });


    grunt.registerTask('dev', [
        'clean:build',
        'jekyll',
        'concurrent:dev'
    ]);

    grunt.registerTask('prod', [
        'clean:build',
        'jekyll',
        'concurrent:prod',
        'clean:unneeded'
    ]);

    grunt.registerTask('deploy', ['prod', 'upload']);

    grunt.registerTask('auto:dev', ['dev', 'connect', 'watch:dev']);
    grunt.registerTask('auto:prod', ['prod', 'connect', 'watch:prod']);

    grunt.registerTask('auto', ['auto:dev']);
    grunt.registerTask('default', ['dev']);
};
