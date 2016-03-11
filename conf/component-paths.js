/*jshint node: true */

module.exports = {
  bower_components: 'bower_components',
  homeTraxSccs: 'src/scss/homeTrax.scss',
  test: 'tests',
  src: 'src',
  buildDir: 'www',
  lib: {
    ionicBundle: {
      dev: 'bower_components/ionic/js/ionic.bundle.js',
      release: 'bower_components/ionic/js/ionic.bundle.min.js'
    },
    angularIos9UiWebviewPatch: {
      dev: 'patches/angular-ios9-uiwebview.patch.js',
      release: 'patches/angular-ios9-uiwebview.patch.min.js'
    },
    angularLocalStorage: {
      dev: 'bower_components/angular-local-storage/dist/angular-local-storage.js',
      release: 'bower_components/angular-local-storage/dist/angular-local-storage.min.js'
    },
    angularMessages: {
      dev: 'bower_components/angular-messages/angular-messages.js',
      release: 'bower_components/angular-messages/angular-messages.min.js'
    },
    angularMocks: {
      dev: 'bower_components/angular-mocks/angular-mocks.js'
    },
    angularResource: {
      dev: 'bower_components/angular-resource/angular-resource.js',
      release: 'bower_components/angular-resource/angular-resource.min.js'
    },
    moment: {
      dev: 'bower_components/moment/min/moment-with-locales.js',
      release: 'bower_components/moment/min/moment-with-locales.min.js'
    },
    underscore: {
      dev: 'bower_components/underscore/underscore.js',
      release: 'bower_components/underscore/underscore-min.js'
    }
  },
  fonts: {
    fontAwesome: 'bower_components/font-awesome/fonts',
    ionic: 'bower_components/ionic/fonts'
  }
};
