/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.projects.edit.htProjectEditor', function() {
    var mockWaitSpinner;

    var config;

    var $compile;
    var $httpBackend;
    var $scope;

    beforeEach(module('app/projects/edit/htProjectEditor.html'));
    beforeEach(module('homeTrax.projects.edit.htProjectEditor'));

    beforeEach(function() {
      mockWaitSpinner = sinon.stub({
        hide: function() {
        },

        show: function() {
        }
      });
    });

    beforeEach(function() {
      module(function($provide) {
        $provide.value('waitSpinner', mockWaitSpinner);
      });
    });

    beforeEach(inject(function($rootScope, _$compile_, _$httpBackend_, _config_) {
      $scope = $rootScope.$new();
      $compile = _$compile_;
      $httpBackend = _$httpBackend_;
      config = _config_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('compiles', function() {
      var el = compile('<ht-project-editor></ht-project-editor>');
      expect(el[0].innerHTML).to.contain('<form name="projectEditor"');
    });

    describe('changing the htProject model', function() {
      it('copies the project to the editor model', function() {
        $scope.project = {};
        var el = compile('<ht-project-editor ng-model="project"></ht-project-editor>');
        var controller = el.isolateScope().controller;
        $scope.project = {
          _id: 42,
          name: 'Aurher Dent',
          status: 'active'
        };
        $scope.$digest();
        expect(controller.editModel).to.not.equal($scope.project);
        //expect(controller.editModel).to.deep.equal($scope.project);
        expect(angular.equals(controller.editModel, $scope.project)).to.be.true;
      });

      it('sets the title to "Modify Project" if the model has an _id', function() {
        $scope.project = {
          _id: 42,
          name: 'Aurher Dent',
          status: 'active'
        };
        var el = compile('<ht-project-editor ng-model="project"></ht-project-editor>');
        var controller = el.isolateScope().controller;
        expect(controller.title).to.equal('Modify Project');
      });

      it('sets the title to "New Project" if the model does not have an _id', function() {
        $scope.project = {
          status: 'active'
        };
        var el = compile('<ht-project-editor ng-model="project"></ht-project-editor>');
        var controller = el.isolateScope().controller;
        expect(controller.title).to.equal('New Project');
      });

      it('sets isActive true if the status is active', function() {
        $scope.project = {
          status: 'active'
        };
        var el = compile('<ht-project-editor ng-model="project"></ht-project-editor>');
        var controller = el.isolateScope().controller;
        expect(controller.projectIsActive).to.be.true;
      });

      it('sets isActive false if the status is not active', function() {
        $scope.project = {
          status: 'inactive'
        };
        var el = compile('<ht-project-editor ng-model="project"></ht-project-editor>');
        var controller = el.isolateScope().controller;
        expect(controller.projectIsActive).to.be.false;
      });
    });

    describe('saving an existing project', function() {
      var controller;
      beforeEach(function() {
        $scope.project = {
          _id: 42,
          name: 'Douglas Adams',
          jiraTaskId: 'LUE-001',
          sbvbTaskId: 'COMP0000142',
          status: 'active'
        };
        $scope.projects = [
          $scope.project, {
            _id: 73,
            name: 'Sheldon Cooper',
            status: 'active'
          }
        ];
        $scope.myClose = sinon.stub();
        var el = compile('<ht-project-editor ht-close="myClose" ng-model="project" ht-projects="projects"></ht-project-editor>');
        controller = el.isolateScope().controller;
      });

      it('shows the wait spinner', function() {
        $httpBackend.expectPOST(config.dataService + '/projects/42').respond();
        controller.save();
        expect(mockWaitSpinner.show.calledOnce).to.be.true;
        expect(mockWaitSpinner.hide.called).to.be.false;
        $httpBackend.flush();
      });

      it('POSTs the data in the edit model', function() {
        controller.editModel.name = 'Zaphod';
        controller.editModel.jiraTaskId = 'LUE-003';
        $httpBackend.expectPOST(config.dataService + '/projects/42', {
          _id: 42,
          name: 'Zaphod',
          jiraTaskId: 'LUE-003',
          sbvbTaskId: 'COMP0000142',
          status: 'active'
        }).respond();
        controller.save();
        $httpBackend.flush();
      });

      describe('on success', function() {
        beforeEach(function() {
          $httpBackend.expectPOST(config.dataService + '/projects/42').respond(200, {
            _id: 42,
            name: 'Zaphod',
            jiraTaskId: 'LUE-003',
            sbvbTaskId: 'COMP0000142',
            status: 'active'
          });
          controller.save();
          $httpBackend.flush();
        });

        it('hides the wait spinner', function() {
          expect(mockWaitSpinner.hide.calledOnce).to.be.true;
        });

        it('copies the data back to the model', function() {
          expect($scope.project.name).to.equal('Zaphod');
          expect($scope.project.jiraTaskId).to.equal('LUE-003');
        });

        it('does not add the project to the list', function() {
          expect($scope.projects.length).to.equal(2);
        });
      });

      describe('on failure', function() {
        beforeEach(function() {
          $httpBackend.expectPOST(config.dataService + '/projects/42').respond(400, {
            reason: 'Because you suck eggs'
          });
          controller.save();
          $httpBackend.flush();
        });

        it('hides the wait spinner', function() {
          expect(mockWaitSpinner.hide.calledOnce).to.be.true;
        });

        it('sets an error message', function() {
          expect(controller.errorMessage).to.equal('Because you suck eggs');
        });
      });
    });

    describe('saving a newly created project', function() {
      var controller;
      beforeEach(function() {
        $scope.project = {
          status: 'active'
        };
        $scope.projects = [{
          _id: 42,
          name: 'Douglas Adams',
          jiraTaskId: 'LUE-001',
          sbvbTaskId: 'COMP0000142',
          status: 'active'
        }, {
          _id: 73,
          name: 'Sheldon Cooper',
          status: 'active'
        }];
        $scope.myClose = sinon.stub();
        var el = compile('<ht-project-editor ht-close="myClose" ng-model="project" ht-projects="projects"></ht-project-editor>');
        controller = el.isolateScope().controller;
      });

      it('shows the wait spinner', function() {
        $httpBackend.expectPOST(config.dataService + '/projects').respond();
        controller.save();
        expect(mockWaitSpinner.show.calledOnce).to.be.true;
        expect(mockWaitSpinner.hide.called).to.be.false;
        $httpBackend.flush();
      });

      it('POSTs the data in the edit model', function() {
        controller.editModel.name = 'Poopie Pie';
        controller.editModel.jiraTaskId = 'PP-001';
        $httpBackend.expectPOST(config.dataService + '/projects', {
          name: 'Poopie Pie',
          jiraTaskId: 'PP-001',
          status: 'active'
        }).respond();
        controller.save();
        $httpBackend.flush();
      });

      describe('on success', function() {
        beforeEach(function() {
          $httpBackend.expectPOST(config.dataService + '/projects').respond(200, {
            _id: 314159,
            name: 'Poopie Pie',
            jiraTaskId: 'PP-001',
            status: 'active'
          });
          controller.save();
          $httpBackend.flush();
        });

        it('hides the wait spinner', function() {
          expect(mockWaitSpinner.hide.calledOnce).to.be.true;
        });

        it('copies the data back to the model', function() {
          expect($scope.project.name).to.equal('Poopie Pie');
          expect($scope.project.jiraTaskId).to.equal('PP-001');
        });

        it('adds the project to the list', function() {
          expect($scope.projects.length).to.equal(3);
        });
      });

      describe('on failure', function() {
        beforeEach(function() {
          $httpBackend.expectPOST(config.dataService + '/projects').respond(400, {
            reason: 'Because you suck eggs'
          });
          controller.save();
          $httpBackend.flush();
        });

        it('hides the wait spinner', function() {
          expect(mockWaitSpinner.hide.calledOnce).to.be.true;
        });

        it('sets an error message', function() {
          expect(controller.errorMessage).to.equal('Because you suck eggs');
        });
      });
    });

    function compile(html) {
      var el = angular.element(html);
      $compile(el)($scope);
      $scope.$digest();

      return el;
    }
  });
}());
