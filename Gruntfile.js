require('load-grunt-tasks')(grunt); // in lieu of grunt.loadNpmTasks('grunt-*'), which need to be deleted below

// FIXME: all of the below
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
        options: {
          configFile: ''
        }
        target: ['file.js']
    }
  });
   
  grunt.registerTask('default', ['eslint']);

// TODO: delete these after configuring them and registering them as tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

};