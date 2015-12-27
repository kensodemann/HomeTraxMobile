/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.projects.list.listProjectsController', function() {
    var mockProjectEditor;
    var mockProjectEditorConstructor;
    var mockWaitSpinner;

    var config;
    var $scope;
    var testData;

    var $controllerConstructor;
    var $httpBackend;

    beforeEach(module('homeTrax.projects.list.listProjectsController'));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _config_) {
      $controllerConstructor = $controller;
      $httpBackend = _$httpBackend_;
      config = _config_;
      $scope = $rootScope.$new();
    }));

    beforeEach(function() {
      mockProjectEditor = sinon.stub({
        create: function() {
        },

        edit: function() {
        }
      });
      mockProjectEditorConstructor = sinon.stub();
      mockProjectEditorConstructor.returns(mockProjectEditor);
    });

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
        $scope: $scope,
        ProjectEditor: mockProjectEditorConstructor,
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
        $httpBackend.expectGET(config.dataService + '/projects').respond(200, testData);
        var controller = createController();
        $httpBackend.flush();
        expect(controller.projects.length).to.equal(3);
        expect(controller.projects[0]._id).to.equal(314);
        expect(controller.projects[1]._id).to.equal(73);
        expect(controller.projects[2]._id).to.equal(42);
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

      it('builds a project editors object', function() {
        $httpBackend.expectGET(config.dataService + '/projects').respond();
        var controller = createController();
        $httpBackend.flush();
        expect(mockProjectEditorConstructor.calledOnce).to.be.true;
        expect(controller.editor).to.equal(mockProjectEditor);
      });
    });

    describe('editing a project', function() {
      it('passes the project to the editor', function() {
        $httpBackend.expectGET(config.dataService + '/projects').respond(200, testData);
        var controller = createController();
        $httpBackend.flush();
        controller.edit(controller.projects[1]);
        expect(mockProjectEditor.edit.calledOnce).to.be.true;
        expect(mockProjectEditor.edit.calledWith(controller.projects[1], controller.projects)).to.be.true;
      });
    });

    describe('creating a project', function() {
      it('opens the editor for create', function() {
        $httpBackend.expectGET(config.dataService + '/projects').respond(200, testData);
        var controller = createController();
        $httpBackend.flush();
        controller.create();
        expect(mockProjectEditor.create.calledOnce).to.be.true;
        expect(mockProjectEditor.create.calledWith(controller.projects)).to.be.true;
      });
    });

    function initializeTestData() {
      testData = [{
        _id: 314,
        name: 'Cherry Pi'
      }, {
        _id: 73,
        name: 'Big Bang Theory'
      }, {
        _id: 42,
        name: 'The Answer'
      }];
    }
  });
}());
