(function() {
  'use strict';

  angular.module('homeTrax.timesheets', [
    'homeTrax.timesheets.list.listTimesheetsController',
    'homeTrax.timesheets.view.viewTimesheetController',
    'ui.router'
  ]).config(function($stateProvider) {
    $stateProvider.state('app.timesheets', {
      url: '/timesheets',
      abstract: true,
      views: {
        'menuContent': {
          template: '<ion-nav-view name="timesheets"></ion-nav-view>'
        }
      }
    });
  });
}());
