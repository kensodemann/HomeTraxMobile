(function() {
  'use strict';

  angular.module('homeTrax.timesheets.edit.htTaskTimerEditor', [
    'homeTrax.common.core.EditorMode',
    'homeTrax.common.core.Status',
    'homeTrax.common.directives.htItemFinderDialog',
    'homeTrax.common.filters.projectName',
    'homeTrax.common.resources.Project',
    'homeTrax.common.resources.TaskTimer',
    'homeTrax.common.services.stages',
    'homeTrax.common.services.timesheetTaskTimers',
    'homeTrax.common.services.waitSpinner'
  ]).directive('htTaskTimerEditor', htTaskTimerEditor)
    .controller('htTaskTimerEditorController', HtTaskTimerEditorController);

  function htTaskTimerEditor() {
    return {
      restrict: 'E',
      templateUrl: 'app/timesheets/edit/htTaskTimerEditor.html',
      scope: {},
      bindToController: {
        htTaskTimer: '=ngModel',
        htModel: '=',
        htTaskTimers: '=',
        htClose: '&'
      },
      controller: 'htTaskTimerEditorController',
      controllerAs: 'controller'
    };
  }

  function HtTaskTimerEditorController($scope, $ionicModal, Project, TaskTimer, stages, timesheetTaskTimers,
                                       waitSpinner, EditorMode, Status) {
    var controller = this;

    controller.editModel = new TaskTimer();

    controller.stages = stages.all;
    controller.save = saveModel;

    activate();

    function saveModel() {
      waitSpinner.show();
      controller.editModel.$save()
        .finally(waitSpinner.hide)
        .then(copyAndClose, showErrorMessage);

      function copyAndClose(res) {
        angular.copy(res, controller.htTaskTimer);
        if (controller.mode === EditorMode.create) {
          timesheetTaskTimers.add(res);
        }

        controller.htClose();
      }

      function showErrorMessage(res) {
        if (res.data) {
          controller.errorMessage = res.data.reason;
        }
      }
    }

    function activate() {
      initializeFinderDialogs();
      $scope.$on('modal.shown', fetchProjects);
      $scope.$watchCollection('controller.htTaskTimer', initializeEditor);
    }

    function initializeFinderDialogs() {
      initializeProjectFinder();
      initializeStageFinder();
    }

    function initializeProjectFinder() {
      var template = '<ht-item-finder-dialog ht-close="controller.projectFinderDialog.hide()" ng-model="controller.editModel.project" ht-items="controller.projects" ht-title="Find Project"></ht-item-finder-dialog>';
      controller.projectFinderDialog = $ionicModal.fromTemplate(wrapModal(template), {
        scope: $scope,
        backdropClickToClose: false,
        hardwareBackButtonClose: false
      });
      $scope.$on('$destroy', controller.projectFinderDialog.remove);
    }

    function initializeStageFinder() {
      var template = '<ht-item-finder-dialog ht-close="controller.stageFinderDialog.hide()" ng-model="controller.editModel.stage" ht-items="controller.stages" ht-title="Find Stage"></ht-item-finder-dialog>';
      controller.stageFinderDialog = $ionicModal.fromTemplate(wrapModal(template), {
        scope: $scope,
        backdropClickToClose: false,
        hardwareBackButtonClose: false
      });
      $scope.$on('$destroy', controller.stageFinderDialog.remove);
    }

    function wrapModal(template){
      return '<ion-modal-view>' + template + '</ion-modal-view>';
    }

    function fetchProjects() {
      controller.projects = Project.query({status: Status.active});
    }

    function initializeEditor() {
      if (controller.htTaskTimer) {
        setEditModel();
        setTitle();
      }
    }

    function setEditModel() {
      controller.mode = (controller.htTaskTimer._id ? EditorMode.edit : EditorMode.create);
      angular.copy(controller.htTaskTimer, controller.editModel);
      if (controller.editModel.stage) {
        controller.stages.$promise.then(function() {
          controller.editModel.stage = _.find(controller.stages, function(s) {
            return s._id === controller.editModel.stage._id;
          });
        });
      }
    }

    function setTitle() {
      controller.title = (controller.htTaskTimer._id ? 'Modify Timer' : 'New Timer');
    }
  }
}());
