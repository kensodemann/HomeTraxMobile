/* jshint node: true */
var componentPaths = require('./conf/component-paths');

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['mocha', 'chai', 'sinon-chai'],

    files: [
      componentPaths.lib.ionicBundle.dev,
      componentPaths.lib.angularLocalStorage.dev,
      componentPaths.lib.angularMessages.dev,
      componentPaths.lib.angularMocks.dev,
      componentPaths.lib.angularResource.dev,
      componentPaths.lib.moment.dev,
      componentPaths.lib.underscore.dev,

      componentPaths.buildDir + '/homeTrax.js',
      componentPaths.src + '/app/**/*.spec.js',
      componentPaths.src + '/app/**/*.html'
    ],

    preprocessors: {
      '**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/'
    },

    reporters: ['progress'],

    port: 9876,

    colors: true,

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['PhantomJS'],

    singleRun: true,

    client: {
      captureConsole: false
    }
  });
};
