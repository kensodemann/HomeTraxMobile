(function() {
  'use strict';

  angular.module('homeTrax.projects.list.listProjectsController', [
    'ui.router'
  ]).controller('listProjectsController', listProjectsController)
    .config(function($stateProvider) {
      $stateProvider.state('app.projects.list', {
        url: '/list',
        views: {
          'projects': {
            templateUrl: 'app/projects/list/list.html',
            controller: 'listProjectsController as controller'
          }
        }
      });
    });

  function listProjectsController() {
  }
}());
