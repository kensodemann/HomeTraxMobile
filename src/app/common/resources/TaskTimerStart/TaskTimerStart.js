(function() {
  'use strict';

  angular.module('homeTrax.common.resources.TaskTimerStart', [
    'ngResource',
    'homeTrax.common.core.config'
  ]).factory('TaskTimerStart', TaskTimerStart);

  function TaskTimerStart($resource, config) {
    return $resource(config.dataService + '/timesheets/:timesheetRid/taskTimers/:id/start', {
      id: '@_id',
      timesheetRid: '@timesheetRid'
    });
  }
}());