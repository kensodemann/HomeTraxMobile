(function() {
  'use strict';

  angular.module('homeTrax.common.resources.Project', [
    'ngResource',
    'homeTrax.common.core.config'
  ]).factory('Project', Project);

  function Project($resource, config) {
    return $resource(config.dataService + '/projects/:id', {
      id: '@_id'
    });
  }
}());
