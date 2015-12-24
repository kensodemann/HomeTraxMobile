(function() {
  'use strict';

  angular.module('homeTrax.projects.list.listProjectsController', [
    'ui.router',
    'homeTrax.common.core.EditorMode',
    'homeTrax.common.resources.Project',
    'homeTrax.common.services.waitSpinner',
    'homeTrax.projects.edit.ProjectEditor'
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

  function ListProjectsController($scope, Project, waitSpinner, ProjectEditor, EditorMode) {
    var controller = this;

    controller.projects = Project.query();
    controller.editor = new ProjectEditor($scope);

    controller.edit = editProject;

    activate();

    function editProject(project) {
      controller.editor.show(EditorMode.edit, project, controller.projects);
    }

    function activate() {
      waitSpinner.show();
      controller.projects.$promise.finally(waitSpinner.hide);
    }
  }
}());
