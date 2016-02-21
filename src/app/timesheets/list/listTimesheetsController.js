(function() {
  'use strict';

  angular.module('homeTrax.timesheets.list.listTimesheetsController', [
    'ui.router',
    'homeTrax.common.services.messageDialog',
    'homeTrax.common.services.timesheets'
  ]).controller('listTimesheetsController', ListTimesheetsController)
    .config(function($stateProvider) {
      $stateProvider.state('app.timesheets.list', {
        url: '/list',
        views: {
          'timesheets': {
            templateUrl: 'app/timesheets/list/listTimesheets.html',
            controller: 'listTimesheetsController as controller'
          }
        }
      });
    });

  function ListTimesheetsController(timesheets, messageDialog) {
    var controller = this;

    controller.timesheets = timesheets.all;

    activate();

    function activate() {
      controller.timesheets.$promise.catch(displayError);

      function displayError(res) {
        messageDialog.error('Error Getting Timesheets', res.data.reason);
      }
    }
  }
}());
