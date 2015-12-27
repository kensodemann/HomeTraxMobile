(function() {
  'use strict';

  angular.module('homeTrax.common.services.timesheets', [
    'homeTrax.authentication.identity',
    'homeTrax.common.resources.Timesheet',
    'homeTrax.common.services.dateUtility'
  ]).factory('timesheets', timesheets);

  function timesheets($q, Timesheet, identity, dateUtility) {
    var timesheetCache;
    var previousUser;

    return {
      get: getTimesheet,
      getCurrent: getCurrentTimesheet,
      refresh: getAllTimesheets,

      get all() {
        if (!cacheIsValid()) {
          getAllTimesheets();
        }

        return timesheetCache;
      }
    };

    function getAllTimesheets() {
      previousUser = identity.currentUser;
      timesheetCache = Timesheet.query();
    }

    function getTimesheet(id) {
      var dfd = $q.defer();

      var ts = findInCache(id);
      if (ts) {
        dfd.resolve(ts);
      } else {
        Timesheet.get({id: id}, dfd.resolve, dfd.reject);
      }

      return dfd.promise;
    }

    function findInCache(id) {
      var ts;
      if (cacheIsValid()) {
        ts = _.find(timesheetCache, function(ts) {
          return ts._id === id;
        });
      }

      return ts;
    }

    function getCurrentTimesheet() {
      var dfd = $q.defer();
      var today = dateUtility.removeTimezoneOffset(new Date());
      var weekEndDate = dateUtility.weekEndDate(today).toISOString().substring(0, 10);

      var ts = findCurrentInCache(weekEndDate);
      if (ts) {
        dfd.resolve(ts);
      } else {
        getCurrentFromDataService(dfd, weekEndDate);
      }

      return dfd.promise;
    }

    function findCurrentInCache(weekEndDate) {
      var ts;
      if (cacheIsValid()) {
        ts = _.find(timesheetCache, function(t) {
          return t.endDate === weekEndDate;
        });
      }

      return ts;
    }

    function getCurrentFromDataService(dfd, weekEndDate) {
      Timesheet.query({
        endDate: weekEndDate
      }, success, dfd.reject);

      function success(matching) {
        if (matching.length === 0) {
          var ts = new Timesheet({
            endDate: weekEndDate
          });
          ts.$save(dfd.resolve, dfd.reject);
        } else {
          dfd.resolve(matching[0]);
        }
      }
    }

    function cacheIsValid() {
      return timesheetCache && identity.currentUser === previousUser;
    }
  }
}());
