module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			beforeconcat: ['Gruntfile.js', 'di/**/*.js', 'tests/spec/**/*.js']
		},
		
        jasmine : {
            src : 'di/di.js',
            options : {
                specs : 'tests/spec/**/*Spec.js'
            }
        },
		
		uglify: {
			main: {
				files: {
					'di/di.min.js': ['di/di.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['jshint', 'jasmine', 'uglify']);
};