/*jshint node:true */
'use strict';

var commander = require('commander');


module.exports = function (grunt) {
    grunt.registerTask('upload', function () {
        var done = this.async();

        commander.confirm('Are you sure you want to upload the website? (y/n) ', function (ok) {
            if (!ok) {
                done(false);
                return;
            }

            grunt.util.spawn({
                cmd: 'rsync',
                opts: {stdio: 'inherit'},
                args: [
                    '-avz',
                    '--delete',
                    'build/',
                    'vps:/var/www/rolandwarmerdam/htdocs/'
                ]
            }, function (error) {
                done(error);
            });
        });
    });
};
