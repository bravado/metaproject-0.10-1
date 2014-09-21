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
        banner: '/*!\n' +
            ' * Metaproject v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n' +
            ' */\n',
        jqueryCheck: 'if (typeof jQuery === \'undefined\') { throw new Error(\'Metaproject requires jQuery\') }\n\n',

        // Task configuration.
        clean: {
            dist: ['build/bootstrap.*', 'build/metaproject.*']
        },

        concat: {
            options: {
                banner: '<%= banner %>\n<%= jqueryCheck %>',
                stripBanners: false
            },
            metaproject: {
                src: [
                    'js/metaproject.js',
                    'js/metaproject.app.js',
                    'js/metaproject.data.js'
                ],
                dest: 'build/metaproject.js'
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
                dest: 'build/metaproject-ui.js'
            }
        },

        uglify: {
            metaproject: {
                options: {
                    banner: '<%= banner %>'
                },
                src: [
                    '<%= concat.metaproject.dest %>',
                    '<%= concat.metaproject_ui.dest %>'
                ],
                dest: 'build/<%= pkg.name %>.min.js'
            },
            metaproject_full: {
                options: {
                    banner: '<%= banner %>'
                },
                src: [
                    'bower_components/jquery/jquery.js',
                    'bower_components/jquery-ui/ui/jquery-ui.js',
                    'bower_components/modernizr/modernizr.js',
                    'bower_components/knockout/dist/knockout.js',
                    'bower_components/knockout-mapping/knockout.mapping.js',
                    'bower_components/knockout.punches/knockout.punches.js',
                    'bower_components/knockout-postbox/build/knockout-postbox.js',
                    'lib/bootstrap.js',
                    '<%= concat.metaproject.dest %>',
                    '<%= concat.metaproject_ui.dest %>'
                ],
                dest: 'build/metaproject.full.js'
            }
        },

        less: {
            compileCore: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: 'bootstrap.css.map',
                    sourceMapFilename: 'build/bootstrap.css.map'
                },
                files: {
                    'build/bootstrap.css': 'less/bootstrap.less'
                }
            },
            compileTheme: {
                options: {
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: 'bootstrap-theme.css.map',
                    sourceMapFilename: 'build/bootstrap-theme.css.map'
                },
                files: {
                    'build/bootstrap-theme.css': 'less/theme.less'
                }
            },
            minify: {
                options: {
                    cleancss: true
                },
                files: {
                    'build/bootstrap.min.css': 'build/bootstrap.css',
                    'build/bootstrap-theme.min.css': 'build/bootstrap-theme.css'
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9', 'android 2.3', 'android 4', 'opera 12']
            },
            core: {
                options: {
                    map: true
                },
                src: 'build/bootstrap.css'
            },
            theme: {
                options: {
                    map: true
                },
                src: 'build/bootstrap-theme.css'
            }
        },

        csslint: {
            options: {
                csslintrc: 'less/.csslintrc'
            },
            src: [
                'build/bootstrap.css',
                'build/bootstrap-theme.css'
            ]
        },

        cssmin: {
            options: {
                compatibility: 'ie8',
                keepSpecialComments: '*'
            },
            metaproject: {
                src: [
                    'css/jquery-ui-1.8.16.custom.css',
                    'css/metaproject.css'
                ],
                dest: 'build/metaproject.min.css'
            }
        },

        usebanner: {
            options: {
                position: 'top',
                banner: '<%= banner %>'
            },
            files: {
                src: 'build/*.css'
            }
        },

        csscomb: {
            options: {
                config: 'less/.csscomb.json'
            },
            dist: {
                expand: true,
                cwd: 'build/',
                src: ['*.css', '!*.min.css'],
                dest: 'build/'
            }
        },

        copy: {
            fonts: {
                expand: true,
                src: 'fonts/*',
                dest: 'dist/'
            }
        },

        exec: {
            npmUpdate: {
                command: 'npm update'
            },
            npmShrinkWrap: {
                command: 'npm shrinkwrap --dev'
            }
        }
    });


    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
    require('time-grunt')(grunt);


    // JS distribution task.
    grunt.registerTask('dist-js', ['concat', 'uglify']);

    // CSS distribution task.
    grunt.registerTask('less-compile', ['less:compileCore', 'less:compileTheme']);
    grunt.registerTask('dist-css', ['less-compile', 'autoprefixer', 'usebanner', 'csscomb', 'less:minify', 'cssmin']);

    // Docs distribution task.
    grunt.registerTask('dist-docs', 'copy:docs');

    // Full distribution task.
    grunt.registerTask('dist', ['clean', 'dist-css', 'dist-js']);

    // Default task.
    grunt.registerTask('default', ['dist']);

};
