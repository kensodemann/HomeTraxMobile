(function() {
  'use strict';

  angular.module('homeTrax.timesheets.list.listTimesheetsController', [
    'ui.router'
  ]).controller('listTimesheetsController', ListTimesheetsController)
    .config(function($stateProvider) {
      $stateProvider.state('app.timesheets.list', {
        url: '/list',
        views: {
          'timesheets': {
            templateUrl: 'app/timesheets/list/list.html',
            controller: 'listTimesheetsController as controller'
          }
        }
      });
    });

  function ListTimesheetsController($log) {
    $log.log('list timesheet controller instantiated');
  }
}());
