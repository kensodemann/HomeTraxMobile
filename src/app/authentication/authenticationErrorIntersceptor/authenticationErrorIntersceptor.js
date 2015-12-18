(function() {
  'use strict';

  angular.module('homeTrax.authentication.authenticationErrorInterceptor', [
    'homeTrax.authentication.AuthenticationEvents'
  ]).factory('authenticationErrorInterceptor', function($rootScope, $q, AuthenticationEvents) {
    return {
      responseError: function(response) {
        $rootScope.$broadcast({
          401: AuthenticationEvents.notAuthenticated,
          403: AuthenticationEvents.notAuthorized
        }[response.status], response);
        return $q.reject(response);
      }
    };
  });
}());
