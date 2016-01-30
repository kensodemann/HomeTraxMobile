(function() {
  'use strict';

  angular.module('homeTrax.common.directives.htItemFinderDialog', [
    'homeTrax.common.directives.htItemFinder'
  ]).directive('htItemFinderDialog', htItemFinderDialog)
    .controller('htItemFinderDialogController', HtItemFinderDialogController);

  function htItemFinderDialog() {
    return {
      restrict: 'E',
      templateUrl: 'app/common/directives/htItemFinderDialog/htItemFinderDialog.html',
      scope: {},
      bindToController: {
        htItem: '=ngModel',
        htItems: '=',
        htTitle: '@',
        htDialog: '='
      },
      controller: 'htItemFinderDialogController',
      controllerAs: 'controller'
    };
  }

  function HtItemFinderDialogController($scope) {
    var controller = this;

    activate();

    function activate() {
      $scope.$watch('controller.htItem', function(newValue, oldValue) {
        if (newValue && newValue !== oldValue) {
          controller.htDialog.hide();
        }
      });
    }
  }
}());
