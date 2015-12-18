(function() {
  'use strict';

  angular.module('homeTrax.authentication.authenticationService', [
    'homeTrax.authentication.authenticationToken',
    'homeTrax.authentication.identity',
    'homeTrax.common.core.config',
    'homeTrax.common.resources.User'
  ]).factory('authenticationService', authenticationService);

  function authenticationService($http, identity, $q, User, config, authenticationToken) {
    return {
      authenticateUser: function(username, password) {
        var dfd = $q.defer();
        $http.post(config.dataService + '/login', {
          username: username,
          password: password
        }).then(function(response) {
          if (response.data.success) {
            var u = new User();
            angular.extend(u, response.data.user);
            identity.set(u);
            authenticationToken.set(response.data.token);
            dfd.resolve(true);
          } else {
            authenticationToken.clear();
            dfd.resolve(false);
          }
        });

        return dfd.promise;
      },

      logoutUser: function() {
        var dfd = $q.defer();
        $http.post(config.dataService + '/logout', {
          logout: true
        }).then(function() {
          identity.clear();
          dfd.resolve();
        });

        authenticationToken.clear();
        return dfd.promise;
      }
    };
  }
}());
