// eslint-disable-next-line
require('load-grunt-tasks')(grunt); // in lieu of grunt.loadNpmTasks('grunt-*'), which need to be deleted below

// FIXME: test initConfig
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    concat: {
      options: {
        separator: ';\n'
      },
      dist: {
        src: ['src/client/assets/scripts/*.js'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    csslint: {
      strict: {
        options: {
          import: 2
        },
        src: ['src/assets/styles/*.css']
      }
    },

    cssmin: {
      target: {
        files: [{
          src: 'src/assets/styles/*.css',
          dest: 'dist/css',
          ext: '.min.css'
        }]
      }
    },

    eslint: {
      target: ['src/assets/scripts/*.js']
    },

    uglify: {
      //TODO
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
      }
    }

  });

// TODO: register tasks
  grunt.registerTask('default', ['eslint']);

// TODO: delete these after configuring them and registering them as tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-csslint');

};