(function() {
  'use strict';

  angular.module('homeTrax.authentication.authenticationToken', [
    'LocalStorageModule'
  ]).factory('authenticationToken', authenticationToken);

  function authenticationToken(localStorageService) {
    var key = 'authenticationToken';
    var cachedToken = null;

    return {
      get: function() {
        if (!cachedToken){
          cachedToken = localStorageService.get(key);
        }

        return cachedToken;
      },

      set: function(value) {
        localStorageService.set(key, value);
        cachedToken = value;
      },

      clear: function() {
        localStorageService.remove(key);
        cachedToken = null;
      }
    };
  }
}());
