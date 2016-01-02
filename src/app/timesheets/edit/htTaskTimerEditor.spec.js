/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.timesheets.edit.htTaskTimerEditor', function() {
    var $compile;
    var config;
    var $httpBackend;
    var $scope;

    var mockTimesheetTaskTimers;
    var mockWaitSpinner;

    var testProjects;
    var testStages;

    beforeEach(module('app/timesheets/edit/htTaskTimerEditor.html'));
    beforeEach(module('homeTrax.timesheets.edit.htTaskTimerEditor'));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(function() {
      mockTimesheetTaskTimers = sinon.stub({
        add: function() {
        }
      });
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
      module(function($provide) {
        $provide.value('timesheetTaskTimers', mockTimesheetTaskTimers);
        $provide.value('waitSpinner', mockWaitSpinner);
      });
    });

    beforeEach(inject(function($rootScope, _$compile_, _$httpBackend_, _config_) {
      $scope = $rootScope;
      $compile = _$compile_;
      $httpBackend = _$httpBackend_;
      config = _config_;
    }));

    beforeEach(function() {
      $httpBackend.expectGET(config.dataService + '/stages').respond(200, testStages);
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('compiles', function() {
      var el = compile('<ht-task-timer-editor></ht-task-timer-editor>');
      expect(el[0].innerHTML).to.contain('<form name="taskTimerEditor"');
      $httpBackend.flush();
    });

    describe('instantiation', function() {
      it('sets the edit model', function() {
        $scope.taskTimer = {
          _id: '24',
          name: 'I am a fake task',
          stage: {
            _id: '82',
            stageNumber: 3,
            name: 'Stage 3'
          }
        };
        var el = compile('<ht-task-timer-editor ng-model="taskTimer"></ht-task-timer-editor>');
        var controller = el.isolateScope().controller;
        expect(controller.editModel).to.not.equal($scope.taskTimer);
        expect(angular.equals(controller.editModel, $scope.taskTimer)).to.be.true;
        $httpBackend.flush();
      });

      it('sets the title to "Modify Timer" if the model has an _id', function() {
        $scope.taskTimer = {
          _id: '24',
          name: 'I am a fake task'
        };
        var el = compile('<ht-task-timer-editor ng-model="taskTimer"></ht-task-timer-editor>');
        var controller = el.isolateScope().controller;
        expect(controller.title).to.equal('Modify Timer');
        $httpBackend.flush();
      });

      it('sets the title to "New Timer" if the model does not have an _id', function() {
        $scope.taskTimer = {};
        var el = compile('<ht-task-timer-editor ng-model="taskTimer"></ht-task-timer-editor>');
        var controller = el.isolateScope().controller;
        expect(controller.title).to.equal('New Timer');
        $httpBackend.flush();
      });
    });

    describe('when shown', function() {
      it('fetches the active projects and assigns them to the controller project list', function() {
        var el = compile('<ht-task-timer-editor></ht-task-timer-editor>');
        var controller = el.isolateScope().controller;
        $httpBackend.expectGET(config.dataService + '/projects?status=active').respond(200, testProjects);
        $scope.$broadcast('modal.shown');
        $scope.$digest();
        $httpBackend.flush();
        expect(angular.equals(controller.projects, testProjects)).to.be.true;
      });
    });


    describe('changing the htTaskTimer model', function() {
      var controller;
      beforeEach(function() {
        $scope.taskTimer = {};
        var el = compile('<ht-task-timer-editor ng-model="taskTimer"></ht-task-timer-editor>');
        controller = el.isolateScope().controller;
        $httpBackend.flush();
      });

      it('copies the timer to the editor model', function() {
        $scope.taskTimer = {
          _id: '24',
          name: 'I am a fake task'
        };
        $scope.$digest();
        expect(controller.editModel).to.not.equal($scope.taskTimer);
        expect(angular.equals(controller.editModel, $scope.taskTimer)).to.be.true;
      });

      it('sets the title to "Modify Timer" if the model has an _id', function() {
        $scope.taskTimer = {
          _id: '24',
          name: 'I am a fake task'
        };
        $scope.$digest();
        expect(controller.title).to.equal('Modify Timer');
      });

      it('sets the title to "New Timer" if the model does not have an _id', function() {
        $scope.taskTimer = {
          status: 'active'
        };
        $scope.$digest();
        expect(controller.title).to.equal('New Timer');
      });
    });

    describe('saving an existing task timer', function() {
      var controller;
      beforeEach(function() {
        $scope.taskTimer = {
          _id: 42378,
          name: 'I am existing timer',
          timesheetRid: 3,
          project: testProjects[1]
        };
        var el = compile('<ht-task-timer-editor ng-model="taskTimer"></ht-task-timer-editor>');
        controller = el.isolateScope().controller;
        $httpBackend.flush();
      });

      it('shows the wait spinner', function() {
        $httpBackend.expectPOST(config.dataService + '/timesheets/3/taskTimers/42378').respond();
        controller.save();
        expect(mockWaitSpinner.show.calledOnce).to.be.true;
        expect(mockWaitSpinner.hide.called).to.be.false;
        $httpBackend.flush();
      });

      it('saves the modified data', function() {
        controller.editModel.project = testProjects[3];
        controller.editModel.name = 'My name is Fred';
        $httpBackend.expectPOST(config.dataService + '/timesheets/3/taskTimers/42378', {
          _id: 42378,
          name: 'My name is Fred',
          timesheetRid: 3,
          project: testProjects[3]
        }).respond();
        controller.save();
        $httpBackend.flush();
      });

      describe('on success', function() {
        beforeEach(function() {
          controller.editModel.project = testProjects[3];
          controller.editModel.name = 'My name is Fred';
          $httpBackend.expectPOST(config.dataService + '/timesheets/3/taskTimers/42378').respond(200, {
            _id: 42378,
            name: 'My name is Fred',
            timesheetRid: 3,
            project: testProjects[3]
          });
          controller.save();
          $httpBackend.flush();
        });

        it('hides the wait spinner', function() {
          expect(mockWaitSpinner.hide.calledOnce).to.be.true;
        });

        it('copies the data back to the model', function() {
          expect(angular.equals($scope.taskTimer, {
            _id: 42378,
            name: 'My name is Fred',
            timesheetRid: 3,
            project: testProjects[3]
          })).to.be.true;
        });

        it('does not add the item to the list', function() {
          expect(mockTimesheetTaskTimers.add.calledOnce).to.be.false;
        });
      });

      describe('on failure', function() {
        beforeEach(function() {
          $httpBackend.expectPOST(config.dataService + '/timesheets/3/taskTimers/42378').respond(400, {
            reason: 'Because I just do not want to'
          });
          controller.save();
          $httpBackend.flush();
        });

        it('hides the wait spinner', function() {
          expect(mockWaitSpinner.hide.calledOnce).to.be.true;
        });

        it('displays an error message', function() {
          expect(controller.errorMessage).to.equal('Because I just do not want to');
        });
      });
    });

    describe('saving a new task timer', function() {
      var controller;
      beforeEach(function() {
        $scope.taskTimer = {
          timesheetRid: 78
        };
        var el = compile('<ht-task-timer-editor ng-model="taskTimer"></ht-task-timer-editor>');
        controller = el.isolateScope().controller;
        $httpBackend.flush();
      });

      it('shows the wait spinner', function() {
        $httpBackend.expectPOST(config.dataService + '/timesheets/78/taskTimers').respond();
        controller.save();
        expect(mockWaitSpinner.show.calledOnce).to.be.true;
        expect(mockWaitSpinner.hide.called).to.be.false;
        $httpBackend.flush();
      });

      it('saves the modified data', function() {
        controller.editModel.project = testProjects[3];
        controller.editModel.name = 'My name is Fred';
        controller.project = testProjects[3];
        $httpBackend.expectPOST(config.dataService + '/timesheets/78/taskTimers', {
          name: 'My name is Fred',
          timesheetRid: 78,
          project: testProjects[3]
        }).respond();
        controller.save();
        $httpBackend.flush();
      });

      describe('on success', function() {
        beforeEach(function() {
          controller.editModel.project = testProjects[3];
          controller.editModel.name = 'My name is Fred';
          controller.project = testProjects[3];
          $httpBackend.expectPOST(config.dataService + '/timesheets/78/taskTimers').respond(200, {
            _id: 188375,
            name: 'My name is Fred',
            timesheetRid: 78,
            project: testProjects[3]
          });
          controller.save();
          $httpBackend.flush();
        });

        it('hides the wait spinner', function() {
          expect(mockWaitSpinner.hide.calledOnce).to.be.true;
        });

        it('copies the data back to the model', function() {
          expect(angular.equals($scope.taskTimer, {
            _id: 188375,
            name: 'My name is Fred',
            timesheetRid: 78,
            project: testProjects[3]
          })).to.be.true;
        });

        it('addss the task timer to the list', function() {
          expect(mockTimesheetTaskTimers.add.calledOnce).to.be.true;
          expect(angular.equals(mockTimesheetTaskTimers.add.firstCall.args[0], {
            _id: 188375,
            name: 'My name is Fred',
            timesheetRid: 78,
            project: testProjects[3]
          })).to.be.true;
        });
      });

      describe('on failure', function() {
        beforeEach(function() {
          $httpBackend.expectPOST(config.dataService + '/timesheets/78/taskTimers').respond(400, {
            reason: 'Because I just do not want to'
          });
          controller.save();
          $httpBackend.flush();
        });

        it('hides the wait spinner', function() {
          expect(mockWaitSpinner.hide.calledOnce).to.be.true;
        });

        it('displays an error message', function() {
          expect(controller.errorMessage).to.equal('Because I just do not want to');
        });
      });
    });

    function initializeTestData() {
      testProjects = [{_id: '42', name: 'Admit It Ted', jiraTaskId: 'AA-101', status: 'active'},
        {_id: '73', name: 'Believe', jiraTaskId: 'AA-102', status: 'active'},
        {_id: '24', name: 'Project Editor', jiraTaskId: 'HT-123', sbvbTaskId: 'RFP14141', status: 'active'},
        {_id: '314159', name: 'Time Report', jiraTaskId: 'HT-211', sbvbTaskId: 'RFP14141', status: 'active'},
        {_id: '96', status: 'active', name: 'Talk about stuff and help each other out', jiraTaskId: 'AA-201'}];

      testStages = [
        {_id: '93', stageNumber: 1, name: 'Stage 1'},
        {_id: '11', stageNumber: 2, name: 'Stage 2'},
        {_id: '82', stageNumber: 3, name: 'Stage 3'},
        {_id: '89', stageNumber: 4, name: 'Stage 4'},
        {_id: '87', stageNumber: 5, name: 'Stage 5'}
      ];
    }

    function compile(html) {
      var el = angular.element(html);
      $compile(el)($scope);
      $scope.$digest();

      return el;
    }
  });
}());
