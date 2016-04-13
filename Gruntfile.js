/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.

  // 相依性套件管理
     bower: {
      install: {
        options: {
          targetDir: './public/js/lib',
          layout: 'byComponent',
          install: true,
          verbose: false,
          cleanTargetDir: false,
          cleanBowerDir: false,
          bowerOptions: {}
        }
      }
    },


  // 複製js css 等等檔案
     bowercopy: {

        js:{
            options: {
               srcPrefix: 'bower_components',     //共同的來源文件夾路徑
               destPrefix: 'public/js/kit'        //共同的目的地文件夾路徑
            },
            files: {      // 目的地：來源 //
                'angular.min.js'              : 'angular/angular.min.js',

            }

        //結局：複製 bower_components/bootstrap/dist/js/bootstrap.min.js 到  bublic/js/kit/bootstrap.min.js
        },


        map:{

            options: {

               srcPrefix: 'bower_components',
               destPrefix: 'public/js/kit'
            },
            files: {

                'angular.min.js.map'         : 'angular/angular.min.js.map',

            }


        },


        css:{

            options: {

               srcPrefix: 'bower_components',
               destPrefix: 'public/css/kit'
            },
            files: {

                'angular-csp.css'  : 'angular/angular-csp.css'
            }

        },

        // font:{

        //     options: {

        //        srcPrefix: 'bower_components/',
        //        destPrefix: 'public/css/fonts'
        //     },
        //     files: {

        //     }

        // }

      },
  });
  
  

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-bowercopy');

    grunt.registerTask('myBower', ['bower']);
    grunt.registerTask('myBowercopy', ['bowercopy']);


};
