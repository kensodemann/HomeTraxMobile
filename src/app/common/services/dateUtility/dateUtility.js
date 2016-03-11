(function() {
  'use strict';

  angular.module('homeTrax.common.services.dateUtility', [])
    .factory('dateUtility', dateUtility);

  function dateUtility() {
    var millisecondsPerMinute = 60000;

    return {
      removeTimezoneOffset: removeTimezoneOffset,
      addTimezoneOffset: addTimezoneOffset,
      generateWeek: generateWeek,
      weekEndDate: weekEndDate
    };

    function removeTimezoneOffset(d) {
      var minutesFromUTC = d.getTimezoneOffset();
      return new Date(d.getTime() - (minutesFromUTC * millisecondsPerMinute));
    }

    function addTimezoneOffset(d) {
      var minutesFromUTC = d.getTimezoneOffset();
      return new Date(d.getTime() + (minutesFromUTC * millisecondsPerMinute));
    }

    function generateWeek(d) {
      var days = [];
      var dt = normalizeDate(d);
      var offset = (moment(dt).isoWeekday() === 7 ? 7 : 0);

      for (var i = 0; i < 7; i++) {
        var weekDt = moment(dt).isoWeekday(i + offset);
        days.push({
          date: weekDt.toDate(),
          isoDateString: weekDt.toISOString().substring(0, 10)
        });
      }

      return days;
    }

    function weekEndDate(d) {
      var dt = normalizeDate(d);

      var offset = (moment(dt).isoWeekday() === 7 ? 7 : 0);
      return moment(dt).isoWeekday(6 + offset);
    }

    function normalizeDate(d){
      var dt = new Date(d);
      dt.setUTCHours(0, 0, 0, 0);
      return addTimezoneOffset(dt);
    }
  }
}());
