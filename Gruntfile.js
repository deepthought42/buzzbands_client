module.exports = function(grunt) {

  grunt.initConfig({

    // get the configuration info from package.json ----------------------------
    // this way we can use things like name and version (pkg.name)
    pkg: grunt.file.readJSON('package.json'),

    // all of our configuration will go here
    // configure jshint to validate js files -----------------------------------
        jshint: {
          options: {
            reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
          },

          // when this task is run, lint the Gruntfile and all js files in src
          build: ['Gruntfile.js', 'a/**/*.js']
        },

      // configure uglify to minify js files -------------------------------------
      uglify: {
        js: { //target
            src: ['./public/min/app.js'],
            dest: './public/min/app.js'
        }
      },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      app: {
        files: {
          './public/min-safe/js/appFactory.js': ['./public/js/appFactory.js'],
          './public/min-safe/js/FormController.js': ['./public/js/FormController.js'],
          './public/min-safe/app.js': ['./public/js/app.js']
        }
      }
    },

    concat: {
      js: { //target
        src: ['./public/min-safe/app.js', './public/min-safe/js/*.js'],
        dest: './public/min/app.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.registerTask('default', ['ngAnnotate', 'concat', 'uglify']);

};
