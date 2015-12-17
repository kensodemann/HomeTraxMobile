/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.about.aboutController', function() {
    var $controllerConstructor;

    beforeEach(module('homeTrax.about.aboutController'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    function createController() {
      return $controllerConstructor('aboutController', {});
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });
  });
}());
