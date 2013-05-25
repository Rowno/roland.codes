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
                dest: 'build',
                config: '_config.yml'
            }
        },
        less: {
            dev: {
                options: {
                    dumpLineNumbers: 'comments'
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
                '!app/assets/js/ga.js',
                '!app/assets/js/variables.js'
            ]
        },
        copy: {
            js: {
                expand: true,
                cwd: 'build/assets/js/',
                src: ['**/*'],
                dest: 'temp/'
            }
        },
        clean: {
            temp: ['temp'],
            unneeded: [
                'build/assets/js/build.txt',
                'build/assets/css/**/*.less'
            ]
        },
        requirejs: {
            all: {
                options: {
                    mainConfigFile: 'temp/main.js',
                    baseUrl: '.',
                    appDir: 'temp',
                    dir: 'build/assets/js',
                    removeCombined: true,
                    optimize: 'uglify2',
                    useStrict: true,
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
                    src: ['build/**/*.{png,jpg,jpeg}']
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
                            connect.compress(),
                            connect.static(options.base)
                        ];
                    }
                }
            }
        }
    });

    grunt.registerTask('dev', ['jekyll', 'less:dev']);
    grunt.registerTask('prod', [
        'jekyll',
        'less:prod',
        'copy:js',
        'requirejs',
        'clean:temp',
        'imagemin',
        'clean:unneeded'
    ]);

    grunt.registerTask('deploy', ['prod', 'upload']);

    grunt.registerTask('auto:dev', ['dev', 'connect', 'watch:dev']);
    grunt.registerTask('auto:prod', ['prod', 'connect', 'watch:prod']);

    grunt.registerTask('auto', ['auto:dev']);
    grunt.registerTask('default', ['dev']);
};
