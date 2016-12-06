// FIXME: test initConfig
module.exports = function(grunt) {

  // eslint-disable-next-line
  require('load-grunt-tasks')(grunt); // in lieu of grunt.loadNpmTasks('grunt-*'), which need to be deleted below

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    concat: {
      options: {
        separator: ';\n'
      },
      js: {
        src: ['src/client/assets/scripts/minified/*.min.js'],
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
          '!src/client/assets/styles/normalize.css'
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
      target: [
        'src/**/*.js',
        'Gruntfile.js'
      ]
    },

    nodemon: {
      dev: {
        script: 'src/server/server.js',
        options: {
          nodeArgs: ['--inspect']
        }
      }
    },

    uglify: {
      target: {
        files: [{
          expand: true,
          cwd: 'src/client/assets/scripts',
          src: ['*.js', '!*.min.js'],
          dest: 'src/client/assets/scripts/minified',
          ext: '.min.js'

        }]
      }
    },

    watch: {
      options: {
        livereload: true // on 35729 by default or 3300 where our server is?
      },
      css: {
        files: 'src/client/assets/styles/*.css',
        tasks: [],
        options: {
          
        }
      },
      scripts: {
        files: 'src/client/assets/scripts/*.js',
        tasks: [],
        options: {

        }
      },
      html: {
        files: 'src/client/index.html',
        tasks: [],
        options: {

        }
      }
    }
  });

// TODO: register tasks
  grunt.registerTask('default', ['dev']);
  grunt.registerTask('dev', ['concurrent:dev']);
  grunt.registerTask('test', ['eslint', 'csslint']);
  grunt.registerTask('build', ['cssmin', 'uglify', 'concat']);
  grunt.registerTask('upload', []);
  grunt.registerTask('deploy', ['test', 'build', 'upload']);

// TODO: delete these after configuring them and registering them as tasks
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');

};