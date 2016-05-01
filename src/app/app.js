(function() {
  'use strict';

  angular.module('homeTrax', [
    'ionic',
    'LocalStorageModule',
    'ngIOS9UIWebViewPatch',
    'homeTrax.about.aboutController',
    'homeTrax.authentication.AuthenticationEvents',
    'homeTrax.authentication.authenticationInterceptor',
    'homeTrax.authentication.authenticationService',
    'homeTrax.common.services.systemMenu',
    'homeTrax.login.loginController',
    'homeTrax.main.mainController',
    'homeTrax.projects',
    'homeTrax.reports',
    'homeTrax.timesheets'
  ]).config(authentication)
    .config(routing)
    .config(localStorage)
    .run(initializePlatform)
    .run(inializeSystemMenu)
    .run(logStateChangeError)
    .run(refreshLogin)
    .run(redirectWhenNotAuthenticated);

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

  function initializePlatform($ionicPlatform) {
    // @ifdef MOBILE
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
    // @endif
  }

  function inializeSystemMenu($log, $rootScope, systemMenu) {
    systemMenu.initialize();
    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      $log.log('$stateChangeSuccess');
      var m = systemMenu.getNewItemMenuItem();
      if (m) {
        m.enabled = !!toState.htEnableNewItemMenuItem;
      }
    });
  }

  function refreshLogin($interval, authenticationService){
    var twentyMinutes = 20 * 60 * 1000;
    authenticationService.refreshLogin();
    $interval(authenticationService.refreshLogin, twentyMinutes);
  }

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
