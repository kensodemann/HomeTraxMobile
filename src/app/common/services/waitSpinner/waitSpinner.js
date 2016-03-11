(function() {
  'use strict';

  angular.module('homeTrax.common.services.waitSpinner', []).factory('waitSpinner', waitSpinner);

  function waitSpinner($ionicLoading) {
    return {
      show: show,
      hide: hide
    };

    function show(opt) {
      $ionicLoading.show(opt || {template: '<ion-spinner></ion-spinner>'});
    }

    function hide() {
      $ionicLoading.hide();
    }
  }
}());
