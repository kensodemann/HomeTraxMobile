(function() {
  'use strict';

  angular.module('homeTrax.common.services.messageDialog', []).factory('messageDialog', messageDialog);

  function messageDialog($log) {
    return {
      error: function(title, msg) {
        $log.error(msg);
      }
    };
  }
}());
