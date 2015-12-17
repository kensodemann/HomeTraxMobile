(function() {
  'use strict';

  angular.module('homeTrax.reports.timeReport.timeReportController', [
    'ui.router'
  ]).controller('timeReportController', TimeReportController)
    .config(function($stateProvider) {
      $stateProvider.state('app.reports.timeReport', {
        url: '/timeReport',
        views: {
          'reports': {
            templateUrl: 'app/reports/timeReport/report.html',
            controller: 'timeReportController as controller'
          }
        }
      });
    });

  function TimeReportController() {
  }
}());
