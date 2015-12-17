/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.timesheets.view.viewTimesheetController', function() {
    var $controllerConstructor;

    beforeEach(module('homeTrax.timesheets.view.viewTimesheetController'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    function createController() {
      return $controllerConstructor('viewTimesheetController', {});
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });
  });
}());
