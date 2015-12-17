/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.projects.list.listProjectsController', function() {
    var $controllerConstructor;

    beforeEach(module('homeTrax.projects.list.listProjectsController'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    function createController() {
      return $controllerConstructor('listProjectsController', {});
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });
  });
}());
