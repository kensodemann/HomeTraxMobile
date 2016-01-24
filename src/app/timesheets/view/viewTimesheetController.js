(function() {
  'use strict';

  angular.module('homeTrax.timesheets.view.viewTimesheetController', [
    'ui.router',
    'homeTrax.common.core.config',
    'homeTrax.common.directives.htDateTabs',
    'homeTrax.common.directives.htTaskTimer',
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
            timesheetView: {
              templateUrl: 'app/timesheets/view/viewTimesheet.html',
              controller: 'viewTimesheetController',
              controllerAs: 'controller'
            }
          }
        });
    });

  function ViewTimesheetController($log, $scope, $window, $stateParams, $ionicModal, $q, timesheets, timesheetTaskTimers,
                                   TaskTimer) {
    var controller = this;

    controller.currentTaskTimer = new TaskTimer();

    controller.createTaskTimer = createTaskTimer;

    controller.timerClicked = function() {
      $log.log('A timer was clicked');
    };

    controller.timerToggled = function() {
      $log.log('A timer was toggled');
    };

    activate();

    function createTaskTimer() {
      angular.copy({
        workDate: controller.currentDate,
        timesheetRid: controller.timesheet._id
      }, controller.currentTaskTimer);
      controller.taskTimerEditor.show();
    }

    function activate() {
      getTimesheet().then(refreshCurrentData);
      createTaskTimerEditor();
      $scope.$watch('controller.currentDate', refreshOnDateChange);
    }

    function createTaskTimerEditor() {
      var template = '<ion-modal-view><ht-task-timer-editor ht-close="controller.taskTimerEditor.hide()" ng-model="controller.currentTaskTimer"></ht-task-timer-editor></ion-modal-view>';
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
      var today = new $window.moment();
      var endDate = new $window.moment(controller.timesheet.endDate);
      var beginDate = (new $window.moment(controller.timesheet.endDate)).subtract(6, 'days');
      var currDate = (beginDate <= today && today <= endDate ? today : beginDate);
      return currDate.toISOString().substring(0, 10);
    }

    function refreshOnDateChange(currentDate, previousDate) {
      if (currentDate !== previousDate) {
        refreshCurrentData();
      }
    }

    function refreshCurrentData() {
      controller.taskTimers = timesheetTaskTimers.get(controller.currentDate);
      controller.totalTime = timesheetTaskTimers.totalTime(controller.currentDate);
    }
  }
}());
