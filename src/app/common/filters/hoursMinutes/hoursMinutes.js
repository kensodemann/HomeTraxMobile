(function() {
  angular.module('homeTrax.common.filters.hoursMinutes', [])
    .filter('hoursMinutes', function() {
      return function(ms) {
        if (angular.isUndefined(ms) || ms === null) {
          return '';
        }

        var minutes = Math.floor(ms / (1000 * 60));
        var hours = Math.floor(minutes / 60);
        minutes = minutes - (hours * 60);

        var hoursString = hours.toString();
        var minutesString = (minutes < 10 ? '0' : '') + minutes.toString();

        return hoursString + ':' + minutesString;
      };
    });
})();
