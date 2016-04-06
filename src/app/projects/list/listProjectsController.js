(function() {
  'use strict';

  angular.module('homeTrax.projects.list.listProjectsController', [
    'ui.router',
    'homeTrax.common.core.Status',
    'homeTrax.common.directives.htSearch',
    'homeTrax.common.resources.Project',
    'homeTrax.common.services.waitSpinner',
    'homeTrax.projects.edit.htProjectEditor'
  ]).controller('listProjectsController', ListProjectsController)
    .config(function($stateProvider) {
      $stateProvider.state('app.projects.list', {
        url: '/list',
        htEnableNewItemMenuItem: true,
        views: {
          'projects': {
            templateUrl: 'app/projects/list/listProjects.html',
            controller: 'listProjectsController as controller'
          }
        }
      });
    });

  function ListProjectsController($state, $scope, $ionicModal, Project, waitSpinner, Status) {
    var controller = this;

    controller.projects = Project.query();

    controller.edit = editProject;
    controller.create = createProject;

    controller.currentProject = {};

    activate();

    function editProject(project) {
      controller.currentProject = project;
      controller.projectEditor.show();
    }

    function createProject() {
      controller.currentProject = new Project({
        status: Status.active
      });
      controller.projectEditor.show();
    }

    function activate() {
      waitSpinner.show();
      controller.projects.$promise.finally(waitSpinner.hide);

      var template =
        '<ion-modal-view><ht-project-editor ht-dialog="controller.projectEditor" ht-project="controller.currentProject" ht-projects="controller.projects"></ht-project-editor></ion-modal-view>';
      controller.projectEditor = $ionicModal.fromTemplate(template, {
        scope: $scope,
        backdropClickToClose: false,
        hardwareBackButtonClose: false
      });

      $scope.$on('$destroy', function() {
        controller.projectEditor.remove();
      });

      $scope.$on('home-trax-new-item', function() {
        if ($state.current.name === 'app.projects.list') {
          createProject();
        }
      });
    }
  }
}());
