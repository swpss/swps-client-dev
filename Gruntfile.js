module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            vendorJS: {
                src: [
                    'src/libs/angular/angular.min.js',
                    //'src/libs/dirPagination.js',
                    'src/libs/jquery/dist/jquery.min.js',
                    'src/libs/angular/angular-animate.min.js',
                    'src/libs/angular/angular-aria.min.js',
                    'src/libs/**/*.min.js'
                ],
                dest: 'dist/vendor.js'
            },
            vendorCSS: {
                src: ['src/libs/**/*.min.css', 'src/libs/datepicker/*.css'],
                dest: 'dist/vendor.css'
            },
            customJS: {
                src: [
                    'src/app.js',
                    'src/services/*.js',
                    'src/controllers/*.js'
                ],
                dest: '.temp/custom.js'
            },
            customCSS: {
                src: ['src/css/*.css'],
                dest: 'dist/custom.css'
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: [
                                '!libs/*',
                                '**/*.html',
                                'assets/**/*.svg'
                            ],
                        dest: 'dist/',
                        filter: 'isFile'
                    }
                ]
            },
            bootstrapFonts: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/libs/bootstrap/dist/',
                        src: [
                            'fonts/*',
                        ],
                        dest: 'dist/',
                        filter: 'isFile'
                    }
                ]
            }
        },
        'http-server': {
            dev: {
                root: 'dist/',
                port: 8000,
                host: '0.0.0.0'
            }
        },
        uglify: {
            customJS: {
                files: {
                    'dist/custom.js': ['.temp/custom.js']
                }
            }
        },
        clean: ['.temp/'],
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        }
    });

    // load the tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-karma');

    // register the task
    grunt.registerTask('build', ['concat', 'copy', 'uglify', 'clean']);
    grunt.registerTask('run', ['http-server']);
    grunt.registerTask('test', ['karma']);
    grunt.registerTask('default', ['build', 'test', 'run']);
}