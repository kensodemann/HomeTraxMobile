/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('starter.controllers: PlaylistsCtrl', function() {
    var $controllerConstructor;

    beforeEach(module('starter.controllers'));

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    function createController() {
      return $controllerConstructor('PlaylistsCtrl', {
        $scope: {}
      });
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });
  });
}());
