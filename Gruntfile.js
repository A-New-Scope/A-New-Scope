module.exports = function(grunt) {

  /* eslint import/no-extraneous-dependencies: "off", node/no-unpublished-require: "off",
   angular/timeout-service: "off", angular/log: "off", no-console: "off" */
  require('load-grunt-tasks')(grunt); // in lieu of grunt.loadNpmTasks('grunt-*'), which need to be deleted below


  // Consider using "grunt-load-config" to clean up this file
  // See https://www.html5rocks.com/en/tutorials/tooling/supercharging-your-gruntfile/
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/client/assets',
          src: [
            'scripts/*.js',
            '!scripts/babelified',
            '!scripts/minified',
            'views/**/*.js',
            '!*.min.js'
          ],
          dest: 'src/client/assets/scripts/babelified',
        }]
      }
    },
    
    concat: {
      options: {
        separator: ';\n'
      },
      js: {
        src: ['src/client/assets/scripts/minified/**/*.min.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      },
      css: {
        src: ['src/client/assets/styles/minified/*.min.css'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.css'
      }
    },

    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    csslint: {
      strict: {
        options: {
          import: 2,
        },
        src: [
          'src/client/assets/styles/*.css',
          '!src/client/assets/styles/normalize.css',
        ]
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/client/assets/styles',
          src: ['*.css', '!*.min.css'],
          dest: 'src/client/assets/styles/minified',
          ext: '.min.css',
        }]
      }
    },

    eslint: {
      js: [
        'src/**/*.js',
        'Gruntfile.js',
      ]
    },

    env: {
      //TO DO
      dev: {
        NODE_ENV: 'dev',
        PORT: 3300

      },
      production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },

    injector: {
      // in a dev environment, inject the right CSS and JS; also inject a live-reload server
      // in production, inject the right CSS and JS
      dev: {
        options: {
          relative: true,
        },
        files: {
          'src/client/index.html': [
            'src/client/assets/lib/*.js',
            '!src/client/assets/lib/scene.js',
            'src/client/assets/scripts/factories/*.js',
            'src/client/assets/scripts/controllers/*.js',
            'src/client/assets/scripts/app.js',
            'src/client/assets/styles/*.css',
          ]
        }
      },
      // not working; pushed to production with injector:dev
      // when working, "grunt build" should replace injector:dev
      // with injector:dist
      dist: {
        files: {
          'src/client/index.html': [
            'dist/*.min.js',
            'dist/*.min.css'
          ]
        }
      }
    },

    htmlmin: {
      options: {
        // TODO: add minify rules, see here
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      dist: {
        'dist/index.html': 'src/client/index.html'
      }
    },

    ngAnnotate: {
      //TODO
      // needed in order to serve minifed JS with angular in it
    },

    nodemon: {
      dev: {
        script: 'src/server/server.js',
        options: {
          nodeArgs: ['--inspect'],
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              // Delay before server listens on port
              setTimeout(function() {
                require('opn')('http://localhost:3300/#/user');
              }, 1000);
            });

            // refreshes browser when server reboots
            nodemon.on('restart', function () {
              // Delay before server listens on port
              setTimeout(function() {
                require('fs').writeFileSync('.rebooted', 'rebooted');
              }, 1000);
            });
          },
          ignore: [
            'src/client/assets/scripts/babelified/**/.js',
            'src/client/assets/scripts/minified/**/*.min.js'
          ],
          watch: ['src', 'Gruntfile.js'],
        }
      }
    },

    uglify: {
      target: {
        files: [{
          expand: true,
          cwd: 'src/client/assets/scripts/babelified',
          src: ['**/*.js', '!*.min.js'],
          dest: 'src/client/assets/scripts/minified',
          ext: '.min.js'
        }]
      }
    },

    watch: {
      options: {
        livereload: true // runs on 35729 by default; to change, replace true => some other number
      },
      css: {
        files: [
          'src/client/assets/styles/*.css',
          '!src/client/assets/styles/minified/*.min.css'
        ],
        tasks: ['cssmin', 'concat:css'],
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['eslint']
      },
      scripts: {
        files: [
          'src/client/assets/scripts/*.js',
          'src/client/assets/views/**/*.js',
          '!src/client/assets/scripts/minified/*.min.js',
          '!src/client/assets/scripts/babelified/*.js'
        ],
        tasks: ['babel', 'uglify', 'concat:js'],
      },
      html: {
        files: ['src/client/**/*.html'],
        tasks: ['htmlmin'],
      }
    }
  });

  // TODO: register tasks
  grunt.registerTask('default', ['dev']);
  grunt.registerTask('dev', ['env:dev', 'injector:dev', 'concurrent:dev']);
  grunt.registerTask('test', ['eslint', 'csslint']);
  grunt.registerTask('build', ['env:production', 'injector:dev', 'cssmin', 'ngAnnotate', 'babel', 'uglify', 'concat']);
  grunt.registerTask('upload', []);
  grunt.registerTask('deploy', ['test', 'build', 'upload']);

  // TODO: delete these after configuring them and registering them as tasks
  grunt.loadNpmTasks('grunt-injector');

};