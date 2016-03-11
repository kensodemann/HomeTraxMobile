(function() {
  'use strict';

  angular.module('homeTrax.timesheets.view.viewTimesheetController', [
    'ui.router',
    'homeTrax.common.core.config',
    'homeTrax.common.directives.htDateTabs',
    'homeTrax.common.directives.htTaskTimer',
    'homeTrax.common.filters.hoursMinutes',
    'homeTrax.common.resources.TaskTimer',
    'homeTrax.common.services.timesheets',
    'homeTrax.common.services.timesheetTaskTimers',
    'homeTrax.timesheets.edit.htTaskTimerEditor'
  ]).controller('viewTimesheetController', ViewTimesheetController)
    .config(function($stateProvider) {
      $stateProvider.state('app.timesheets.viewCurrent', {
          url: '/view',
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
          views: {
            'timesheets': {
              templateUrl: 'app/timesheets/view/viewTimesheet.html',
              controller: 'viewTimesheetController',
              controllerAs: 'controller'
            }
          }
        });
    });

  function ViewTimesheetController($scope, $interval, $window, $stateParams, $ionicModal, $q, timesheets,
                                   timesheetTaskTimers, TaskTimer) {
    var controller = this;

    controller.currentTaskTimer = undefined;

    controller.createTaskTimer = createTaskTimer;
    controller.timerClicked = timerClicked;
    controller.timerToggled = timerToggled;

    activate();

    function createTaskTimer() {
      controller.currentTaskTimer = new TaskTimer();
      angular.copy({
        workDate: controller.currentDate,
        timesheetRid: controller.timesheet._id
      }, controller.currentTaskTimer);
      controller.taskTimerEditor.show();
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
      $scope.$on('modal.hidden', refreshOnDialogHidden);
      $interval(refreshCurrentData, 15000);
    }

    function createTaskTimerEditor() {
      var template = '<ion-modal-view><ht-task-timer-editor ht-dialog="controller.taskTimerEditor" ng-model="controller.currentTaskTimer"></ht-task-timer-editor></ion-modal-view>';
      controller.taskTimerEditor = $ionicModal.fromTemplate(template, {
        scope: $scope.$new(),
        backdropClickToClose: false,
        hardwareBackButtonClose: false
      });
      $scope.$on('$destroy', function() {
        controller.taskTimerEditor.remove();
      });
    }

    function getTimesheet() {
      var dfd = $q.defer();

      var p = (!!$stateParams.id ? timesheets.get($stateParams.id) : timesheets.getCurrent());
      p.then(getTaskTimers, dfd.reject);

      return dfd.promise;

      function getTaskTimers(ts) {
        controller.timesheet = ts;
        controller.currentDate = defaultDate();
        timesheetTaskTimers.load(ts).then(dfd.resolve, dfd.reject);
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

    function refreshOnDialogHidden(evt, dialog) {
      if (dialog === controller.taskTimerEditor) {
        refreshCurrentData();
      }
    }

    function refreshCurrentData() {
      controller.taskTimers = timesheetTaskTimers.get(controller.currentDate);
      controller.totalTime = timesheetTaskTimers.totalTime(controller.currentDate);
    }
  }
}());
