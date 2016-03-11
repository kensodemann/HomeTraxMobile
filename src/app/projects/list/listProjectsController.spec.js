/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.projects.list.listProjectsController', function() {
    var mockIonicModal;
    var mockModalController;
    var mockProjectEditor;
    var mockProjectEditorConstructor;
    var mockWaitSpinner;

    var config;
    var $scope;
    var Status;
    var testData;

    var $controllerConstructor;
    var $httpBackend;

    beforeEach(module('homeTrax.projects.list.listProjectsController'));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _config_, _Status_) {
      $controllerConstructor = $controller;
      $httpBackend = _$httpBackend_;
      config = _config_;
      $scope = $rootScope.$new();
      Status = _Status_;
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

    beforeEach(function() {
      mockModalController = sinon.stub({
        show: function() {
        },

        remove: function() {
        }
      });
    });

    beforeEach(function() {
      mockIonicModal = sinon.stub({
        fromTemplate: function() {
        }
      });
      mockIonicModal.fromTemplate.returns(mockModalController);
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    function createController() {
      return $controllerConstructor('listProjectsController', {
        $scope: $scope,
        ProjectEditor: mockProjectEditorConstructor,
        waitSpinner: mockWaitSpinner,
        $ionicModal: mockIonicModal
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

      it('creates the projectEditor', function() {
        $httpBackend.expectGET(config.dataService + '/projects').respond(400);
        var controller = createController();
        $httpBackend.flush();
        expect(mockIonicModal.fromTemplate.calledOnce).to.be.true;
        expect(controller.projectEditor).to.equal(mockModalController);
      });
    });

    describe('editing a project', function() {
      var controller;
      beforeEach(function() {
        $httpBackend.expectGET(config.dataService + '/projects').respond(200, testData);
        controller = createController();
        $httpBackend.flush();
      });

      it('sets the current project', function() {
        controller.edit(controller.projects[1]);
        expect(controller.currentProject).to.equal(controller.projects[1]);
      });

      it('shows the editor', function() {
        controller.edit(controller.projects[1]);
        expect(mockModalController.show.calledOnce).to.be.true;
      });
    });

    describe('creating a project', function() {
      var controller;
      beforeEach(function() {
        $httpBackend.expectGET(config.dataService + '/projects').respond(200, testData);
        controller = createController();
        $httpBackend.flush();
      });

      it('sets the current project to a new active project', function() {
        controller.create();
        expect(angular.equals(controller.currentProject, {status: Status.active})).to.be.true;
      });

      it('shows the editor', function() {
        controller.create();
        expect(mockModalController.show.calledOnce).to.be.true;
      });
    });

    describe('on destroy', function() {
      it('removes the modal', function() {
        $httpBackend.expectGET(config.dataService + '/projects').respond(200, testData);
        createController();
        $httpBackend.flush();
        $scope.$broadcast('$destroy');
        $scope.$digest();
        expect(mockModalController.remove.calledOnce).to.be.true;
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
