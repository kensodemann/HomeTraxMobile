(function() {
  'use strict';

  angular.module('homeTrax.common.resources.ServerVersion', [
    'ngResource',
    'homeTrax.common.core.config'
  ]).factory('ServerVersion', ServerVersion);

  function ServerVersion($resource, config) {
    var millisecondsPerMinute = 60000;

    return $resource(config.dataService + '/versions', {
      id: '@_id'
    }, {
      query: {
        method: 'GET',
        isArray: true,
        transformResponse: transformArrayResponse
      }
    });

    function transformArrayResponse(data) {
      var resp = angular.fromJson(data);
      resp.forEach(function(item) {
        if (item.releaseDate) {
          var d = new Date(item.releaseDate);
          item.releaseDate = adjustDateForTimezone(d);
        }
      });

      return resp;
    }

    function adjustDateForTimezone(d) {
      var minutesFromUTC = d.getTimezoneOffset();
      return new Date(d.getTime() + (minutesFromUTC * millisecondsPerMinute));
    }
  }
}());
