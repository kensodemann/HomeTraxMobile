(function() {
  'use strict';

  angular.module('homeTrax.common.services.timesheetTaskTimers', [
    'homeTrax.common.resources.TaskTimer',
    'homeTrax.common.resources.TaskTimerStart',
    'homeTrax.common.resources.TaskTimerStop'
  ]).factory('timesheetTaskTimers', timesheetTaskTimers);

  function timesheetTaskTimers(TaskTimer, TaskTimerStart, TaskTimerStop) {
    var forEach = angular.forEach;
    var currentTimesheet;

    var service = {
      all: [],

      load: load,
      get: getTaskTimers,
      totalTime: getTotalTime,
      create: newTaskTimer,
      add: addTaskTimer,
      delete: deleteTaskTimer,
      start: startTaskTimer,
      stop: stopTaskTimer
    };

    return service;

    function load(ts) {
      currentTimesheet = ts;
      service.all = TaskTimer.query({timesheetRid: ts._id});
      return service.all.$promise;
    }

    function getTaskTimers(dt) {
      return _.filter(service.all, function(t) {
        return t.workDate === dt;
      });
    }

    function getTotalTime(dt) {
      var time = 0;
      var taskTimers = (dt ? getTaskTimers(dt) : service.all);

      angular.forEach(taskTimers, function(t) {
        time += t.elapsedTime;
      });

      return time;
    }

    function newTaskTimer(dt) {
      return new TaskTimer({
        timesheetRid: currentTimesheet._id,
        workDate: dt
      });
    }

    function addTaskTimer(tt) {
      service.all.push(tt);
    }

    function deleteTaskTimer(tt) {
      return tt.$delete().then(removeFromAll);

      function removeFromAll() {
        var idx = _.findIndex(service.all, function(item) {
          return item._id === tt._id;
        });

        if (idx > -1) {
          service.all.splice(idx, 1);
        }
      }
    }

    function startTaskTimer(tt) {
      assertTaskTimerInCache(tt);
      stopRunningTimers();
      return TaskTimerStart.save(tt, copyData).$promise;
    }


    function stopTaskTimer(tt) {
      assertTaskTimerInCache(tt);
      return TaskTimerStop.save(tt, copyData).$promise;
    }

    function assertTaskTimerInCache(tt) {
      if (_.indexOf(service.all, tt) === -1) {
        throw new Error('Invalid Task Timer');
      }
    }

    function stopRunningTimers() {
      forEach(service.all, function(tt) {
        if (tt.isActive) {
          TaskTimerStop.save(tt, copyData);
        }
      });
    }

    function copyData(res) {
      var tt = _.find(service.all, function(timer) {
        return timer._id === res._id;
      });

      if (tt) {
        tt.isActive = res.isActive;
        tt.milliseconds = res.milliseconds;
        tt.startTime = res.startTime;
      }
    }
  }
}());
