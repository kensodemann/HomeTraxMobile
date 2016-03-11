/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.about.aboutController', function() {
    var config;
    var $controllerConstructor;
    var $httpBackend;

    var testData;

    beforeEach(module('homeTrax.about.aboutController'));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(inject(function($controller, _$httpBackend_, _config_) {
      $controllerConstructor = $controller;
      $httpBackend = _$httpBackend_;
      config = _config_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    function createController() {
      return $controllerConstructor('aboutController', {});
    }

    describe('activation', function() {
      it('gets the version information', function() {
        $httpBackend.expectGET(config.dataService + '/versions').respond(200, testData);
        createController();
        $httpBackend.flush();
      });

      it('sets the current status to the first one in the list', function() {
        $httpBackend.expectGET(config.dataService + '/versions').respond(200, testData);
        var controller = createController();
        $httpBackend.flush();
        expect(controller.serverVersion.name).to.equal('Fred');
      });
    });

    function initializeTestData() {
      testData = [{
        id: '2.0.3',
        name: 'Fred'
      }, {
        id: '2.0.2',
        name: 'Wilma'
      }, {
        id: '2.0.1',
        name: 'Betty'
      }, {
        id: '2.0.0',
        name: 'Barney'
      }];
    }
  });
}());
