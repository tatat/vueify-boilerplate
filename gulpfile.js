'use strict'

process.env.NODE_ENV = process.env.NODE_ENV || 'local'

const gulp = require('gulp')
const $ = require('gulp-load-plugins')()
const browserify = require('browserify')
const babelify = require('babelify')
const vueify = require('vueify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const argv = require('yargs').argv
const rimraf = require('rimraf')

const OUTPUT_DIR = argv.output || (process.env.NODE_ENV === 'local' ? 'tmp/build' : 'build')
const HOST = argv.host || '0.0.0.0'
const PORT = parseInt(argv.port || '8000', 10)

const isProduction = () => process.env.NODE_ENV === 'production'
const isNotProduction = () => !isProduction()

gulp.task('environment', cb => {
  const path = `./config/environments/${process.env.NODE_ENV}`
  delete require.cache[require.resolve(path)]
  process.env.ENV = JSON.stringify(require(path))
  cb()
})

gulp.task('build:vueify', () => {
  return browserify({
    entries: ['src/application.js'],
    debug: true,
    paths: ['./node_modules', './src']
  }).transform(babelify, {
      presets: ['es2015'],
      plugins: ['transform-runtime', 'transform-inline-environment-variables']
    })
    .transform(vueify)
    .bundle()
    .on('error', function(error) {
      $.util.log($.util.colors.red('Found unhandled error:\n'), error.toString())
      this.emit('end')
    })
    .pipe($.plumber())
    .pipe(source('application.js'))
    .pipe(buffer())
    .pipe($.if(isNotProduction, $.sourcemaps.init({loadMaps: true})))
    .pipe($.if(isProduction, $.uglify()))
    .pipe($.if(isNotProduction, $.sourcemaps.write('.')))
    .pipe(gulp.dest(OUTPUT_DIR))
})

gulp.task('build:views', () => {
  return gulp.src('src/views/**/*.pug', {base: 'src/views'})
    .pipe($.plumber())
    .pipe($.pug())
    .pipe(gulp.dest(OUTPUT_DIR))
})

gulp.task('build:assets', () => {
  return gulp.src('src/assets/**/*', {base: 'src/assets'})
    .pipe($.plumber())
    .pipe(gulp.dest(OUTPUT_DIR))
})

gulp.task('build:clean', rimraf.bind(null, OUTPUT_DIR))
gulp.task('build', gulp.parallel('build:vueify', 'build:views', 'build:assets'))

gulp.task('server', () => {
  return gulp.src(OUTPUT_DIR)
    .pipe($.webserver({host: HOST, port: PORT, livereload: true}))
})

gulp.task('watch', () => {
  gulp.watch(['config/environments/*.js'], gulp.series('environment', 'build'))
  gulp.watch(['src/*.{js,vue,styl}', 'src/{lib,mixins,components}/**/*.{js,vue,styl}', 'config/environments/*.js'], gulp.parallel('build:vueify'))
  gulp.watch(['src/views/**/*.pug'], gulp.parallel('build:views'))
  gulp.watch(['src/assets/**/*'], gulp.parallel('build:assets'))
})

gulp.task('default', gulp.series('environment', 'build:clean', 'build', 'server', 'watch'))
