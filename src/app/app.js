// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('homeTrax', [
    'ionic',
    'ngIOS9UIWebViewPatch',
    'homeTrax.about.aboutController',
    'homeTrax.main.mainController',
    'homeTrax.projects',
    'homeTrax.reports',
    'homeTrax.timesheets'
  ])

  .run(function($log, $ionicPlatform, $rootScope) {
    $log.log('starting up');

    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        window.StatusBar.styleDefault();
      }

      $log.log('ready');
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      $log.error('$stateChangeError');
      $log.error(toState);
      $log.error(error);
    });
  })

  .config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    // user navigates to top level "route" (directory).
    $urlRouterProvider.when('', '/login');

    $httpProvider.defaults.withCredentials = true;
    //$httpProvider.interceptors.push('authErrorInterceptor');

    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'app/main/main.html',
        controller: 'mainController as controller'
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/timesheets/list');
  });
