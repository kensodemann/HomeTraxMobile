(function() {
  'use strict';

  angular.module('homeTrax.timesheets.view.viewTimesheetController', [
    'ui.router',
    'homeTrax.common.core.config',
    'homeTrax.common.directives.htDateTabs',
    'homeTrax.common.directives.htTaskTimer',
    'homeTrax.common.filters.hoursMinutes',
    'homeTrax.common.resources.TaskTimer',
    'homeTrax.common.services.messageDialog',
    'homeTrax.common.services.timesheets',
    'homeTrax.common.services.timesheetTaskTimers',
    'homeTrax.common.services.waitSpinner',
    'homeTrax.timesheets.edit.htTaskTimerEditor'
  ]).controller('viewTimesheetController', ViewTimesheetController)
    .config(function($stateProvider) {
      $stateProvider.state('app.timesheets.viewCurrent', {
        url: '/view',
        htEnableNewItemMenuItem: true,
        views: {
          'timesheets': {
            templateUrl: 'app/timesheets/view/viewTimesheet.html',
            controller: 'viewTimesheetController',
            controllerAs: 'controller'
          }
        }
      })
        .state('app.timesheets.view', {
          url: '/view/:id',
          htEnableNewItemMenuItem: true,
          views: {
            'timesheets': {
              templateUrl: 'app/timesheets/view/viewTimesheet.html',
              controller: 'viewTimesheetController',
              controllerAs: 'controller'
            }
          }
        });
    });

  function ViewTimesheetController($scope, $state, $interval, $window, $stateParams, $ionicModal, $q, messageDialog,
    timesheets, timesheetTaskTimers, TaskTimer, waitSpinner) {
    var controller = this;

    controller.currentTaskTimer = undefined;

    controller.createTaskTimer = createTaskTimer;
    controller.deleteTaskTimer = deleteTaskTimer;
    controller.timerClicked = timerClicked;
    controller.timerToggled = timerToggled;

    activate();

    function createTaskTimer() {
      controller.currentTaskTimer = new TaskTimer({
        workDate: controller.currentDate,
        timesheetRid: controller.timesheet._id
      });
      controller.taskTimerEditor.show();
    }

    function deleteTaskTimer(tt) {
      messageDialog.ask('Are You Sure?', 'Are you sure you want to delete this timer?').then(processAnswer);

      function processAnswer(doTheDelete) {
        if (doTheDelete) {
          waitSpinner.show();
          timesheetTaskTimers.delete(tt)
            .then(refreshCurrentData, displayError)
            .finally(waitSpinner.hide);
        }
      }
    }


    function timerClicked(timer) {
      controller.currentTaskTimer = timer;
      controller.taskTimerEditor.show();
    }

    function timerToggled(timer) {
      var p = (timer.isActive ? timesheetTaskTimers.stop(timer) : timesheetTaskTimers.start(timer));
      p.then(refreshCurrentData);
      return p;
    }

    function activate() {
      getTimesheet().then(refreshCurrentData);
      createTaskTimerEditor();
      $scope.$watch('controller.currentDate', refreshOnDateChange);
      $scope.$on('modal.hidden', handleEditorDialogHidden);
      $interval(refreshCurrentData, 15000);
      $scope.$on('home-trax-new-item', function() {
        if ($state.current.name === 'app.timesheets.viewCurrent' || $state.current.name === 'app.timesheets.view') {
          createTaskTimer();
        }
      });
    }

    function createTaskTimerEditor() {
      var template = '<ion-modal-view><ht-task-timer-editor ht-dialog="controller.taskTimerEditor" ht-task-timer="controller.currentTaskTimer"></ht-task-timer-editor></ion-modal-view>';
      controller.taskTimerEditor = $ionicModal.fromTemplate(template, {
        scope: $scope,
        backdropClickToClose: false,
        hardwareBackButtonClose: false
      });
      $scope.$on('$destroy', function() {
        controller.taskTimerEditor.remove();
      });
    }

    function getTimesheet() {
      return (!!$stateParams.id ? timesheets.get($stateParams.id) : timesheets.getCurrent()).then(getTaskTimers);

      function getTaskTimers(ts) {
        controller.timesheet = ts;
        controller.currentDate = defaultDate();
        return timesheetTaskTimers.load(ts);
      }
    }

    function defaultDate() {
      var today = new $window.moment().format('YYYY-MM-DD');
      var endDate = controller.timesheet.endDate;
      var beginDate = (new $window.moment(controller.timesheet.endDate)).subtract(6, 'days').format('YYYY-MM-DD');
      return (beginDate <= today && today <= endDate ? today : beginDate);
    }

    function refreshOnDateChange(currentDate, previousDate) {
      if (currentDate !== previousDate) {
        refreshCurrentData();
      }
    }

    function handleEditorDialogHidden(evt, dialog) {
      if (dialog === controller.taskTimerEditor) {
        controller.currentTaskTimer = undefined;
        refreshCurrentData();
      }
    }

    function refreshCurrentData() {
      timesheetTaskTimers.load(controller.timesheet).then(function() {
        controller.taskTimers = timesheetTaskTimers.get(controller.currentDate);
        controller.totalTime = timesheetTaskTimers.totalTime(controller.currentDate);
      });
    }

    function displayError(res) {
      messageDialog.error('Error', res.data.reason);
    }
  }
} ());