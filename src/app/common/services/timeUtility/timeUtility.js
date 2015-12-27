(function() {
  'use strict';

  angular.module('homeTrax.common.services.timeUtility', []).factory('timeUtility', timeUtility);

  function timeUtility() {
    var hoursMinutesRegEx = /^(\d+)?(:[0-5]\d)$/;
    var hoursRegEx = /^(\d+)?(\.\d+)?$/;
    return {
      parse: parse
    };

    function parse(t) {
      var n = t;
      if (typeof t === 'string') {
        if (isNumberOfHours(t)) {
          n = Number(t);
        } else if (isHoursMinutes(t)) {
          n = parseHoursMinutes(t);
        } else {
          throw new Error('Invalid format');
        }
      }

      return Math.round(n * 60 * 60 * 1000);
    }

    function isNumberOfHours(t) {
      return hoursRegEx.test(t);
    }

    function isHoursMinutes(t) {
      return hoursMinutesRegEx.test(t);
    }

    function parseHoursMinutes(t) {
      var hrsMin = t.split(':');
      return Number(hrsMin[0]) + (Number(hrsMin[1] / 60));
    }
  }
}());
