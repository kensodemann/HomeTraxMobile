(function() {
  'use strict';

  angular.module('homeTrax.common.directives.htSearch', [])
    .directive('htSearch', htSearch);

  function htSearch() {
    return {
      restrict: 'E',
      templateUrl: 'app/common/directives/htSearch/htSearch.html',
      scope: {
        htModel: '=ngModel',
        htPlaceholder: '@'
      }
    };
  }
}());
