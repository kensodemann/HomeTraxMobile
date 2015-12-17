/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.main.mainController', function() {
    var $controllerConstructor;

    beforeEach(module('homeTrax.main.mainController'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    function createController() {
      return $controllerConstructor('mainController', {});
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });
  });
}());
