/* jshint node: true */

var gulp = require('gulp');
var gutil = require('gulp-util');

var componentPaths = require('./conf/component-paths');
var concat = require('gulp-concat');
var copy = require('gulp-copy');
var del = require('del');
var minifyCss = require('gulp-minify-css');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
  fonts: [
    componentPaths.fonts.fontAwesome + '/**/*',
    componentPaths.fonts.ionic + '/**/*'
  ],
  images: [
    componentPaths.src + '/img/**/*'
  ],
  lib: [
    componentPaths.lib.ionicBundle.dev,
    componentPaths.lib.angularIos9UiWebviewPatch.dev,
    componentPaths.lib.angularMessages.dev,
    componentPaths.lib.angularResource.dev,
    componentPaths.lib.moment.dev,
    componentPaths.lib.underscore.dev
  ],
  libRelease: [
    componentPaths.lib.ionicBundle.release,
    componentPaths.lib.angularIos9UiWebviewPatch.release,
    componentPaths.lib.angularMessages.release,
    componentPaths.lib.angularResource.release,
    componentPaths.lib.moment.release,
    componentPaths.lib.underscore.release
  ],
  sass: [
    componentPaths.homeTraxSccs
  ],
  src: [
    componentPaths.src + '/app/**/module.js',
    componentPaths.src + '/app/app.js',
    componentPaths.src + '/app/**/*.js',
    '!' + componentPaths.src + '/app/**/*.spec.js'
  ],
  views: [
    componentPaths.src + '/**/*.html'
  ],
  watch: [
    componentPaths.src + '/**/*.scss',
    componentPaths.src + '/**/*.js',
    componentPaths.src + '/**/*.html',
    '!' + componentPaths.src + '/**/*.spec.js'
  ]
};

// Quality Tasks (linting, testing, etc)
gulp.task('deleteLintLog', function(done) {
  del(['jshint-output.log']).then(function() {
    done();
  });
});

gulp.task('lint', ['deleteLintLog', 'clean'], function() {
  var jshint = require('gulp-jshint');
  return gulp
    .src(__dirname + '/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('gulp-jshint-file-reporter'));
});

gulp.task('style', ['clean'], function() {
  var jscs = require('gulp-jscs');
  return gulp
    .src(__dirname + '/**/*.js')
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('test', function(done) {
  var Karma = require('karma').Server;
  var karma = new Karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
    browsers: ['PhantomJS'],
    reporters: 'dots'
  }, done);
  karma.start();
});

// Build Tasks
gulp.task('clean', function(done) {
  del(['./www']).then(function() {
    done();
  });
});

gulp.task('copyFonts', ['clean'], function() {
  gulp.src(paths.fonts)
    .pipe(copy('./www/css/fonts', {prefix: 3}));
});

gulp.task('copyImages', ['clean'], function() {
  gulp.src(paths.images)
    .pipe(copy('./www/img', {prefix: 2}));
});

gulp.task('copyViews', ['clean'], function() {
  gulp.src(paths.views)
    .pipe(copy('./www', {prefix: 1}));
});

gulp.task('buildCss', ['clean'], function() {
  var release = gutil.env.type === 'release';
  return gulp
    .src(paths.sass)
    .pipe(sass())
    .pipe(release ? minifyCss({keepSpecialComments: 0}) : gutil.noop())
    .pipe(gulp.dest('./www/css/'));
});

gulp.task('buildJs', ['clean'], function() {
  var annotate = require('gulp-ng-annotate');
  var uglify = require('gulp-uglify');
  var release = gutil.env.type === 'release';
  return gulp
    .src(paths.src)
    .pipe(release ? gutil.noop() : sourcemaps.init())
    .pipe(concat('homeTrax.js'))
    .pipe(annotate())
    .pipe(release ? gutil.noop() : sourcemaps.write())
    .pipe(release ? uglify() : gutil.noop())
    .pipe(gulp.dest('./www/'));
});

gulp.task('buildLibs', ['clean'], function() {
  var release = gutil.env.type === 'release';
  return gulp
    .src(gutil.env.type === 'release' ? paths.libRelease : paths.lib)
    .pipe(release ? gutil.noop() : sourcemaps.init())
    .pipe(concat('libs.js'))
    .pipe(release ? gutil.noop() : sourcemaps.write())
    .pipe(gulp.dest('./www/'));
});

// End user tasks
gulp.task('default', ['lint', 'style', 'buildCss', 'buildJs', 'buildLibs', 'copyFonts', 'copyImages', 'copyViews']);

gulp.task('dev', ['default'], function() {
  return gulp.watch(paths.watch, ['default']);
});
