(function() {
  'use strict';

  angular.module('homeTrax.common.resources.TaskTimer', [
    'ngResource',
    'homeTrax.common.core.config'
  ]).factory('TaskTimer', TaskTimer);

  function TaskTimer($resource, config) {
    var TaskTimerResource = $resource(config.dataService + '/timesheets/:timesheetRid/taskTimers/:id', {
      id: '@_id',
      timesheetRid: '@timesheetRid'
    });

    Object.defineProperty(TaskTimerResource.prototype, 'elapsedTime', {
      get: function elapsedTime() {
        var ms = this.milliseconds || 0;
        if (this.isActive) {
          ms += (this._currentTime - this.startTime);
        }

        return ms;
      }
    });

    return TaskTimerResource;
  }
}());