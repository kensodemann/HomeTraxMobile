/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.main.mainController', function() {
    var config;
    var $httpBackend;
    var mockIdentity;
    var mockState;
    var $controllerConstructor;

    beforeEach(module('homeTrax.main.mainController'));

    beforeEach(function() {
      mockIdentity = sinon.stub({
        clear: function() {
        }
      });

      module(function($provide) {
        $provide.value('identity', mockIdentity);
      });
    });

    beforeEach(inject(function($controller, _$httpBackend_, _config_) {
      config = _config_;
      $httpBackend = _$httpBackend_;
      $controllerConstructor = $controller;
    }));

    beforeEach(function() {
      mockState = sinon.stub({
        go: function() {
        }
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    function createController() {
      return $controllerConstructor('mainController', {
        $state: mockState
      });
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });

    describe('logout', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
        $httpBackend.expectPOST(config.dataService + '/logout').respond();
      });

      it('logs the user out', function() {
        controller.logout();
        $httpBackend.flush();
      });

      it('redirects to the login page', function() {
        controller.logout();
        $httpBackend.flush();
        expect(mockState.go.calledOnce).to.be.true;
        expect(mockState.go.calledWith('login')).to.be.true;
      });
    });
  });
}());
