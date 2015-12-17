(function() {
  'use strict';

  angular.module('homeTrax.main.mainController', []).controller('mainController', MainController);

  function MainController($log) {
    $log.log('Instantiating main controller');
  }
}());
