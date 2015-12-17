/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.reports.timeReport.timeReportController', function() {
    var $controllerConstructor;

    beforeEach(module('homeTrax.reports.timeReport.timeReportController'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    function createController() {
      return $controllerConstructor('timeReportController', {});
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });
  });
}());
