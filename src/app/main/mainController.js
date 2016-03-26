(function() {
  'use strict';

  angular.module('homeTrax.main.mainController', [
    'ui.router',
    'homeTrax.authentication.authenticationService',
    'homeTrax.common.services.systemMenu'
  ]).controller('mainController', MainController);

  function MainController($state, authenticationService, systemMenu) {
    var controller = this;

    controller.logout = logout;

    systemMenu.initialize();

    function logout() {
      authenticationService.logoutUser();
      $state.go('login');
    }
  }
}());
