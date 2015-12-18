(function() {
  'use strict';

  angular.module('homeTrax', [
      'ionic',
      'LocalStorageModule',
      'ngIOS9UIWebViewPatch',
      'homeTrax.about.aboutController',
      'homeTrax.authentication.authenticationErrorInterceptor',
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

    .config(function($stateProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider) {
      // user navigates to top level "route" (directory).
      $urlRouterProvider.when('', '/login');

      $httpProvider.defaults.withCredentials = true;
      $httpProvider.interceptors.push('authenticationErrorInterceptor');

      localStorageServiceProvider.setPrefix('HomeTrax');

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
}());
