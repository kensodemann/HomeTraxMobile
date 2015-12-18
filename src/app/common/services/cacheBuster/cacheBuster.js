(function() {
  'use strict';

  angular.module('homeTrax.common.services.cacheBuster', []).factory('cacheBuster', CacheBuster);

  function CacheBuster() {
    return {
      get value() {
        return new Date().getTime();
      }
    };
  }
}());
