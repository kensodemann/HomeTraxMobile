(function() {
  'use strict';

  angular.module('homeTrax.common.directives.htDateTabs', [])
    .directive('htDateTabs', htDateTabs)
    .controller('htDateTabsController', HtDateTabsController);

  function htDateTabs() {
    return {
      restrict: 'AE',
      scope: {
        htModel: '=ngModel',
        htTimesheet: '='
      },
      templateUrl: 'app/common/directives/htDateTabs/htDateTabs.html',
      controller: 'htDateTabsController',
      controllerAs: 'controller',
      bindToController: true
    };
  }

  function HtDateTabsController($scope, $window) {
    var controller = this;

    controller.days = [];

    activate();

    function activate() {
      $scope.$watch('controller.htTimesheet', function(newValue) {
        if (newValue) {
          buildDays();
        }
      });
    }

    function buildDays() {
      if (controller.htTimesheet.endDate) {
        controller.days.splice(0, controller.days.length);
        var dt = (new $window.moment(controller.htTimesheet.endDate)).subtract(6, 'days');
        for (var i = 0; i < 7; i++) {
          var dtStr = dt.toISOString().substring(0, 10);
          controller.days.push({
            date: new Date(dt),
            dateString: dtStr,
            selected: (controller.htModel === dtStr)
          });
          dt.add(1, 'day');
        }
      }
    }
  }
}());
