(function() {
  'use strict';

  angular.module('homeTrax.authentication.AuthenticationEvents', [])
    .constant('AuthenticationEvents', {
      notAuthenticated: 'auth-not-authenticated',
      notAuthorized: 'auth-not-authorized'
    });
}());
