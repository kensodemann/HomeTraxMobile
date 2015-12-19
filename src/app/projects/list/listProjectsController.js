(function() {
  'use strict';

  angular.module('homeTrax.projects.list.listProjectsController', [
    'ui.router',
    'homeTrax.common.resources.Project',
    'homeTrax.common.services.waitSpinner'
  ]).controller('listProjectsController', ListProjectsController)
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

  function ListProjectsController(Project, waitSpinner) {
    var controller = this;

    controller.projects =  Project.query();

    activate();

    function activate() {
      waitSpinner.show();
      controller.projects.$promise.finally(waitSpinner.hide);
    }
  }
}());
