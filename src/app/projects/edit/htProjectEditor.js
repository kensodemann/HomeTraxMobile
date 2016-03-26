(function() {
  'use strict';

  angular.module('homeTrax.projects.edit.htProjectEditor', [
    'homeTrax.common.core.EditorMode',
    'homeTrax.common.core.Status',
    'homeTrax.common.resources.Project',
    'homeTrax.common.services.waitSpinner'
  ]).directive('htProjectEditor', htProjectEditor)
    .controller('htProjectEditorController', HtProjectEditorController);

  function htProjectEditor() {
    return {
      restrict: 'E',
      templateUrl: 'app/projects/edit/htProjectEditor.html',
      controller: 'htProjectEditorController',
      controllerAs: 'controller',
      scope: {},
      bindToController: {
        htProject: '=',
        htProjects: '=',
        htDialog: '='
      }
    };
  }

  function HtProjectEditorController($scope, EditorMode, Status, Project, waitSpinner) {
    var controller = this;

    controller.editModel = new Project();

    controller.save = save;

    activate();

    function save() {
      waitSpinner.show();
      controller.editModel.$save()
        .then(copyData, displayError)
        .finally(waitSpinner.hide);

      function copyData(prj) {
        angular.copy(prj, controller.htProject);
        if (controller.mode === EditorMode.create) {
          controller.htProjects.push(controller.htProject);
        }

        controller.htDialog.hide();
      }

      function displayError(resp) {
        if (resp && resp.data) {
          controller.errorMessage = resp.data.reason;
        }
      }
    }

    function activate() {
      initializeProjectInformation(controller.htProject);
      $scope.$watch('controller.htProject', initializeProjectInformation);
    }

    function initializeProjectInformation(project, previousProject) {
      if (project && project !== previousProject) {
        angular.copy(project, controller.editModel);
        controller.mode = (project._id ? EditorMode.edit : EditorMode.create);
        controller.title = (controller.mode === EditorMode.create ? 'New Project' : 'Modify Project');
        controller.projectIsActive = (project.status === Status.active);
      }
    }
  }
}());
