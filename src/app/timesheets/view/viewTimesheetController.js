(function() {
  'use strict';

  angular.module('homeTrax.timesheets.view.viewTimesheetController', [
    'ui.router',
    'homeTrax.common.core.config',
    'homeTrax.common.directives.htDateTabs',
    'homeTrax.common.services.timesheets',
    'homeTrax.common.services.timesheetTaskTimers'
  ]).controller('viewTimesheetController', ViewTimesheetController)
    .config(function($stateProvider) {
      $stateProvider.state('app.timesheets.viewCurrent', {
          url: '/view',
          views: {
            'timesheets': {
              templateUrl: 'app/timesheets/view/view.html',
              controller: 'viewTimesheetController',
              controllerAs: 'controller'
            }
          }
        })
        .state('app.timesheets.view', {
          url: '/view/:id',
          views: {
            timesheetView: {
              templateUrl: 'app/timesheets/view/view.html',
              controller: 'viewTimesheetController',
              controllerAs: 'controller'
            }
          }
        });
    });

  function ViewTimesheetController($window, $stateParams, timesheets, timesheetTaskTimers) {
    var controller = this;

    var p = (!!$stateParams.id ? timesheets.get($stateParams.id) : timesheets.getCurrent());
    p.then(function(ts) {
      controller.timesheet = ts;
      controller.currentDate = defaultDate();
      timesheetTaskTimers.load(ts);
    });

    function defaultDate(){
      var today = new $window.moment();
      var endDate = new $window.moment(controller.timesheet.endDate);
      var beginDate = (new $window.moment(controller.timesheet.endDate)).subtract(6, 'days');
      var currDate = (beginDate <= today && today <= endDate ? today : beginDate);
      return currDate.toISOString().substring(0, 10);
    }
  }
}());
