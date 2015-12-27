(function() {
  'use strict';

  angular.module('homeTrax.common.resources.TaskTimerStop', [
    'ngResource',
    'homeTrax.common.core.config'
  ]).factory('TaskTimerStop', TaskTimerStop);

  function TaskTimerStop($resource, config) {
    return $resource(config.dataService + '/timesheets/:timesheetRid/taskTimers/:id/stop', {
      id: '@_id',
      timesheetRid: '@timesheetRid'
    });
  }
}());