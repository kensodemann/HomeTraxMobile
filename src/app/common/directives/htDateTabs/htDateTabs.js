(function() {
  'use strict';

  angular.module('penta.common.directives.htDateTabs', [])
    .directive('htDateTabs', htDateTabs)
    .controller('htDateTabsController', HtDateTabsController);

  function htDateTabs() {
    return {
      restrict: 'AE',
      scope: {
        ptiModel:'=ngModel',
        ptiDays: '=',
        ptiShowTotal: '='
      },
      templateUrl: 'app/common/directives/htDateTabs/htDateTabs.html',
      controller: 'htDateTabsController',
      controllerAs: 'controller',
      bindToController: true
    };
  }

  function HtDateTabsController() {
  }
}());
