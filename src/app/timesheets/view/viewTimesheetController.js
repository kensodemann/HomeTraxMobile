(function() {
  'use strict';

  angular.module('homeTrax.timesheets.view.viewTimesheetController', [
    'ui.router'
  ]).controller('viewTimesheetController', ViewTimesheetController)
    .config(function($stateProvider) {
      $stateProvider.state('app.timesheets.view', {
        url: '/view',
        views: {
          'timesheets': {
            templateUrl: 'app/timesheets/view/view.html',
            controller: 'viewTimesheetController as controller'
          }
        }
      });
    });

  function ViewTimesheetController($log) {
    $log.log('view timesheet controller instantiated');
  }
}());
