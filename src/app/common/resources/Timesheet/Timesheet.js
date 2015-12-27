(function() {
  'use strict';

  angular.module('homeTrax.common.resources.Timesheet', [
    'ngResource',
    'homeTrax.common.core.config'
  ]).factory('Timesheet', Timesheet);

  function Timesheet($resource, config) {
    return $resource(config.dataService + '/timesheets/:id', {
      id: '@_id'
    });
  }
}());
