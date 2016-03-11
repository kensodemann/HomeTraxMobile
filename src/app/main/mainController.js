(function() {
  'use strict';

  angular.module('homeTrax.main.mainController', [
    'ui.router',
    'homeTrax.authentication.authenticationService'
  ]).controller('mainController', MainController);

  function MainController($state, authenticationService) {
    var controller = this;

    controller.logout = logout;

    function logout() {
      authenticationService.logoutUser();
      $state.go('login');
    }
  }
}());
