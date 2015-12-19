/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.projects.list.listProjectsController', function() {
    var mockWaitSpinner;

    var config;

    var $controllerConstructor;
    var $httpBackend;

    beforeEach(module('homeTrax.projects.list.listProjectsController'));

    beforeEach(inject(function($controller, _$httpBackend_, _config_) {
      $controllerConstructor = $controller;
      $httpBackend = _$httpBackend_;
      config = _config_;
    }));

    beforeEach(function() {
      mockWaitSpinner = sinon.stub({
        show: function() {
        },

        hide: function() {
        }
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    function createController() {
      return $controllerConstructor('listProjectsController', {
        waitSpinner: mockWaitSpinner
      });
    }

    describe('activate', function() {
      it('queries the projects', function() {
        $httpBackend.expectGET(config.dataService + '/projects').respond();
        createController();
        $httpBackend.flush();
      });

      it('assigns the projects', function() {
        $httpBackend.expectGET(config.dataService + '/projects').respond([1, 2, 9, 8, 7]);
        var controller = createController();
        $httpBackend.flush();
        expect(controller.projects.length).to.equal(5);
        expect(controller.projects[0]).to.equal(1);
        expect(controller.projects[1]).to.equal(2);
        expect(controller.projects[2]).to.equal(9);
        expect(controller.projects[3]).to.equal(8);
        expect(controller.projects[4]).to.equal(7);
      });

      it('shows the wait spinner', function() {
        $httpBackend.expectGET(config.dataService + '/projects').respond();
        createController();
        expect(mockWaitSpinner.show.calledOnce).to.be.true;
        $httpBackend.flush();
      });

      it('hides the wait spinner after the data is retrieved', function() {
        $httpBackend.expectGET(config.dataService + '/projects').respond();
        createController();
        expect(mockWaitSpinner.hide.called).to.be.false;
        $httpBackend.flush();
        expect(mockWaitSpinner.hide.calledOnce).to.be.true;
      });

      it('hides the wait spinner after the query fails', function() {
        $httpBackend.expectGET(config.dataService + '/projects').respond(400);
        createController();
        expect(mockWaitSpinner.hide.called).to.be.false;
        $httpBackend.flush();
        expect(mockWaitSpinner.hide.calledOnce).to.be.true;
      });
    });
  });
}());
