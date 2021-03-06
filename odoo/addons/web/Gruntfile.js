// License LGPL-3.0 or later (http://www.gnu.org/licenses/lgpl).
module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            src: ['static/src/**/*.js', 'static/tests/**/*.js'],
            options: {
                sub: true, //[] instead of .
                evil: true, //eval
                laxbreak: true, //unsafe line breaks
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', []);

    grunt.registerTask('default', ['jshint']);

};