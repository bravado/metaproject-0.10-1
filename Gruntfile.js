/*!
 * Metaproject's Gruntfile
 * Based on http://getbootstrap.com Copyright 2013-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

module.exports = function (grunt) {
    'use strict';

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    RegExp.quote = function (string) {
        return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    var fs = require('fs');
    var path = require('path');

    // Project configuration.
    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner:
            ' * Metaproject v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)',
        cssBanner: ' * Contains code from twitter bootstrap, font-awesome, AdminLTE and jquery-ui',
        jsBanner: ' * Contains code from the dependencies listed on the README file',
        // Task configuration.
        clean: {
            dist: ['dist/*' ]
        },

        concat: {
            metaproject: {
                src: [
                    'js/metaproject.js',
					'js/path.js',
                    'js/metaproject.app.js',
                    'js/metaproject.data.js'
                ],
                dest: 'dist/metaproject.js'
            },
            metaproject_ui: {
                src: [
                    'js/metaproject-ui.js',
                    'js/metaproject-ui.calendar.js',
                    'js/metaproject-ui.chart.js',
                    'js/metaproject-ui.datepicker.js',
                    'js/metaproject-ui.elrte.js',
                    'js/metaproject-ui.fileupload.js',
                    'js/metaproject-ui.grid.js',
                    'js/metaproject-ui.maskinput.js',
                    'js/metaproject-ui.tinymce.js'
                ],
                dest: 'dist/metaproject-ui.js'
            }
        },

        uglify: {
            metaproject: {
                options: {
                    banner: '/*!\n<%= banner %>\n*/\n'
                },
                src: [
                    '<%= concat.metaproject.dest %>',
                    '<%= concat.metaproject_ui.dest %>'
                ],
                dest: 'dist/<%= pkg.name %>.min.js'
            },
            metaproject_full: {
                options: {
                    banner: '/*!\n<%= banner %>\n<%= jsBanner %>\n */\n'
                },
                src: [
                    'bower_components/modernizr/modernizr.js',
                    'bower_components/knockout/dist/knockout.js',
                    'bower_components/knockout-mapping/knockout.mapping.js',
                    'bower_components/knockout.punches/knockout.punches.js',
                    'bower_components/knockout-postbox/build/knockout-postbox.js',
                    'bower_components/bootstrap/dist/js/bootstrap.js',
                    '<%= concat.metaproject.dest %>',
                    '<%= concat.metaproject_ui.dest %>'
                ],
                dest: 'dist/metaproject.js'
            }
        },

        cssmin: {
            options: {
                banner: '/*\n<%= banner %>\n<%= cssBanner %>\n */\n',
                compatibility: 'ie8',
                keepSpecialComments: 0
            },
            metaproject: {
                src: [
                    'bower_components/bootstrap/dist/css/bootstrap.css',
                    'bower_components/font-awesome/css/font-awesome.css',
                    'css/jquery-ui-1.8.16.custom.css'
                ],
                dest: 'dist/metaproject.css'
            }
        },

        replace: {
            font_path: {
                src: ['dist/metaproject.css'],
                overwrite: true,                 // overwrite matched source files
                replacements: [{
                    from: '../fonts',
                    to: "fonts"
                }]
            }
        },

        copy: {

            images: {
                cwd: 'css/images',
                src: '**/*',
                dest: 'dist/images',
                expand: true
            },

            fontawesome: {

                cwd: 'bower_components/font-awesome/fonts',
                src: '**/*',
                dest: 'dist/fonts',
                expand: true
            },

            glyphicons: {

                cwd: 'bower_components/bootstrap/dist/fonts',
                src: '**/*',
                dest: 'dist/fonts',
                expand: true
            }
        }
    });


    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
    require('time-grunt')(grunt);


    // JS distribution task.
    grunt.registerTask('dist-js', ['concat', 'uglify' ]);

    grunt.registerTask('dist-css', ['cssmin', 'replace', 'copy']);

    // Docs distribution task.
    //grunt.registerTask('dist-docs', 'copy:docs');

    // Full distribution task.
    grunt.registerTask('dist', ['clean', 'dist-js', 'dist-css']);

    // Default task.
    grunt.registerTask('default', ['dist']);

};
