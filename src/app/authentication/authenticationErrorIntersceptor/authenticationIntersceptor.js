(function() {
  'use strict';

  angular.module('homeTrax.authentication.authenticationInterceptor', [
    'homeTrax.authentication.AuthenticationEvents',
    'homeTrax.authentication.authenticationToken'
  ]).factory('authenticationInterceptor', authenticationInterceptor);

  function authenticationInterceptor($rootScope, $q, AuthenticationEvents, authenticationToken) {
    return {
      request: function(config) {
        addAuthHeader(config);
        return config;
      },

      responseError: function(response) {
        $rootScope.$broadcast({
          401: AuthenticationEvents.notAuthenticated,
          403: AuthenticationEvents.notAuthorized
        }[response.status], response);
        return $q.reject(response);
      }
    };

    function addAuthHeader(config) {
      var token = authenticationToken.get();
      if (!!token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
    }
  }
}());
