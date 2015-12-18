(function() {
  'use strict';

  angular.module('homeTrax.common.resources.User', [
    'ngResource',
    'homeTrax.common.core.config'
  ]).factory('User', User);

  function User($resource, config) {
    var UserResource = $resource(config.dataService + '/users/:id', {
      id: '@_id'
    });

    UserResource.prototype.isAdministrator = function() {
      return !!this.roles && this.roles.indexOf('admin') > -1;
    };

    UserResource.prototype.addRole = function(role) {
      if (_.indexOf(this.roles, role) === -1) {
        this.roles.push(role);
      }
    };

    UserResource.prototype.removeRole = function(role) {
      var idx = _.indexOf(this.roles, role);
      if (idx !== -1) {
        this.roles.splice(idx, 1);
      }
    };

    UserResource.prototype.color = '#3a87ad';

    return UserResource;
  }
}());
