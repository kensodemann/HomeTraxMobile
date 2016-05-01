(function() {
  'use strict';

  angular.module('homeTrax.authentication.authenticationToken', [
    'LocalStorageModule',
    'homeTrax.common.core.config'
  ]).factory('authenticationToken', authenticationToken);

  function authenticationToken(localStorageService) {
    var key = 'authenticationToken';
    var cachedToken = null;

    return {
      get: getToken,
      set: setToken,
      clear: clearToken
    };

    function getToken() {
      if (!cachedToken) {
        cachedToken = localStorageService.get(key);
      }

      return cachedToken;
    }

    function setToken(value) {
      localStorageService.set(key, value);
      cachedToken = value;
    }

    function clearToken() {
      localStorageService.remove(key);
      cachedToken = null;
    }
  }
}());
