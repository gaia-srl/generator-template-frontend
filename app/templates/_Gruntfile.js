'use strict';

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('jit-grunt')(grunt, {
        replace: 'grunt-text-replace',
        configureProxies: 'grunt-connect-proxy',
        useminPrepare: 'grunt-usemin',
        validation: 'grunt-html-validation'
    });

    var minify = !!grunt.option('minify'),
        bump = grunt.option('bump'); // major | minor | patch

    // e.g. $ grunt build --bump=major

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: grunt.file.readJSON('.bowerrc'),
        // configurable paths
        settings: {
            hostname: '0.0.0.0',
            ports: {
                www: 9000,
                api: 9001,
                dist: 9002,
                test: 9003
            },
            paths: {
                tmp: '.tmp',
                app: 'app',
                www: 'www',
                api: 'api',
                apidocs: '_apidocs',
                dist: 'dist',
                test: 'test'
            },
            apiType: 'live' // live or basic
            // autoVersioning: {
            //     build: 'patch',
            //     release: 'minor'
            // }
        },
        banner: '/*! v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        watch: {
            compass: {
                files: ['<%= settings.paths.app %>/<%= settings.paths.www %>/styles/**/*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer']
            },
            assemble: {
                files: ['<%= settings.paths.app %>/<%= settings.paths.www %>/templates/**/*.{js,hbs}'],
                tasks: ['assemble:server']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= settings.paths.tmp %>/<%= settings.paths.www %>/pages/**/*.html',
                    '<%= settings.paths.tmp %>/<%= settings.paths.www %>/styles/**/*.css',
                    '{<%= settings.paths.tmp %>,<%= settings.paths.app %>}/<%= settings.paths.www %>/scripts/**/*.js',
                    '<%= settings.paths.app %>/<%= settings.paths.www %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: []
            },
            // karma: {
            //     files: [
            //         '<%= settings.paths.app %>/<%= settings.paths.www %>/scripts/**/*.js',
            //         '!<%= settings.paths.app %>/<%= settings.paths.www %>/scripts/vendor/*',
            //         '<%= settings.paths.test %>/unit/spec/**/*.js'
            //     ],
            //     tasks: ['karma:unit:run']
            // }
            // api: {
            //     files: ['<%= settings.paths.app %>/<%= settings.paths.api %>/**/*.js'],
            //     tasks: ['express-restart:api'] // doesn't work - https://github.com/blai/grunt-express/issues/28
            // }
        },
        express: {
            options: {
                //serverreload: true,  // BEWARE: this clobbers the grunt-contrib-watch task so it stops working
                hostname: '<%= settings.hostname %>'
            },
            api: {
                options: {
                    port: '<%= settings.ports.api %>',
                    server: '<%= settings.paths.app %>/<%= settings.paths.api %>/api-<%= settings.apiType %>.js'
                }
            }
        },
        connect: {
            options: {
                livereload: 35729,
                hostname: '<%= settings.hostname %>'
            },
            www: {
                options: {
                    port: '<%= settings.ports.www %>',
                    middleware: function (connect, options) {
                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }

                        // Setup the proxy
                        var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

                        // Serve static files.
                        options.base.forEach(function(base) {
                            middlewares.push(connect.static(base));
                        });

                        // Make directory browse-able.
                        var directory = options.directory || options.base[options.base.length - 1];
                        middlewares.push(connect.directory(directory));

                        return middlewares;
                    },
                    // open this in the browser
                    open: true,
                    base: [
                        '<%= settings.paths.tmp %>/<%= settings.paths.www %>',
                        '<%= settings.paths.app %>/<%= settings.paths.www %>'
                    ]
                },
                proxies: [
                    {
                        context: '/<%= settings.paths.api %>/',
                        host: '<%= settings.hostname %>',
                        port: '<%= settings.ports.api %>'
                    }
                ]
            },
            dist: {
                options: {
                    open: true,
                    port: '<%= settings.ports.dist %>',
                    base: ['<%= settings.paths.dist %>/<%= settings.paths.www %>']
                }
            },
            test: {
                options: {
                    port: '<%= settings.ports.test %>',
                    base: [
                        '<%= settings.paths.tmp %>',
                        '<%= settings.paths.test %>/unit',
                        '<%= settings.paths.app %>/<%= settings.paths.www %>'
                    ]
                }
            }
        },
        clean: {
            plugins: {
                files: [{
                    dot: true,
                    src: [/*'<%= settings.paths.app %>/<%= settings.paths.www %>/plugins'*/]
                }]
            },
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= settings.paths.tmp %>',
                        '<%= settings.paths.dist %>/*',
                        '!<%= settings.paths.dist %>/.git*',
                        '!<%= settings.paths.dist %>/node_modules*'
                    ]
                }]
            },
            server: {
                files: [{
                    dot: true,
                    src: [
                        '<%= settings.paths.tmp %>'
                    ]
                }]
            },
            apidocs: {
                files: [{
                    dot: true,
                    src: [
                        '<%= settings.paths.app %>/<%= settings.paths.apidocs %>'
                    ]
                }]
            },
            release: {
                options: {
                    force: true
                },
                files: []
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                // '<%= settings.paths.app %>/<%= settings.paths.api %>/{,*/}*.js',
                '<%= settings.paths.app %>/<%= settings.paths.www %>/scripts/{,*/}*.js',
                '!<%= settings.paths.app %>/<%= settings.paths.www %>/scripts/vendor/*',
                //'<%= settings.paths.test %>/unit/spec/{,*/}*.js'
            ]
        },
        karma: {
            options: {
                port: '<%= settings.ports.test %>',
                files: [
                    '<%= settings.paths.app %>/<%= settings.paths.www %>/scripts/{,*/}*.js',
                    '!<%= settings.paths.app %>/<%= settings.paths.www %>/scripts/vendor/*',
                    '<%= settings.paths.test %>/unit/spec/www/{,*/}*.js'
                ]
            },
            unit: {
                configFile: '<%= settings.paths.test %>/unit/spec/karma.config.js',
                background: true,
                singleRun: false
            }
        },
        // jasmine_node: {
        //     options: {
        //         //specFolders: ['<%= settings.paths.test %>/unit/api/'],
        //         specNameMatcher: '.spec',
        //         jUnit: {
        //             savePath: 'reports/jUnit/'
        //         }
        //     },
        //     all: ['<%= settings.paths.test %>/unit/api/']
        // },
        compass: {
            options: {
                sassDir: '<%= settings.paths.app %>/<%= settings.paths.www %>/styles',
                cssDir: '<%= settings.paths.tmp %>/<%= settings.paths.www %>/styles',
                generatedImagesDir: '<%= settings.paths.tmp %>/<%= settings.paths.www %>/images/generated',
                imagesDir: '<%= settings.paths.app %>/<%= settings.paths.www %>/images',
                javascriptsDir: '<%= settings.paths.app %>/<%= settings.paths.www %>/scripts',
                fontsDir: '<%= settings.paths.app %>/<%= settings.paths.www %>/fonts',
                importPath: ['<%= settings.paths.app %>/<%= settings.paths.www %>/bower_components', '<%= settings.paths.app %>/<%= settings.paths.www %>/styles/includes'],
                httpImagesPath: '../images',
                httpGeneratedImagesPath: '../images/generated',
                httpFontsPath: '../styles/fonts',
                relativeAssets: false
            },
            dist: {
                options: {
                    generatedImagesDir: '<%= settings.paths.dist %>/<%= settings.paths.www %>/images/generated'
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= settings.paths.tmp %>/<%= settings.paths.www %>/styles/',
                    src: '{,*/}*.css',
                    dest: '<%= settings.paths.tmp %>/<%= settings.paths.www %>/styles/'
                }]
            }
        },
        bless: {
            server: {
                css: {
                    options: {
                        cacheBuster: false,
                        compress: false
                    },
                    files: {
                        '<%= settings.paths.tmp %>/<%= settings.paths.www %>/styles/main.css': '<%= settings.paths.tmp %>/<%= settings.paths.www %>/styles/*.css'
                    }
                }
            },
            dist: {
                options: {
                    cacheBuster: false,
                    compress: true
                },
                files: {
                    '<%= settings.paths.dist %>/<%= settings.paths.www %>/styles/main.css': '<%= settings.paths.dist %>/<%= settings.paths.www %>/styles/*.css'
                }
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= settings.paths.dist %>/<%= settings.paths.www %>/pages'
            },
            html: '<%= settings.paths.tmp %>/<%= settings.paths.www %>/pages/{,*/}*.html'
        },
        usemin: {
            options: {
                dirs: ['<%= settings.paths.dist %>/<%= settings.paths.www %>/pages']
            },
            html: ['<%= settings.paths.dist %>/<%= settings.paths.www %>/pages/{,*/}*.html'],
            css: ['<%= settings.paths.dist %>/<%= settings.paths.www %>/styles/{,*/}*.css']
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= settings.paths.app %>/<%= settings.paths.www %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= settings.paths.dist %>/<%= settings.paths.www %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= settings.paths.app %>/<%= settings.paths.www %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= settings.paths.dist %>/<%= settings.paths.www %>/images'
                }]
            }
        },
        cssmin: {
            // This task is pre-configured if you do not wish to use Usemin
            // blocks for your CSS. By default, the Usemin block from your
            // `index.html` will take care of minification, e.g.
            //
            //     <!-- build:css({<%= settings.paths.tmp %>,app}) styles/main.css -->
            //
            // dist: {
            //     files: {
            //         '<%= settings.paths.dist %>/styles/main.css': [
            //             '<%= settings.paths.tmp %>/styles/{,*/}*.css'//,
            //             //'<%= settings.paths.app %>/<%= settings.paths.www %>/styles/{,*/}*.css'
            //         ]
            //     }
            // }
        },
        htmlmin: {
            dist: {
                options: {
                    removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    // collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: false,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: false
                },
                files: [{
                    expand: true,
                    cwd: '<%= settings.paths.tmp %>/<%= settings.paths.www %>',
                    src: '*.html',
                    dest: '<%= settings.paths.dist %>/<%= settings.paths.www %>'
                }, {
                    expand: true,
                    cwd: '<%= settings.paths.tmp %>/<%= settings.paths.www %>/pages',
                    src: '*.html',
                    dest: '<%= settings.paths.dist %>/<%= settings.paths.www %>/pages'
                }]
            },
            deploy: {
                options: {
                    collapseWhitespace: false
                },
                files: [{
                    expand: true,
                    cwd: '<%= settings.paths.dist %>/<%= settings.paths.www %>',
                    src: '{,*/}*.html',
                    dest: '<%= settings.paths.dist %>/<%= settings.paths.www %>'
                }]
            }
        },
        concat: {
            options: {
                banner: '<%= banner %>'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                sourceMap: true,

                mangle: minify,
                compress: minify,
                beautify: !minify,
                preserveComments: minify ? false : 'all'
            }
        },
        // Put files not handled in other tasks here
        copy: {
            plugins: {
                files: [/*{
                    // VideoJS SWF files
                    expand: true,
                    dot: true,
                    flatten: true,
                    cwd: '<%= bower.directory %>/videojs/dist/video-js/',
                    dest: '<%= settings.paths.app %>/<%= settings.paths.www %>/plugins',
                    src: [
                        'video-js.swf'
                    ]
                }, {
                    // VideoJS fonts
                    expand: true,
                    dot: true,
                    flatten: true,
                    cwd: '<%= bower.directory %>/videojs/dist/video-js/font',
                    dest: '<%= settings.paths.app %>/<%= settings.paths.www %>/styles/fonts',
                    src: [
                        'vjs.eot',
                        'vjs.svg',
                        'vjs.ttf',
                        'vjs.woff'
                    ]
                }*/]
            },
            dist: {
                files: [{
                    // assets
                    expand: true,
                    dot: true,
                    cwd: '<%= settings.paths.app %>/<%= settings.paths.www %>',
                    dest: '<%= settings.paths.dist %>/<%= settings.paths.www %>',
                    src: [
                        '*.{ico,png,txt}',
                        'images/{,*/}*.{webp,gif}',
                        'styles/fonts/{,*/}*.{eot,svg,ttf,woff}',
                        'docs-assets/**/*'
                    ]
                }, {
                    // node / iis stuff
                    expand: true,
                    dot: true,
                    cwd: '<%= settings.paths.app %>',
                    dest: '<%= settings.paths.dist %>',
                    src: [
                        '_deploy.js',
                        '_iisnode.yml',
                        '_package.json',
                        '_web.config'
                    ],
                    rename: function(dest, src) {
                        var name = src;
                        if (src.substr(0, 1) === '_') {
                            name = src.substr(1); // remove underscore
                        }
                        return dest + '/' + name;
                    }
                }, {
                    // api
                    expand: true,
                    dot: true,
                    cwd: '<%= settings.paths.app %>/<%= settings.paths.api %>',
                    dest: '<%= settings.paths.dist %>/<%= settings.paths.api %>',
                    src: [
                        '**'
                    ]
                }, {
                    // apidocs
                    expand: true,
                    dot: true,
                    cwd: '<%= settings.paths.app %>/<%= settings.paths.apidocs %>',
                    dest: '<%= settings.paths.dist %>/<%= settings.paths.apidocs %>',
                    src: [
                        '**'
                    ]
                }, {
                    // project docs & components
                    expand: true,
                    dot: true,
                    cwd: '<%= settings.paths.tmp %>/<%= settings.paths.www %>',
                    dest: '<%= settings.paths.dist %>/<%= settings.paths.www %>',
                    src: [
                        'docs/**/*',
                        'components/**/*'
                    ]
                }]
            },
            release: {
                files: [] // define files to be copied to another place during the release task
            }
        },
        modernizr: {
            dist: {
                devFile: '<%= settings.paths.app %>/<%= settings.paths.www %>/bower_components/modernizr/modernizr.js',
                outputFile: '<%= settings.paths.tmp %>/<%= settings.paths.www %>/bower_components/modernizr/modernizr.js',
                files: {
                    src: [
                        '<%= settings.paths.app %>/<%= settings.paths.www %>/scripts/{,*/}*.js',
                        '<%= settings.paths.tmp %>/<%= settings.paths.www %>/styles/{,*/}*.css'
                    ]
                },
                excludeFiles: ['!<%= settings.paths.app %>/<%= settings.paths.www %>/scripts/vendor/*'],
                uglify: true
            }
        },
        concurrent: {
            server: [
                'compass:server',
                'jshint'
            ],
            test: [],
            dist: [
                'compass:dist',
                'imagemin',
                'svgmin',
                'htmlmin:dist'
            ]
        },
        assemble: {
            options: {
                flatten: true,
                layout: 'default.hbs',
                layoutdir: '<%= settings.paths.app %>/<%= settings.paths.www %>/templates/layouts/',
                partials: ['<%= settings.paths.app %>/<%= settings.paths.www %>/templates/partials/*.hbs'],
                helpers: '<%= settings.paths.app %>/<%= settings.paths.www %>/templates/helpers/**/*.js',
                collections: [{
                    name: 'template',
                    sortby: 'order'
                }, {
                    name: 'component'
                }],
                data: 'package.json'
            },
            server: {
                options: {
                    development: true
                },
                files: [{
                    '<%= settings.paths.tmp %>/<%= settings.paths.www %>/pages/': ['<%= settings.paths.app %>/<%= settings.paths.www %>/templates/pages/*.hbs']
                }, {
                    '<%= settings.paths.tmp %>/<%= settings.paths.www %>/components/': ['<%= settings.paths.app %>/<%= settings.paths.www %>/templates/components/*.hbs']
                }, {
                    '<%= settings.paths.tmp %>/<%= settings.paths.www %>/docs/': ['<%= settings.paths.app %>/<%= settings.paths.www %>/templates/docs/*.hbs']
                }, {
                    '<%= settings.paths.tmp %>/<%= settings.paths.www %>/': ['<%= settings.paths.app %>/<%= settings.paths.www %>/templates/index.hbs']
                }]
            },
            release: {
                options: {
                    development: false
                },
                // same as server
                files: [{
                    '<%= settings.paths.tmp %>/<%= settings.paths.www %>/pages/': ['<%= settings.paths.app %>/<%= settings.paths.www %>/templates/pages/*.hbs']
                }, {
                    '<%= settings.paths.tmp %>/<%= settings.paths.www %>/components/': ['<%= settings.paths.app %>/<%= settings.paths.www %>/templates/components/*.hbs']
                }, {
                    '<%= settings.paths.tmp %>/<%= settings.paths.www %>/docs/': ['<%= settings.paths.app %>/<%= settings.paths.www %>/templates/docs/*.hbs']
                }, {
                    '<%= settings.paths.tmp %>/<%= settings.paths.www %>/': ['<%= settings.paths.app %>/<%= settings.paths.www %>/templates/*.hbs']
                }]
            }
        },
        apidoc: {
            api: {
                src: '<%= settings.paths.app %>/<%= settings.paths.api %>',
                dest: '<%= settings.paths.app %>/<%= settings.paths.apidocs %>'
            }
        },
        validation: {
            options: {
                reset: true,
                doctype: 'HTML5',
                reportpath: false,
                relaxerror: [
                    'Bad value X-UA-Compatible for attribute http-equiv on element meta.',
                    //'document type does not allow element "[A-Z]+" here'
                ]
            },
            server: {
                options: {
                    path: 'reports/app/validation-status.json',
                },
                files: {
                    src: ['<%= settings.paths.tmp %>/<%= settings.paths.www %>/pages/**/*.html']
                }
            },
            dist: {
                options: {
                    path: 'reports/dist/validation-status.json',
                },
                files: {
                    src: ['<%= settings.paths.dist %>/<%= settings.paths.www %>/pages/**/*.html']
                }
            }
        },
        version: {
            options: {
                pkg: 'package.json'
            },
            defaults: {
                src: [
                    'package.json',
                    'bower.json',
                    '<%= settings.paths.app %>/_package.json'
                ]
            }
        },
        replace: {
            dist: {
                src: ['<%= settings.paths.app %>/_package.json', '<%= settings.paths.app %>/_deploy.js'],
                overwrite: true,
                replacements: [{
                    from: /"name":\s*"[^"]*"/,
                    to: '"name": "<%= pkg.name %>"'
                }, {
                    from: /"description":\s*"[^"]*"/,
                    to: '"description": "<%= pkg.description %>"'
                }, {
                    from: '{{ apiType }}',
                    to: '<%= settings.apiType %>'
                }]
            },
            apidocs: {
                src: ['<%= settings.paths.app %>/<%= settings.paths.apidocs %>/index.html'],
                overwrite: true,
                replacements: [{
                    from: '</body>',
                    // add the iframeResizer script
                    to: '<script src="/docs-assets/js/iframeResizer.contentWindow.js"></script></body>'
                }]
            }
        },
        notify: {
            build: {
                options: {
                    message: 'Build completed'
                }
            },
            release: {
                options: {
                    message: 'Release completed'
                }
            }
        }
    });

    
    grunt.loadNpmTasks('assemble'); // Doesn't follow the grunt-* naming scheme and therefor isn't loaded automatically

    // a noop task
    grunt.registerTask('noop', function () {
        // this is used when a task is not used because of the settings
    });
    

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'clean:apidocs',

            'clean:plugins',
            'copy:plugins',
            'assemble:server',
            'concurrent:server',
            'autoprefixer',

            'apidoc',
            'replace:apidocs',

            'configureProxies:www',
            'connect:www',
            'express:api',

            //'karma:server',

            'watch'
        ]);
    });

    grunt.registerTask('server', function () {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('apidocs', [
        'clean:apidocs',
        'apidoc'
    ]);

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'karma:test'
    ]);

    grunt.registerTask('serve-all', function () {
        // start the dist server, then run the usual serve task
        grunt.task.run(['connect:dist', 'serve']);
    });

    grunt.registerTask('prepare-build', [
        'clean:dist',
        'clean:apidocs',
        'apidoc',
        'replace:apidocs',
        'replace:dist',
        'clean:plugins',
        'copy:plugins'
    ]);

    grunt.registerTask('run-build', [
        'concurrent:dist',
        'autoprefixer',
        'modernizr',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'copy:dist',
        //'bless:dist',
        'usemin',
        'validation:dist',
        //'karma:dist'
        //'htmlmin:deploy'
    ]);


    grunt.registerTask('build', [
        'prepare-build',
        bump ? 'version::' + bump : 'noop',
        'assemble:server', // use the server task here
        'run-build',
        'notify:build'
    ]);

    // build the project, with developer stuff removed
    grunt.registerTask('release', [
        'prepare-build',
        bump ? 'version::' + bump : 'noop',
        'assemble:release', // use the release task here
        'run-build',
        'clean:release',
        'copy:release',
        'notify:release'
    ]);

    // grunt.registerTask('cleanDist', [
    //     'clean:dist'
    // ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
