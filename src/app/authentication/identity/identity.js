(function() {
  'use strict';

  angular.module('homeTrax.authentication.identity', [
    'homeTrax.authentication.authenticationToken',
    'homeTrax.common.core.config',
    'homeTrax.common.services.cacheBuster'
  ]).factory('identity', identity);

  function identity($http, $q, config, authenticationToken, cacheBuster) {
    var service = {
      currentUser: undefined,

      get: getCurrentUser,
      set: setCurrentUser,
      clear: clearCurrentUser,

      isAuthenticated: isAuthenticated,
      isAuthorized: isAuthorized
    };

    return service;

    function getCurrentUser() {
      if (service.currentUser) {
        return $q.when(service.currentUser);
      } else {
        return $http.get(config.dataService + '/currentUser', {params: {_: cacheBuster.value}})
          .then(function(response) {
            service.currentUser = response.data;
            return response.data;
          });
      }
    }

    function setCurrentUser(user) {
      service.currentUser = user;
    }

    function clearCurrentUser() {
      service.currentUser = undefined;
    }

    function isAuthenticated() {
      return !!authenticationToken.get();
    }

    function isAuthorized(role) {
      return isAuthenticated() &&
        (!role || (!!service.currentUser && !!service.currentUser.roles && service.currentUser.roles.indexOf(role) > -1));
    }
  }
}());
