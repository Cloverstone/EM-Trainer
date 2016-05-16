module.exports = function(grunt) {

  //Initializing the configuration object
    grunt.initConfig({

		hogan: {
      views: {
        src: [
          './views/*.mustache',
          './modules/*/views/*.mustache',
        ],
        dest: './js/views.js',
				options : { binderName: 'hulk' }
      },
    },
    watch: {
        views: {
          files: [
            //watched files
            './views/*.mustache',
            './modules/*/views/*.mustache',
            ],
          tasks: ['hogan:views'],     //tasks to run
          options: {
            livereload: true                        //reloads the browser
          }
        },
      }
    });

  // Plugin loading
  grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-hogan');
  // Task definition
  grunt.registerTask('default', ['watch']);

};
