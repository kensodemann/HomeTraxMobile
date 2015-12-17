/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.timesheets.list.listTimesheetsController', function() {
    var $controllerConstructor;

    beforeEach(module('homeTrax.timesheets.list.listTimesheetsController'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    function createController() {
      return $controllerConstructor('listTimesheetsController', {});
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });
  });
}());
