/*jshint node:true */
'use strict';

var inquirer = require('inquirer');


module.exports = function (grunt) {
    grunt.registerTask('upload', function () {
        var done = this.async();

        inquirer.prompt([{
            type: 'confirm',
            name: 'confirm',
            message: 'Are you sure you want to upload the website?'
        }], function (answers) {
            if (!answers.confirm) {
                done();
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
