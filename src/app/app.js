(function() {
  'use strict';

  angular.module('homeTrax', [
    'ionic',
    'LocalStorageModule',
    'ngIOS9UIWebViewPatch',
    'homeTrax.about.aboutController',
    'homeTrax.authentication.AuthenticationEvents',
    'homeTrax.authentication.authenticationInterceptor',
    'homeTrax.login.loginController',
    'homeTrax.main.mainController',
    'homeTrax.projects',
    'homeTrax.reports',
    'homeTrax.timesheets'
  ]).config(authentication)
    .config(routing)
    .config(localStorage)
    .run(function($log, $ionicPlatform, $rootScope, $state, AuthenticationEvents) {
      // @ifdef MOBILE
      initializePlatform($ionicPlatform);
      // @endif
      logStateChangeError($rootScope, $log);
      redirectWhenNotAuthenticated($rootScope, AuthenticationEvents, $state);
    });

  function authentication($httpProvider) {
    $httpProvider.interceptors.push('authenticationInterceptor');
  }

  function routing($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', '/app/timesheets/view');
    $urlRouterProvider.otherwise('/app/timesheets/view');

    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'app/main/main.html',
        controller: 'mainController as controller'
      });
  }

  function localStorage(localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('HomeTrax');
  }

  // @ifdef MOBILE
  function initializePlatform($ionicPlatform) {
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
    });
  }
  // @endif

  function logStateChangeError($rootScope, $log) {
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      $log.error('$stateChangeError');
      $log.error(toState);
      $log.error(error);
    });
  }

  function redirectWhenNotAuthenticated($rootScope, AuthenticationEvents, $state) {
    $rootScope.$on(AuthenticationEvents.notAuthenticated, function() {
      $state.go('login');
    });
  }
}());
