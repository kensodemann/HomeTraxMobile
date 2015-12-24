/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.projects.edit.ProjectEditor', function() {
    var mockIonicModal;
    var mockIonicModalController;

    var EditorMode;
    var Project;
    var ProjectEditor;
    var Status;

    var config;
    var modalDfd;
    var $httpBackend;
    var $scope;

    beforeEach(module('homeTrax.projects.edit.ProjectEditor'));

    beforeEach(function() {
      mockIonicModal = sinon.stub({
        fromTemplateUrl: function() {
        }
      });
    });

    beforeEach(function() {
      mockIonicModalController = sinon.stub({
        show: function() {
        },

        hide: function() {
        },

        remove: function() {
        }
      });
    });

    beforeEach(function() {
      module(function($provide) {
        $provide.value('$ionicModal', mockIonicModal);
      });
    });

    beforeEach(inject(function($rootScope, $q, _$httpBackend_, _config_, _EditorMode_, _Project_, _Status_, _ProjectEditor_) {
      EditorMode = _EditorMode_;
      ProjectEditor = _ProjectEditor_;
      $scope = $rootScope.$new();
      modalDfd = $q.defer();
      mockIonicModal.fromTemplateUrl.returns(modalDfd.promise);
      Project = _Project_;
      Status = _Status_;
      $httpBackend = _$httpBackend_;
      config = _config_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('exists', function() {
      expect(ProjectEditor).to.exist;
    });

    describe('instantiation', function() {
      it('loads the template', function() {
        new ProjectEditor($scope);
        expect(mockIonicModal.fromTemplateUrl.calledOnce).to.be.true;
        expect(mockIonicModal.fromTemplateUrl.calledWith('app/projects/edit/editor.html')).to.be.true;
      });

      it('sets up the modal to remove itself on destroy', function() {
        new ProjectEditor($scope);
        modalDfd.resolve(mockIonicModalController);
        $scope.$digest();
        $scope.$broadcast('$destroy');
        $scope.$digest();
        expect(mockIonicModalController.remove.calledOnce).to.be.true;
      });

      it('puts the editor on the scope as the "controller"', function() {
        var p = new ProjectEditor($scope);
        var s = getModalScope();
        expect(s.controller).to.exist;
        expect(s.controller).to.equal(p);
      });

      it('starts with an empty project model', function() {
        var p = new ProjectEditor($scope);
        expect(p.project).to.deep.equal({});
      });
    });

    describe('show', function() {
      var projectEditor;
      beforeEach(function() {
        projectEditor = new ProjectEditor($scope);
      });

      it('sets the project model in the controller', function() {
        projectEditor.show(EditorMode.edit, {_id: 42, name: 'Douglas Adams'}, []);
        expect(projectEditor.project).to.deep.equal({_id: 42, name: 'Douglas Adams'});
      });

      it('sets the projects list', function() {
        projectEditor.show(EditorMode.edit, {_id: 42, name: 'Douglas Adams'}, [1, 2, 8, 4]);
        expect(projectEditor.allProjects).to.deep.equal([1, 2, 8, 4]);
      });

      it('initializes the edit model', function() {
        projectEditor.show(EditorMode.edit, {
          _id: 42,
          name: 'Douglas Adams',
          jiraTaskId: 'LUE-001',
          sbvbTaskId: 'COMP0000142',
          status: Status.active
        }, []);
        expect(projectEditor.editModel.name).to.equal('Douglas Adams');
        expect(projectEditor.editModel.jiraTaskId).to.equal('LUE-001');
        expect(projectEditor.editModel.sbvbTaskId).to.equal('COMP0000142');
        expect(projectEditor.editModel.status).to.equal(Status.active);
      });

      it('initializes isActive based on the status', function() {
        projectEditor.show(EditorMode.edit, {_id: 42, status: Status.active});
        expect(projectEditor.isActive).to.be.true;
        projectEditor.show(EditorMode.edit, {_id: 42, status: Status.inactive});
        expect(projectEditor.isActive).to.be.false;
      });

      describe('title', function() {
        it('is set properly if the mode is create', function() {
          projectEditor.show(EditorMode.create, {}, []);
          expect(projectEditor.title).to.equal('New Project');
        });

        it('is set properly if the mode is edit', function() {
          projectEditor.show(EditorMode.edit, {}, []);
          expect(projectEditor.title).to.equal('Edit Project');
        });
      });

      it('shows the modal once it is resolved', function() {
        projectEditor.show(EditorMode.edit, {_id: 42, name: 'Douglas Adams'}, []);
        expect(mockIonicModalController.show.called).to.be.false;
        modalDfd.resolve(mockIonicModalController);
        $scope.$digest();
        expect(mockIonicModalController.show.calledOnce).to.be.true;
      });
    });

    describe('save', function() {
      var project = {};
      beforeEach(function() {
        project = new Project({
          _id: 42,
          name: 'Douglas Adams',
          jiraTaskId: 'LUE-001',
          sbvbTaskId: 'COMP0000142',
          status: 'active'
        });
      });

      var projects = [{_id: 1, name: 'Something'}, project];

      var projectEditor;
      beforeEach(function() {
        projectEditor = new ProjectEditor($scope);
        projectEditor.show(EditorMode.edit, project, projects);
        modalDfd.resolve(mockIonicModalController);
        $scope.$digest();
      });

      it('POSTs the changes', function() {
        projectEditor.editModel.name = 'Zaphod';
        projectEditor.editModel.jiraTaskId = 'LUE-003';
        $httpBackend.expectPOST(config.dataService + '/projects/42', {
          _id: 42,
          name: 'Zaphod',
          jiraTaskId: 'LUE-003',
          sbvbTaskId: 'COMP0000142',
          status: 'active'
        }).respond();
        projectEditor.save();
        $httpBackend.flush();
      });

      describe('on success', function() {
        beforeEach(function() {
          projectEditor.editModel.name = 'Zaphod';
          projectEditor.editModel.jiraTaskId = 'LUE-003';
          $httpBackend.expectPOST(config.dataService + '/projects/42').respond(200, {
            _id: 42,
            name: 'Zaphod',
            jiraTaskId: 'LUE-003',
            sbvbTaskId: 'COMP0000142',
            status: 'active'
          });
          projectEditor.save();
          $httpBackend.flush();
        });

        it('copies the data back to the original model', function() {
          expect(project._id).to.equal(42);
          expect(project.name).to.equal('Zaphod');
          expect(project.jiraTaskId).to.equal('LUE-003');
          expect(project.sbvbTaskId).to.equal('COMP0000142');
          expect(project.status).to.equal('active');
        });

        it('hides the dialog', function() {
          expect(mockIonicModalController.hide.calledOnce).to.be.true;
        });

        it('does not change the number of items in the project list', function() {
          expect(projects.length).to.equal(2);
        });
      });

      describe('on error', function() {
        beforeEach(function() {
          projectEditor.editModel.name = 'Zaphod';
          projectEditor.editModel.jiraTaskId = 'LUE-003';
          $httpBackend.expectPOST(config.dataService + '/projects/42').respond(400, {
            reason: 'Because you suck eggs'
          });
          projectEditor.save();
          $httpBackend.flush();
        });

        it('displays an error message', function() {
          expect(projectEditor.errorMessage).to.equal('Because you suck eggs');
        });

        it('leaves the model data as-is', function() {
          expect(project._id).to.equal(42);
          expect(project.name).to.equal('Douglas Adams');
          expect(project.jiraTaskId).to.equal('LUE-001');
          expect(project.sbvbTaskId).to.equal('COMP0000142');
          expect(project.status).to.equal('active');
        });
      });
    });

    describe('save new project', function() {
      it('adds the project to the list upon success', function() {
        var project = new Project();
        var projects = [{_id: 1, name: 'Something'}, {_id: 2, name: 'Another thing'}];
        var projectEditor = new ProjectEditor($scope);
        projectEditor.show(EditorMode.create, project, projects);
        modalDfd.resolve(mockIonicModalController);
        $scope.$digest();

        $httpBackend.expectPOST(config.dataService + '/projects').respond(201, {
          _id: 42,
          name: 'Zaphod',
          jiraTaskId: 'LUE-003',
          sbvbTaskId: 'COMP0000142',
          status: 'active'
        });
        projectEditor.save();
        $httpBackend.flush();

        expect(projects.length).to.equal(3);
      });
    });

    describe('cancel', function() {
      var projectEditor;
      beforeEach(function() {
        projectEditor = new ProjectEditor($scope);
        modalDfd.resolve(mockIonicModalController);
        $scope.$digest();
      });

      it('hides the editor', function() {
        projectEditor.cancel();
        $scope.$digest();
        expect(mockIonicModalController.hide.calledOnce).to.be.true;
      });
    });

    function getModalScope() {
      return mockIonicModal.fromTemplateUrl.firstCall.args[1].scope;
    }
  });
}());
