(function() {
  'use strict';

  angular.module('homeTrax.common.directives.htTaskTimer', [
    'homeTrax.common.filters.hoursMinutes',
    'homeTrax.common.filters.projectName'
  ]).directive('htTaskTimer', htTaskTimer)
    .controller('htTaskTimerController', htTaskTimerController);

  function htTaskTimer() {
    return {
      restrict: 'E',
      templateUrl: 'app/common/directives/htTaskTimer/htTaskTimer.html',
      scope: {},
      bindToController: {
        htModel: '=ngModel',
        htClicked: '&',
        htToggled: '&'
      },
      controller: 'htTaskTimerController',
      controllerAs: 'controller'
    };
  }

  function htTaskTimerController() {
  }
}());
