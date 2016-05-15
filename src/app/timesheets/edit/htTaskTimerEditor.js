(function() {
  'use strict';

  angular.module('homeTrax.timesheets.edit.htTaskTimerEditor', [
    'ngMessages',
    'homeTrax.common.core.EditorMode',
    'homeTrax.common.core.Status',
    'homeTrax.common.directives.htItemFinderDialog',
    'homeTrax.common.filters.hoursMinutes',
    'homeTrax.common.filters.projectName',
    'homeTrax.common.resources.Project',
    'homeTrax.common.resources.TaskTimer',
    'homeTrax.common.services.stages',
    'homeTrax.common.services.timesheetTaskTimers',
    'homeTrax.common.services.timeUtility',
    'homeTrax.common.services.waitSpinner',
    'homeTrax.common.validations.validTimeFormat'
  ]).directive('htTaskTimerEditor', htTaskTimerEditor)
    .controller('htTaskTimerEditorController', HtTaskTimerEditorController);

  function htTaskTimerEditor() {
    return {
      restrict: 'E',
      templateUrl: 'app/timesheets/edit/htTaskTimerEditor.html',
      scope: {},
      bindToController: {
        htTaskTimer: '=',
        htTaskTimers: '=',
        htDialog: '='
      },
      controller: 'htTaskTimerEditorController',
      controllerAs: 'controller'
    };
  }

  function HtTaskTimerEditorController($scope, $ionicModal, Project, TaskTimer, stages, timesheetTaskTimers,
    waitSpinner, EditorMode, Status, hoursMinutesFilter, timeUtility) {
    var controller = this;

    controller.editModel = new TaskTimer();

    controller.projects = [];
    controller.stages = stages.all;
    controller.save = saveModel;

    activate();

    function saveModel() {
      controller.editModel.milliseconds = timeUtility.parse(controller.timeSpent);
      waitSpinner.show();
      controller.editModel.$save()
        .finally(waitSpinner.hide)
        .then(copyAndClose, showErrorMessage);

      function copyAndClose(res) {
        angular.copy(res, controller.htTaskTimer);
        if (controller.mode === EditorMode.create) {
          timesheetTaskTimers.add(controller.htTaskTimer);
        }

        controller.htDialog.hide();
      }

      function showErrorMessage(res) {
        if (res.data) {
          controller.errorMessage = res.data.reason;
        }
      }
    }

    function activate() {
      initializeFinderDialogs();
      $scope.$watch('controller.htTaskTimer', resetData);
    }

    function initializeFinderDialogs() {
      initializeProjectFinder();
      initializeStageFinder();
    }

    function initializeProjectFinder() {
      var template = '<ht-item-finder-dialog ht-dialog="controller.projectFinderDialog" ht-selected-item="controller.editModel.project" ht-items="controller.projects" ht-title="Find Project" ht-template-url="app/common/templates/projectListItem.html"></ht-item-finder-dialog>';
      controller.projectFinderDialog = $ionicModal.fromTemplate(wrapModal(template), {
        scope: $scope,
        backdropClickToClose: false,
        hardwareBackButtonClose: false
      });
      $scope.$on('$destroy', function() {
        controller.projectFinderDialog.remove();
      });
    }

    function initializeStageFinder() {
      var template = '<ht-item-finder-dialog ht-dialog="controller.stageFinderDialog" ht-selected-item="controller.editModel.stage" ht-items="controller.stages" ht-title="Find Stage" ht-template-url="app/common/templates/stageListItem.html"></ht-item-finder-dialog>';
      controller.stageFinderDialog = $ionicModal.fromTemplate(wrapModal(template), {
        scope: $scope,
        backdropClickToClose: false,
        hardwareBackButtonClose: false
      });
      $scope.$on('$destroy', function() {
        controller.stageFinderDialog.remove();
      });
    }

    function wrapModal(template) {
      return '<ion-modal-view>' + template + '</ion-modal-view>';
    }

    function resetData(current, previous) {
      if (current && current !== previous) {
        fetchProjects();
        initializeEditor();
      }
    }

    function fetchProjects() {
      controller.projects = Project.query({ status: Status.active });
    }

    function initializeEditor() {
      if (controller.htTaskTimer) {
        setEditModel();
        setTitle();
      }
    }

    function setEditModel() {
      controller.mode = (controller.htTaskTimer._id ? EditorMode.edit : EditorMode.create);
      controller.timeSpent = (controller.htTaskTimer.milliseconds ? hoursMinutesFilter(controller.htTaskTimer.milliseconds) : undefined);
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
} ());
