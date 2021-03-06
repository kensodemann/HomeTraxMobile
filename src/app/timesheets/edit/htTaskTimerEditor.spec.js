/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.timesheets.edit.htTaskTimerEditor', function() {
    var $compile;
    var config;
    var $httpBackend;
    var $scope;

    var mockIonicModal;
    var mockProjectFinder;
    var mockStageFinder;
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
      mockProjectFinder = sinon.stub({
        show: function() {
        },

        remove: function() {
        }
      });
    });

    beforeEach(function() {
      mockStageFinder = sinon.stub({
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
      mockIonicModal.fromTemplate.onFirstCall().returns(mockProjectFinder);
      mockIonicModal.fromTemplate.onSecondCall().returns(mockStageFinder);
    });

    beforeEach(function() {
      module(function($provide) {
        $provide.value('timesheetTaskTimers', mockTimesheetTaskTimers);
        $provide.value('waitSpinner', mockWaitSpinner);
        $provide.value('$ionicModal', mockIonicModal);
      });
    });

    beforeEach(inject(function($templateCache) {
      $templateCache.put('app/common/templates/errorMessages.html', '<div></div>');
    }));


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

    describe('finder dialogs', function() {
      var controller;
      beforeEach(function() {
        $scope.taskTimer = {};
        var el = compile('<ht-task-timer-editor ht-task-timer="taskTimer"></ht-task-timer-editor>');
        controller = el.isolateScope().controller;
        $httpBackend.flush();
      });

      it('are loaded on activation', function() {
        expect(mockIonicModal.fromTemplate.calledTwice).to.be.true;
      });

      it('are assigned on the controller', function() {
        expect(controller.projectFinderDialog).to.equal(mockProjectFinder);
        expect(controller.stageFinderDialog).to.equal(mockStageFinder);
      });

      it('are removed when this controllr is destroyed', function() {
        $scope.$broadcast('$destroy');
        $scope.$digest();
        expect(mockProjectFinder.remove.calledOnce).to.be.true;
        expect(mockStageFinder.remove.calledOnce).to.be.true;
      });
    });

    describe('when the task timer changes', function() {
      var controller;
      beforeEach(function() {
        $scope.dialog = {};
        var el = compile('<ht-task-timer-editor ht-dialog="dialog" ht-task-timer="taskTimer"></ht-task-timer-editor>');
        controller = el.isolateScope().controller;
        $httpBackend.expectGET(config.dataService + '/projects?status=active').respond(200, testProjects);
      });

      describe('to an existing used task timer', function() {
        beforeEach(function() {
          $scope.taskTimer = {
            _id: '24',
            name: 'I am a fake task',
            milliseconds: 1380000,
            status: 'active'
          };
          $scope.$digest();
          $httpBackend.flush();
        });

        it('assigns the fetched projects to the controller project list', function() {
          expect(angular.equals(controller.projects, testProjects)).to.be.true;
        });

        it('copies the timer to the editor model', function() {
          expect(controller.editModel).to.not.equal($scope.taskTimer);
          expect(angular.equals(controller.editModel, $scope.taskTimer)).to.be.true;
        });

        it('sets the title to "Modify Timer"', function() {
          expect(controller.title).to.equal('Modify Timer');
        });

        it('sets the time spent correctly', function() {
          expect(controller.timeSpent).to.equal('0:23');
        });
      });

      describe('to an existing unused task timer', function() {
        beforeEach(function() {
          $scope.taskTimer = {
            _id: '24',
            name: 'I am a fake task',
            status: 'active'
          };
          $scope.$digest();
          $httpBackend.flush();
        });

        it('assigns the fetched projects to the controller project list', function() {
          expect(angular.equals(controller.projects, testProjects)).to.be.true;
        });

        it('copies the timer to the editor model', function() {
          expect(controller.editModel).to.not.equal($scope.taskTimer);
          expect(angular.equals(controller.editModel, $scope.taskTimer)).to.be.true;
        });

        it('sets the title to "Modify Timer"', function() {
          expect(controller.title).to.equal('Modify Timer');
        });

        it('leaves the time spent undefined', function() {
          expect(controller.timeSpent).to.be.undefined;
        });
      });

      describe('to a new task timer', function() {
        beforeEach(function() {
          $scope.taskTimer = {
            status: 'active'
          };
          $scope.$digest();
          $httpBackend.flush();
        });

        it('assigns the fetched projects to the controller project list', function() {
          expect(angular.equals(controller.projects, testProjects)).to.be.true;
        });

        it('copies the timer to the editor model', function() {
          expect(controller.editModel).to.not.equal($scope.taskTimer);
          expect(angular.equals(controller.editModel, $scope.taskTimer)).to.be.true;
        });

        it('sets the title to "New Timer"', function() {
          expect(controller.title).to.equal('New Timer');
        });

        it('leaves the time spent undefined', function() {
          expect(controller.timeSpent).to.be.undefined;
        });
      });
    });

    describe('saving an existing task timer', function() {
      var controller;
      beforeEach(function() {
        $scope.dialog = {
          hide: sinon.stub()
        };
        var el = compile('<ht-task-timer-editor ht-dialog="dialog" ht-task-timer="taskTimer"></ht-task-timer-editor>');
        controller = el.isolateScope().controller;
        showDialog({
          _id: 42378,
          name: 'I am existing timer',
          timesheetRid: 3,
          project: testProjects[1]
        });
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

      it('converts hours and minutes properly', function() {
        controller.editModel.project = testProjects[3];
        controller.editModel.name = 'My name is Fred';
        controller.timeSpent = '1:23';
        $httpBackend.expectPOST(config.dataService + '/timesheets/3/taskTimers/42378', {
          _id: 42378,
          name: 'My name is Fred',
          timesheetRid: 3,
          project: testProjects[3],
          milliseconds: 4980000
        }).respond();
        controller.save();
        $httpBackend.flush();
      });

      it('converts hours and decimal fracion of hours properly', function() {
        controller.editModel.project = testProjects[3];
        controller.editModel.name = 'My name is Fred';
        controller.timeSpent = '1.23';
        $httpBackend.expectPOST(config.dataService + '/timesheets/3/taskTimers/42378', {
          _id: 42378,
          name: 'My name is Fred',
          timesheetRid: 3,
          project: testProjects[3],
          milliseconds: 4428000
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

        it('hides the dialog', function() {
          expect($scope.dialog.hide.calledOnce).to.be.true;
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

        it('does not hide the dialog', function() {
          expect($scope.dialog.hide.called).to.be.false;
        });
      });
    });

    describe('saving a new task timer', function() {
      var controller;
      beforeEach(function() {
        $scope.dialog = {
          hide: sinon.stub()
        };
        var el = compile('<ht-task-timer-editor ht-dialog="dialog" ht-task-timer="taskTimer"></ht-task-timer-editor>');
        controller = el.isolateScope().controller;
        showDialog({
          timesheetRid: 78
        });
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

        it('adds the task timer to the list', function() {
          expect(mockTimesheetTaskTimers.add.calledOnce).to.be.true;
          expect(angular.equals(mockTimesheetTaskTimers.add.firstCall.args[0], {
            _id: 188375,
            name: 'My name is Fred',
            timesheetRid: 78,
            project: testProjects[3]
          })).to.be.true;
        });

        it('hides the dialog', function() {
          expect($scope.dialog.hide.calledOnce).to.be.true;
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

        it('does not hide the dialog', function() {
          expect($scope.dialog.hide.called).to.be.false;
        });
      });
    });

    function initializeTestData() {
      testProjects = [{ _id: '42', name: 'Admit It Ted', jiraTaskId: 'AA-101', status: 'active' },
        { _id: '73', name: 'Believe', jiraTaskId: 'AA-102', status: 'active' },
        { _id: '24', name: 'Project Editor', jiraTaskId: 'HT-123', sbvbTaskId: 'RFP14141', status: 'active' },
        { _id: '314159', name: 'Time Report', jiraTaskId: 'HT-211', sbvbTaskId: 'RFP14141', status: 'active' },
        { _id: '96', status: 'active', name: 'Talk about stuff and help each other out', jiraTaskId: 'AA-201' }];

      testStages = [
        { _id: '93', stageNumber: 1, name: 'Stage 1' },
        { _id: '11', stageNumber: 2, name: 'Stage 2' },
        { _id: '82', stageNumber: 3, name: 'Stage 3' },
        { _id: '89', stageNumber: 4, name: 'Stage 4' },
        { _id: '87', stageNumber: 5, name: 'Stage 5' }
      ];
    }

    function compile(html) {
      var el = angular.element(html);
      $compile(el)($scope);
      $scope.$digest();

      return el;
    }

    function showDialog(tt) {
      $httpBackend.whenGET(config.dataService + '/projects?status=active').respond(200, testProjects);
      $scope.taskTimer = tt;
      $scope.$digest();
      $httpBackend.flush();
    }
  });
} ());
