var browsersList = require('./package.json')['browserslist']

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-postcss')
  require('load-grunt-tasks')(grunt)
  grunt.loadTasks('grunt/tasks')

  grunt.initConfig({
    clean: ['dist', 'docs'],
    shell: {
      upgrade: {
        command: 'bundle exec rake ustyle:upgrade'
      },
      publish: {
        command: 'bundle exec rake ustyle:publish'
      }
    },
    version: {
      project: {
        src: ['package.json', 'lib/ustyle/version.rb']
      }
    },
    postcss: {
      options: {
        map: false,
        processors: [
          require('autoprefixer')({
            browsers: browsersList
          })
        ]
      },
      dist: { src: ['docs/**/*.css', 'dist/**/*.css'] }
    },
    watch: {
      options: {
        spawn: false
      },
      build: {
        files: ['vendor/assets/**/*', 'styleguide/**/*', 'dist/ustyle.json'],
        tasks: ['copy', 'sass', 'sassdoc', 'postcss', 'browserSync-inject', 'styleguide', 'builder']
      },
      scripts: {
        files: ['styleguide/**/*.js', 'vendor/**/*.js'],
        tasks: ['concat']
      }
    },
    svgstore: {
      options: {
        prefix: 'icon-'
      },
      default: {
        files: {
          'vendor/assets/images/icons.svg': ['vendor/assets/images/icons/*.svg'],
          'dist/icons.svg': ['vendor/assets/images/icons/*.svg'],
          'styleguide/assets/images/icons.svg': ['vendor/assets/images/icons/*.svg']
        }
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'vendor/assets/images/icons/',
          src: '{,*/}*.svg',
          dest: 'vendor/assets/images/icons/'
        }]
      }
    },
    styleguide: {
      dist: {
        src: 'vendor/assets/stylesheets/ustyle/**/*.scss',
        dir: 'styleguide',
        output: 'dist/ustyle.json',
        statsFor: 'https://assets0.uswitch.com/s3/uswitch-assets-eu/ustyle/{#tag}/ustyle-latest.css',
        tagPlaceholder: '{#tag}',
        tagStartVersion: '0.9.9'
      }
    },
    builder: {
      dist: {
        files: {
          'docs/': 'dist/ustyle.json'
        }
      }
    },
    sass: {
      dist: {
        options: {
          loadPath: ['vendor/assets/stylesheets/ustyle', 'styleguide/assets/sass'],
          require: './lib/ustyle.rb',
          style: 'compressed',
          sourcemap: 'none',
          bundleExec: true
        },
        files: {
          'dist/ustyle-latest.css': 'vendor/assets/stylesheets/ustyle.scss',
          'dist/ustyle-content.css': 'vendor/assets/stylesheets/ustyle-content.scss',
          'dist/rebrand-latest.css': 'vendor/assets/stylesheets/rebrand/ustyle.scss',
          'dist/rebrand-content.css': 'vendor/assets/stylesheets/rebrand/ustyle-content.scss',
          'docs/css/main.css': 'styleguide/assets/sass/main.scss',
          'docs/css/rebrand.css': 'styleguide/assets/sass/rebrand.scss'
        }
      }
    },
    concat: {
      ustyle: {
        src: [
          'vendor/assets/javascripts/ustyle/utils.js',
          'vendor/assets/javascripts/ustyle/anchor.js',
          'vendor/assets/javascripts/ustyle/backdrop.js',
          'vendor/assets/javascripts/ustyle/overlay.js',
          'vendor/assets/javascripts/ustyle/tabs.js',
          'vendor/assets/javascripts/ustyle/classtoggler.js'
        ],
        dest: 'dist/ustyle.js'
      },
      app: {
        src: [
          'styleguide/assets/javascripts/vendor/*.js',
          'dist/ustyle.js',
          'styleguide/assets/javascripts/modules/*.js',
          'styleguide/assets/javascripts/*.js'
        ],
        dest: 'docs/js/app.js'
      }
    },
    uglify: {
      ustyle: {
        files: {
          'dist/ustyle.min.js': ['dist/ustyle.js'],
          'docs/js/app.min.js': ['docs/js/app.js']
        }
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, flatten: true, src: ['dist/*.css'], dest: 'docs/css/'},
          {expand: true, flatten: true, src: ['styleguide/assets/images/**'], dest: 'docs/images/'},
          {expand: true, flatten: true, src: ['styleguide/CNAME'], dest: 'docs/'}
        ]
      }
    },
    sassdoc: {
      default: {
        src: ['vendor/assets/stylesheets/ustyle/**/*.scss'],
        options: {
          dest: './docs/sass',
          exclude: [
            './vendor/assets/stylesheets/ustyle/rebrand/vendor/*'
          ]
        }
      }
    },
    scsslint: {
      allFiles: [
        './vendor/assets/stylesheets/**/*.scss',
        './styleguide/assets/sass/**/*.scss'
      ],
      options: {
        bundleExec: true,
        config: 'config/scss-lint.yml',
        reporterOutput: null,
        exclude: [
          './vendor/assets/stylesheets/ustyle/vendor/*',
          './vendor/assets/stylesheets/ustyle/rebrand/vendor/*',
          './styleguide/assets/sass/vendor/*'
        ]
      }
    },
    standard: {
      options: {
        fix: true,
        globals: [
          'google',
          '$',
          'cleanWhiteSpace',
          'svg4everybody',
          'hljs',
          'Overlay',
          'ClassToggler',
          'Tabs',
          'reportData'
        ]
      },
      ustyle: {
        src: [
          './grunt/**/*.js',
          './styleguide/**/!(vendor)/*.js',
          './vendor/**/*.js',
          '*.js'
        ]
      }
    },
    env: {
      dev: {
        NODE_ENV: 'development'
      },
      build: {
        NODE_ENV: 'production'
      }
    },
    buildcontrol: {
      options: {
        dir: 'docs/',
        commit: true,
        push: true,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      pages: {
        options: {
          remote: 'git@github.com:uswitch/ustyle.git',
          branch: 'gh-pages'
        }
      }
    }
  })

  grunt.registerTask('lint', ['scsslint', 'standard'])
  grunt.registerTask('icons', ['svgstore'])

  grunt.registerTask('build', ['clean', 'sass', 'sassdoc', 'copy', 'concat:ustyle', 'concat:app', 'uglify:ustyle', 'lint', 'postcss', 'styleguide', 'builder', 'icons'])

  grunt.registerTask('publish', ['env:build', 'build'])

  grunt.registerTask('publish:version', 'Build and publish ustyle version', function (version) {
    if (version === null) {
      grunt.warn('Version must be specified when publishing ustyle')
    }

    grunt.task.run('env:build', 'version::' + version, 'build', 'shell:upgrade')
  })

  grunt.registerTask('deploy', ['shell:publish'])

  grunt.registerTask('default', ['env:dev', 'build', 'browserSync-init', 'watch'])
}
