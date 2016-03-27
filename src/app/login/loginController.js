(function() {
  'use strict';

  angular.module('homeTrax.login.loginController', [
    'ui.router',
    'homeTrax.authentication.authenticationService',
    'homeTrax.common.services.stages'
  ]).controller('loginController', LoginController)
    .config(function($stateProvider) {
      $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'loginController as controller',
        cache: false
      });
    });

  function LoginController($state, $ionicHistory, authenticationService, waitSpinner, stages) {
    var controller = this;

    controller.username = '';
    controller.password = '';
    controller.errorMessage = '';

    controller.login = login;
    controller.clearErrorMessage = clearErrorMessage;

    function login() {
      waitSpinner.show();
      var p = authenticationService.authenticateUser(controller.username, controller.password);
      p.then(handleResult);
      return p;

      function handleResult(success) {
        controller.password = '';
        waitSpinner.hide();
        if (success) {
          stages.load();
          $ionicHistory.clearHistory();
          $ionicHistory.clearCache().then(function(){
            $state.go('app.timesheets.viewCurrent');
          });
        }
        else {
          controller.errorMessage = 'Invalid Username or Password';
        }
      }
    }

    function clearErrorMessage() {
      controller.errorMessage = '';
    }
  }
}());
