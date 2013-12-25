module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mkdir:{
            all: {
                options: {
                    mode: 0766,
                    create: ['cache']
                }
            }
        },


        bump: {
            files: [ 'package.json']
        },

        version: {
            // options: {},
            defaults: {
                src: ['routes/index.js']
            }
        },

        concat: {
            options: {
                separator: ''
            },
            dist: {
                src: ['public/js/jquery-1.10.2.js'
                    ,'public/js/bootstrap.js'
                    ,'public/js/angular.js'
                    ,'public/js/angular-route.js'

                    ,'public/js/angular-animate.js'
					,'public/js/angular-touch.js'
                    ,'public/js/angular-translate.js'
                    ,'public/js/canvasjs.js'
                    ,'public/js/intouch.js'
                    ,'public/js/directive.js'
                    ,'public/js/factory.js'
                    ,'public/js/controllers/*.js'],
                dest: 'dist/public/js/<%= pkg.name %>.js'
            },
			css: {
				src: ['public/css/animations.css'
					,'public/css/bootstrap.css'
					,'public/css/style.css'],
				dest: 'dist/public/css/<%= pkg.name %>.css'
			}
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                mangle: false,
				sourceMap: 'dist/public/js/<%= pkg.name %>.min.map',


				sourceMappingURL: '<%= pkg.name %>.min.map', //points to the .map file in .min.js
				sourceMapPrefix: 3

            },
            dist: {
                files: {
                    'dist/public/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        copy:{
            main: {
                files: [


                    // includes files within path and its sub-directories
                    {expand: true, src: ['package.json'], dest: 'dist/'} ,
                    {expand: true, src: ['public/**'], dest: 'dist/'},
                    {expand: true, src: ['views/**'], dest: 'dist/'},
                    {expand: true, src: ['routes/**'], dest: 'dist/'},
                    {expand: true, src: ['app.js'], dest: 'dist/'},
                    {expand: true, src: ['views/layout_production.jade'], dest: 'dist/views/', rename:function(dest,src){
                        return dest+'layout.jade';
                    }}


                ]
            }
        }


    });


    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-bumpx');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-version');

    grunt.registerTask('default', ['bump','version','copy','concat', 'uglify','mkdir']);

};