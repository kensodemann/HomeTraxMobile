(function() {
  'use strict';

  angular.module('homeTrax.common.resources.Stage', [
    'ngResource',
    'homeTrax.common.core.config'
  ]).factory('Stage', Stage);

  function Stage($resource, config) {
    return $resource(config.dataService + '/stages');
  }
}());
