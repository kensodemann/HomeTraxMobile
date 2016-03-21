(function() {
  'use strict';

  angular.module('homeTrax.common.directives.htItemFinder', [])
    .directive('htItemFinder', htItemFinder)
    .controller('htItemFinderController', HtItemFinderController);

  function htItemFinder() {
    return {
      restrict: 'E',
      templateUrl: 'app/common/directives/htItemFinder/htItemFinder.html',
      scope: {},
      bindToController: {
        htSelectedItem: '=',
        htItems: '=',
        htFilter: '=',
        htTemplateUrl: '@'
      },
      controller: 'htItemFinderController',
      controllerAs: 'controller'
    };
  }

  function HtItemFinderController() {
    var controller = this;

    controller.templateUrl = controller.htTemplateUrl || 'app/common/templates/objectName.html';

    controller.select = selectItem;

    function selectItem(item) {
      controller.htSelectedItem = item;
    }
  }
}());
