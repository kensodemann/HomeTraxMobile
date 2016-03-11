/* jshint node: true */

var gulp = require('gulp');
var gutil = require('gulp-util');

var componentPaths = require('./conf/component-paths');
var concat = require('gulp-concat');
var copy = require('gulp-copy');
var del = require('del');
var minifyCss = require('gulp-minify-css');
var preprocess = require('gulp-preprocess');
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
    componentPaths.lib.angularLocalStorage.dev,
    componentPaths.lib.angularIos9UiWebviewPatch.dev,
    componentPaths.lib.angularMessages.dev,
    componentPaths.lib.angularResource.dev,
    componentPaths.lib.moment.dev,
    componentPaths.lib.underscore.dev
  ],
  libRelease: [
    componentPaths.lib.ionicBundle.release,
    componentPaths.lib.angularLocalStorage.release,
    componentPaths.lib.angularIos9UiWebviewPatch.release,
    componentPaths.lib.angularMessages.release,
    componentPaths.lib.angularResource.release,
    componentPaths.lib.moment.release,
    componentPaths.lib.underscore.release
  ],
  main: componentPaths.src + '/main.js',
  package: 'package.json',
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
    componentPaths.src + '/**/*.html'
  ]
};

function isReleaseBuild() {
  return gutil.env.type === 'release';
}

function useCloud9() {
  return gutil.env.dataSource === 'c9';
}

function useOpenShift() {
  return gutil.env.dataSource === 'openshift';
}

function isElectronBuild() {
  return gutil.env.build === 'electron';
}

function getBuildContext() {
  var build = {
    context: {}
  };

  if (isReleaseBuild()) {
    build.context.RELEASE = true;
  } else {
    build.context.DEVELOPMENT = true;
  }

  if (isElectronBuild()) {
    build.context.ELECTRON = true;
  } else {
    build.context.MOBILE = true;
  }

  if (useCloud9()) {
    build.context.CLOUD9 = true;
  } else if (useOpenShift()) {
    build.context.OPENSHIFT = true;
  } else {
    build.context.LOCAL = true;
  }

  return build;
}

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

gulp.task('test', ['build'], function(done) {
  var Karma = require('karma').Server;
  var confFile = isElectronBuild() ? '/karma-electron.conf.js' : '/karma.conf.js';
  var browsers = isElectronBuild() ? ['Electron'] : ['PhantomJS'];
  var karma = new Karma({
    configFile: __dirname + confFile,
    singleRun: true,
    browsers: browsers,
    reporters: 'dots'
  }, done);
  karma.start();
});

// Build Tasks
gulp.task('clean', function(done) {
  del(['./www', './HomeTrax-*']).then(function() {
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

gulp.task('copyElectronFiles', ['clean'], function() {
  if (isElectronBuild()) {
    gulp.src(paths.main).pipe(copy('./www', {prefix: 1}));
    gulp.src(paths.package).pipe(copy('./www'));
  }
});

gulp.task('copyViews', ['clean'], function() {
  var build = getBuildContext();
  return gulp.src(paths.views)
    .pipe(preprocess(build))
    .pipe(gulp.dest('./www', {prefix: 1}));
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
  var release = isReleaseBuild();
  var build = getBuildContext();

  return gulp
    .src(paths.src)
    .pipe(release ? gutil.noop() : sourcemaps.init())
    .pipe(preprocess(build))
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
gulp.task('build', ['clean', 'buildCss', 'buildJs', 'buildLibs', 'copyElectronFiles', 'copyFonts', 'copyImages', 'copyViews'], function(done) {
  var packager = require('electron-packager');

  if (isElectronBuild()) {
    packager({
      'app-bundle-id': 'com.ken.sodemann.homeTrax',
      arch: 'x64',
      dir: 'www/',
      icon: 'resources/icon.icns',
      name: 'HomeTrax',
      platform: 'darwin'
    }, function() {
      done();
    });
  } else {
    done();
  }
});

gulp.task('default', ['lint', 'style', 'test', 'build']);

gulp.task('dev', ['default'], function() {
  return gulp.watch(paths.watch, ['default']);
});
