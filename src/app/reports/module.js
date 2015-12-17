(function() {
  'use strict';

  angular.module('homeTrax.reports', [
    'homeTrax.reports.timeReport.timeReportController',
    'ui.router'
  ]).config(function($stateProvider) {
    $stateProvider.state('app.reports', {
      url: '/reports',
      abstract: true,
      views: {
        'menuContent': {
          template: '<ion-nav-view name="reports"></ion-nav-view>'
        }
      }
    });
  });
}());
