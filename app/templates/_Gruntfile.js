// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configuration
  var config = grunt.file.readYAML('config.yml');

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint', 'newer:copy:js'],
        options: {
          livereload: true
        }
      },
      jstest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['test:watch']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: ['<%%= config.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'autoprefixer']
      },
      styles: {
        files: ['<%%= config.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      images: {
        files: ['<%= config.app %>/graphics/{,*/}*.{gif,jpeg,jpg,png}'],
        tasks: ['imagemin']
      },
      svgs: {
        files: ['<%= config.app %>/graphics/{,*/}*.svg'],
        tasks: ['svgmin']
      },
      assemble: {
        files: [
          '<%%= config.app %>/templates/**/*.hbs',
          '<%%= config.content %>/**/*.md'
        ],
        tasks: ['assemble:server', 'wiredep:app', 'raggedast']
      },
      livereload: {
        options: {
          livereload: '<%%= connect.options.livereload %>'
        },
        files: [
          '<%%= config.server %>/{,*/}*.html',
          '<%%= config.server %>/assets/styles/{,*/}*.css',
          '<%= config.server %>/assets/scripts/{,*/}*.js',
          '<%= config.server %>/assets/graphics/{,*/}*'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost',
        debug: true
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              connect.static(config.server),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      },
      test: {
        options: {
          open: false,
          port: 9001,
          middleware: function(connect) {
            return [
              connect.static(config.server),
              connect.static('test'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      },
      build: {
        options: {
          base: '<%%= config.build %>',
          livereload: false
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      build: {
        files: [{
          dot: true,
          src: [
            '<%%= config.server %>',
            '<%%= config.build %>/*',
            '!<%%= config.build %>/.git*'
          ]
        }]
      },
      server: '<%%= config.server %>'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%%= config.app %>/scripts/{,*/}*.js',
        '!<%%= config.app %>/scripts/vendor/*'
      ]
    },<% if (testFramework === 'mocha') { %>

    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://<%%= connect.test.options.hostname %>:<%%= connect.test.options.port %>/index.html']
        }
      }
    },<% } else if (testFramework === 'jasmine') { %>

    // Jasmine testing framework configuration options
    jasmine: {
      all: {
        options: {
          specs: 'test/spec/{,*/}*.js'
        }
      }
    },<% } %>

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        loadPath: 'bower_components'
      },
      build: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '<%%= config.server %>/assets/styles',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '<%%= config.server %>/assets/styles',
          ext: '.css'
        }]
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
      },
      build: {
        files: [{
          expand: true,
          cwd: '<%%= config.server %>/assets/styles/',
          src: '{,*/}*.css',
          dest: '<%%= config.server %>/assets/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        ignorePath: /^<%%= config.app %>\/|\.\.\//,
        src: ['<%%= config.server %>/{,*/}*.html']
      },
      sass: {
        src: ['<%%= config.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Renames files for browser caching purposes
    rev: {
      build: {
        files: {
          src: [
            '<%%= config.build %>/assets/scripts/{,*/}*.js',
            '<%%= config.build %>/assets/styles/{,*/}*.css',
            '<%%= config.build %>/assets/graphics/{,*/}*.*',
            '<%%= config.build %>/assets/fonts/{,*/}*.*',
            '<%%= config.build %>/*.{ico,png}'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%%= config.build %>'
      },
      html: '<%%= config.server %>/index.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%%= config.build %>',
          '<%%= config.build %>/assets/graphics'
        ]
      },
      html: ['<%%= config.server %>/{,*/}*.html'],
      css: ['<%%= config.build %>/styles/{,*/}*.css']
    },

    // The following *-min tasks produce minified files in the build folder
    imagemin: {
      build: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/graphics',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%%= config.build %>/assets/graphics'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/graphics',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%%= config.server %>/assets/graphics'
        }]
      }
    },

    svgmin: {
      build: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/graphics',
          src: '{,*/}*.svg',
          dest: '<%%= config.build %>/assets/graphics'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/graphics',
          src: '{,*/}*.svg',
          dest: '<%%= config.server %>/assets/graphics'
        }]
      }
    },

    htmlmin: {
      build: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%%= config.server %>',
          src: '{,*/}*.html',
          dest: '<%%= config.build %>'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      build: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= config.app %>',
          dest: '<%%= config.build %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'graphics/{,*/}*.webp',
            '{,*/}*.html',
            'fonts/{,*/}*.*'
          ]
        }]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%%= config.app %>/styles',
        dest: '<%%= config.server %>/assets/styles/',
        src: '{,*/}*.css'
      },
      js: {
        expand: true,
        dot: true,
        cwd: '<%%= config.app %>/scripts',
        dest: '<%%= config.server %>/assets/scripts/',
        src: '{,*/}*.js'
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        'sass:server',
        'copy:js',
        'imagemin:server',
        'svgmin:server'
      ],
      test: [
        'copy:js'
      ],
      build: [
        'sass:build',
        'copy:js',
        'imagemin:build',
        'svgmin:build'
      ]
    },
    
    assemble: {
      options: {
        flatten: true,
        layoutdir: './<%%= config.app %>/templates/layouts',
        partials: [
          './<%%= config.app %>/templates/partials/*.hbs',
          './<%%= config.content %>/*.md'
        ],
      },
      server: {
        cwd: './<%%= config.app %>/templates/pages/',
        expand: true,
        src: ['**/*.hbs'],
        dest: './<%%= config.server %>/'
      },
      build: {
        cwd: './<%%= config.app %>/templates/pages/',
        expand: true,
        src: ['**/*.hbs'],
        dest: './<%%= config.build %>/'
      }
    },
    
    // Adjusts the text rag for better readability
    raggedast: {
      options: {
        selector: 'p, section h1, h2, h3, h4, h5, h6',
        space: '&#160;',
        thinSpace: '&#8239;',
        words: true,
        symbols: true,
        units: true,
        numbers: true,
        emphasis: true,
        quotes: true,
        months: true,
        orphans: 2,
        shortWords: 2,
        limit: 0
      },
      server: {
        expand: true,
        cwd: '<%= config.server %>',
        src: ['{,*/}*.html'],
        dest: '<%= config.server %>',
      }
    },
    
    'sftp-deploy': {
      prod: {
        auth: {
          host: '<%%= config.deployProdHost %>',
          port: '<%%= config.deployProdPort %>',
          authKey: 'prod'
        },
        src: '<%%= config.build %>',
        dest: '<%%= config.deployProdDestination %>'
      }
    }
    
  });
  
  grunt.loadNpmTasks('assemble');

  grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
    if (grunt.option('allow-remote')) {
      grunt.config.set('connect.options.hostname', '0.0.0.0');
    }
    if (target === 'build') {
      return grunt.task.run(['build', 'connect:build:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'assemble:server',
      'raggedast',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('test', function (target) {
    if (target !== 'watch') {
      grunt.task.run([
        'clean:server',
        'concurrent:test',
        'autoprefixer'
      ]);
    }

    grunt.task.run([
      'connect:test',<% if (testFramework === 'mocha') { %>
      'mocha'<% } else if (testFramework === 'jasmine') { %>
      'jasmine'<% } %>
    ]);
  });

  grunt.registerTask('build', [
    'clean:build',
    'assemble:server',
    'raggedast',
    'wiredep',
    'useminPrepare',
    'concurrent:build',
    'autoprefixer',
    'concat',
    'cssmin',
    'uglify',
    'copy:build',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
  
  grunt.registerTask('deploy', [
    'clean:build',
    'assemble:server',
    'raggedast',
    'wiredep',
    'useminPrepare',
    'concurrent:build',
    'autoprefixer',
    'concat',
    'cssmin',
    'uglify',
    'copy:build',
//     'rev',
    'usemin',
    'htmlmin',
    'sftp-deploy:prod'
  ]);
  
};
