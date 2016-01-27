var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var livereloadMiddleware = function (connect, options) {
  return [
    lrSnippet,
    serveStatic(options.base[0]),
    serveIndex(options.base[0])
  ];
};


module.exports = function(grunt){
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
  		
  		/* SERVER CONNECTION + LIVERELOAD*/
		connect: {
		  client: {
		    options: {
		      port: 9000,
		      base:'dist',
		      middleware: livereloadMiddleware
		    }
		  }
		},
		watch: {
		  site: {
		    files: ['dist/**/*'],
		    tasks:[],
		    options: {
		      livereload:LIVERELOAD_PORT
		    }
		  },
          html: {
            files: ['site/*.html'],
            tasks:['copy:html'],
          },
		  css: {
		    files: ['site/sass/**/*.scss'],
		    tasks:['compass','cssmin'],
		  },
		},
		/* PREPARE DEPLOY TASKS */
        copy: {
            html: {
                files: [
                  {expand: true, cwd:'site/', src: ['*.html'], dest: 'dist/', filter: 'isFile'}
                ]
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/css/min.css': ['site/sass/css/**/*.css']
                }
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'site/sass',
                    cssDir: 'site/sass/css',
                }
            }
        },
        concurrent: {
            dev: {
                tasks: ['watch:site', 'watch:css', 'watch:html'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
	});

    grunt.registerTask('preview', ['connect:client', 'concurrent']);
};