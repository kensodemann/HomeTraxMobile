/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.timesheets.view.viewTimesheetController', function() {
    var mockIonicModal;
    var mockState;
    var mockStateParams;
    var mockTaskTimerEditor;

    var messageDialog;
    var timesheets;
    var timesheetTaskTimers;

    var $controllerConstructor;
    var $interval;
    var $rootScope;
    var $scope;

    var clock;
    var askDfd;
    var deleteDfd;
    var getDfd;
    var loadDfd;
    var startDfd;
    var stopDfd;
    var testTaskTimers;
    var testTimesheet;
    var waitSpinner;

    beforeEach(module('homeTrax.timesheets.view.viewTimesheetController'));

    beforeEach(function() {
      module(function($provide) {
        $provide.value('$ionicLoading', sinon.stub());
        $provide.value('$ionicPopup', sinon.stub());
      });
    });

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(inject(function($controller, $q) {
      $controllerConstructor = $controller;
      askDfd = $q.defer();
      deleteDfd = $q.defer();
      getDfd = $q.defer();
      loadDfd = $q.defer();
      startDfd = $q.defer();
      stopDfd = $q.defer();
    }));

    beforeEach(inject(function(_$rootScope_, _$interval_, _messageDialog_, _timesheets_, _timesheetTaskTimers_, _waitSpinner_) {
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();
      $interval = _$interval_;
      messageDialog = _messageDialog_;
      timesheets = _timesheets_;
      timesheetTaskTimers = _timesheetTaskTimers_;
      waitSpinner = _waitSpinner_;
    }));

    beforeEach(function() {
      clock = sinon.useFakeTimers();
    });

    beforeEach(function() {
      mockTaskTimerEditor = sinon.stub({
        show: function() {},

        remove: function() {}
      });
    });

    beforeEach(function() {
      mockIonicModal = sinon.stub({
        fromTemplate: function() {}
      });
      mockIonicModal.fromTemplate.returns(mockTaskTimerEditor);
    });

    beforeEach(function() {
      mockState = {
        current: {
          name: 'does not usually matter'
        }
      };
    });

    beforeEach(function() {
      mockStateParams = {};
    });

    beforeEach(function() {
      sinon.stub(timesheets, 'get');
      sinon.stub(timesheets, 'getCurrent');

      timesheets.get.returns(getDfd.promise);
      timesheets.getCurrent.returns(getDfd.promise);
    });

    beforeEach(function() {
      sinon.stub(timesheetTaskTimers, 'load');
      timesheetTaskTimers.load.returns(loadDfd.promise);

      sinon.stub(timesheetTaskTimers, 'get');
      sinon.stub(timesheetTaskTimers, 'totalTime');
    });

    afterEach(function() {
      clock.restore();

      timesheets.get.restore();
      timesheets.getCurrent.restore();

      timesheetTaskTimers.load.restore();
      timesheetTaskTimers.get.restore();
      timesheetTaskTimers.totalTime.restore();
    });

    function createController() {
      var controller = $controllerConstructor('viewTimesheetController', {
        $scope: $scope,
        $stateParams: mockStateParams,
        $state: mockState,
        $ionicModal: mockIonicModal
      });
      $scope.controller = controller;
      return controller;
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });

    describe('activation', function() {
      describe('without an id', function() {
        it('gets the current timesheet', function() {
          createController();
          expect(timesheets.get.called).to.be.false;
          expect(timesheets.getCurrent.calledOnce).to.be.true;
        });
      });

      describe('with an id', function() {
        it('gets the timesheet with the specified ID', function() {
          mockStateParams.id = 73;
          createController();
          expect(timesheets.get.calledOnce).to.be.true;
          expect(timesheets.get.calledWith(73)).to.be.true;
          expect(timesheets.getCurrent.called).to.be.false;
        });
      });

      describe('after get of timesheet', function() {
        it('assigns the fetched timesheet', function() {
          var controller = createController();
          getDfd.resolve(testTimesheet);
          $scope.$digest();
          expect(controller.timesheet).to.equal(testTimesheet);
        });

        it('assigns the selected date to today if it is in the range', function() {
          var dt = new Date(2015, 11, 31);
          clock.tick(dt.getTime());
          var controller = createController();
          getDfd.resolve(testTimesheet);
          $scope.$digest();
          expect(controller.currentDate).to.equal('2015-12-31');
        });

        it('assigns the selected date to the first day of the timesheet if today is not in range', function() {
          var dt = new Date(2016, 0, 3);
          clock.tick(dt.getTime());
          var controller = createController();
          getDfd.resolve(testTimesheet);
          $scope.$digest();
          expect(controller.currentDate).to.equal('2015-12-27');
        });

        it('gets the task timers', function() {
          createController();
          expect(timesheetTaskTimers.load.called).to.be.false;
          getDfd.resolve(testTimesheet);
          $scope.$digest();
          expect(timesheetTaskTimers.load.calledOnce).to.be.true;
          expect(timesheetTaskTimers.load.calledWith(testTimesheet)).to.be.true;
        });

        describe('after load of task timers', function() {
          var controller;
          beforeEach(function() {
            var dt = new Date(2015, 11, 31);
            clock.tick(dt.getTime());
            controller = createController();
            getDfd.resolve(testTimesheet);
            $scope.$digest();
          });

          it('gets the task timers for the current day', function() {
            timesheetTaskTimers.get.returns(testTaskTimers);
            loadDfd.resolve();
            $scope.$digest();
            expect(timesheetTaskTimers.get.calledOnce).to.be.true;
            expect(timesheetTaskTimers.get.calledWith('2015-12-31')).to.be.true;
            expect(controller.taskTimers).to.equal(testTaskTimers);
          });

          it('recalculates the totals for the current day', function() {
            timesheetTaskTimers.totalTime.returns(124159);
            loadDfd.resolve();
            $scope.$digest();
            expect(timesheetTaskTimers.totalTime.calledOnce).to.be.true;
            expect(timesheetTaskTimers.totalTime.calledWith('2015-12-31')).to.be.true;
            expect(controller.totalTime).to.equal(124159);
          });
        });
      });

      it('schedules a refresh of data every 15 seconds', function() {
        createController();
        getDfd.resolve(testTimesheet);
        $scope.$digest();
        loadDfd.resolve();
        $scope.$digest();
        timesheetTaskTimers.load.reset();
        timesheetTaskTimers.get.reset();
        timesheetTaskTimers.totalTime.reset();
        $interval.flush(15000);
        expect(timesheetTaskTimers.load.calledOnce).to.be.true;
        expect(timesheetTaskTimers.load.calledWith(testTimesheet)).to.be.true;
        expect(timesheetTaskTimers.get.calledOnce).to.be.true;
        expect(timesheetTaskTimers.totalTime.calledOnce).to.be.true;
      });
    });

    describe('selecting a new date', function() {
      var controller;
      beforeEach(function() {
        var dt = new Date(2015, 11, 31);
        clock.tick(dt.getTime());
        controller = createController();
        getDfd.resolve(testTimesheet);
        $scope.$digest();
        loadDfd.resolve();
        $scope.$digest();
        timesheetTaskTimers.load.reset();
        timesheetTaskTimers.get.reset();
        timesheetTaskTimers.totalTime.reset();
      });

      it('gets the task timers for the new date', function() {
        controller.currentDate = '2015-12-30';
        $scope.$digest();
        expect(timesheetTaskTimers.load.calledOnce).to.be.true;
        expect(timesheetTaskTimers.load.calledWith(testTimesheet)).to.be.true;
        expect(timesheetTaskTimers.get.calledOnce).to.be.true;
        expect(timesheetTaskTimers.get.calledWith('2015-12-30')).to.be.true;
      });

      it('recalculates the total time for the new date', function() {
        controller.currentDate = '2015-12-30';
        $scope.$digest();
        expect(timesheetTaskTimers.totalTime.calledOnce).to.be.true;
        expect(timesheetTaskTimers.totalTime.calledWith('2015-12-30')).to.be.true;
      });

      it('does nothing if the date does not change', function() {
        controller.currentDate = '2015-12-31';
        $scope.$digest();
        expect(timesheetTaskTimers.get.called).to.be.false;
        expect(timesheetTaskTimers.totalTime.called).to.be.false;
      });
    });

    describe('task timer editor', function() {
      var controller;
      beforeEach(function() {
        var dt = new Date(2015, 11, 31);
        clock.tick(dt.getTime());
        controller = createController();
        getDfd.resolve(testTimesheet);
        $scope.$digest();
        loadDfd.resolve();
        $scope.$digest();
        timesheetTaskTimers.load.reset();
        timesheetTaskTimers.get.reset();
        timesheetTaskTimers.totalTime.reset();
      });

      it('is loaded on activation', function() {
        expect(mockIonicModal.fromTemplate.calledOnce).to.be.true;
      });

      it('is assigned on the controller', function() {
        expect(controller.taskTimerEditor).to.equal(mockTaskTimerEditor);
      });

      it('is removed when this controllr is destroyed', function() {
        $scope.$broadcast('$destroy');
        $scope.$digest();
        expect(mockTaskTimerEditor.remove.calledOnce).to.be.true;
      });

      describe('hiding', function() {
        it('refreshes the timer list and total time for today', function() {
          $scope.$broadcast('modal.hidden', controller.taskTimerEditor);
          $scope.$digest();
          expect(timesheetTaskTimers.load.calledOnce).to.be.true;
          expect(timesheetTaskTimers.load.calledWith(testTimesheet)).to.be.true;
          expect(timesheetTaskTimers.get.calledOnce).to.be.true;
          expect(timesheetTaskTimers.get.calledWith('2015-12-31')).to.be.true;
          expect(timesheetTaskTimers.totalTime.calledOnce).to.be.true;
          expect(timesheetTaskTimers.totalTime.calledWith('2015-12-31')).to.be.true;
        });
      });
    });

    describe('creation of a new task timer', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
        getDfd.resolve(testTimesheet);
        $scope.$digest();
        controller.currentDate = '2015-12-29';
      });

      it('sets the current task timer to a new task time for the current timesheet', function() {
        controller.createTaskTimer();
        expect(angular.equals(controller.currentTaskTimer, {
          workDate: '2015-12-29',
          timesheetRid: 314159
        })).to.be.true;
      });

      it('shows the task timer editor', function() {
        controller.createTaskTimer();
        expect(mockTaskTimerEditor.show.calledOnce).to.be.true;
      });
    });

    describe('on home-trax-new-item', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
        getDfd.resolve(testTimesheet);
        $scope.$digest();
        controller.currentDate = '2015-12-29';
      });

      describe('with current state app.timesheets.view', function() {
        beforeEach(function() {
          mockState.current.name = 'app.timesheets.view';
        });

        it('sets the current task timer to a new task time for the current timesheet', function() {
          $rootScope.$broadcast('home-trax-new-item');
          expect(angular.equals(controller.currentTaskTimer, {
            workDate: '2015-12-29',
            timesheetRid: 314159
          })).to.be.true;
        });

        it('shows the task timer editor', function() {
          $rootScope.$broadcast('home-trax-new-item');
          expect(mockTaskTimerEditor.show.calledOnce).to.be.true;
        });
      });

      describe('with current state app.timesheets.view', function() {
        beforeEach(function() {
          mockState.current.name = 'app.timesheets.viewCurrent';
        });

        it('sets the current task timer to a new task time for the current timesheet', function() {
          $rootScope.$broadcast('home-trax-new-item');
          expect(angular.equals(controller.currentTaskTimer, {
            workDate: '2015-12-29',
            timesheetRid: 314159
          })).to.be.true;
        });

        it('shows the task timer editor', function() {
          $rootScope.$broadcast('home-trax-new-item');
          expect(mockTaskTimerEditor.show.calledOnce).to.be.true;
        });
      });

      describe('with some other state', function() {
        beforeEach(function() {
          mockState.current.name = 'app.timesheets.list';
        });

        it('does nothing', function() {
          $rootScope.$broadcast('home-trax-new-item');
          expect(mockTaskTimerEditor.show.called).to.be.false;
        });
      });
    });

    describe('deleting a task timer', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
        sinon.stub(messageDialog, 'ask');
        sinon.stub(timesheetTaskTimers, 'delete');
        messageDialog.ask.returns(askDfd.promise);
        timesheetTaskTimers.delete.returns(deleteDfd.promise);
        getDfd.resolve(testTimesheet);
        $scope.$digest();
        loadDfd.resolve();
        $scope.$digest();
        controller.currentDate = '2015-12-31';
        $scope.$digest();
        timesheetTaskTimers.load.reset();
        timesheetTaskTimers.get.reset();
        timesheetTaskTimers.totalTime.reset();
      });

      afterEach(function() {
        messageDialog.ask.restore();
        timesheetTaskTimers.delete.restore();
      });

      it('asks the user if they are sure', function() {
        controller.deleteTaskTimer();
        expect(messageDialog.ask.calledOnce).to.be.true;
        expect(messageDialog.ask.calledWith('Are You Sure?', 'Are you sure you want to delete this timer?')).to.be.true;
      });

      describe('if the user is sure', function() {
        beforeEach(function() {
          sinon.stub(waitSpinner, 'show');
          sinon.stub(waitSpinner, 'hide');
        });

        beforeEach(function() {
          controller.deleteTaskTimer({
            id: 42,
            name: 'Adams'
          });
          askDfd.resolve(true);
          $scope.$digest();
        });

        afterEach(function() {
          waitSpinner.show.restore();
          waitSpinner.hide.restore();
        });

        it('removes the task timer', function() {
          expect(timesheetTaskTimers.delete.calledOnce).to.be.true;
          expect(timesheetTaskTimers.delete.calledWith({
            id: 42,
            name: 'Adams'
          })).to.be.true;
        });

        it('shows a wait spinner', function() {
          expect(waitSpinner.show.calledOnce).to.be.true;
          expect(waitSpinner.hide.called).to.be.false;
        });

        describe('a successful delete', function() {
          beforeEach(function() {
            deleteDfd.resolve();
            $scope.$digest();
          });

          it('hides the wait spinner', function() {
            expect(waitSpinner.hide.calledOnce).to.be.true;
          });

          it('refreshes the task timers for the current date', function() {
            expect(timesheetTaskTimers.load.calledOnce).to.be.true;
            expect(timesheetTaskTimers.load.calledWith(testTimesheet)).to.be.true;
            expect(timesheetTaskTimers.get.calledOnce).to.be.true;
            expect(timesheetTaskTimers.get.calledWith('2015-12-31')).to.be.true;
          });

          it('refreshes the total time for the current date', function() {
            expect(timesheetTaskTimers.totalTime.calledOnce).to.be.true;
            expect(timesheetTaskTimers.totalTime.calledWith('2015-12-31')).to.be.true;
          });
        });

        describe('a failed delete', function() {
          beforeEach(function() {
            sinon.stub(messageDialog, 'error');
          });

          beforeEach(function() {
            deleteDfd.reject({
              data: {
                reason: 'Because you suck eggs'
              }
            });
            $scope.$digest();
          });

          afterEach(function() {
            messageDialog.error.restore();
          });

          it('hides the wait spinner', function() {
            expect(waitSpinner.hide.calledOnce).to.be.true;
          });

          it('shows the error dialog', function() {
            expect(messageDialog.error.calledOnce).to.be.true;
            expect(messageDialog.error.calledWith('Error', 'Because you suck eggs')).to.be.true;
          });
        });
      });

      describe('if the user does not want to', function() {
        beforeEach(function() {
          controller.deleteTaskTimer({
            id: 42,
            name: 'Adams'
          });
          askDfd.resolve(false);
          $scope.$digest();
        });

        it('does not remove the task timer', function() {
          expect(timesheetTaskTimers.delete.called).to.be.false;
        });
      });
    });

    describe('toggling a timer', function() {
      var controller;
      beforeEach(function() {
        var dt = new Date(2015, 11, 31);
        clock.tick(dt.getTime());
        controller = createController();
        getDfd.resolve(testTimesheet);
        $scope.$digest();
        loadDfd.resolve();
        $scope.$digest();
        timesheetTaskTimers.load.reset();
        timesheetTaskTimers.get.reset();
        timesheetTaskTimers.totalTime.reset();
      });

      beforeEach(function() {
        sinon.stub(timesheetTaskTimers, 'start');
        sinon.stub(timesheetTaskTimers, 'stop');

        timesheetTaskTimers.start.returns(startDfd.promise);
        timesheetTaskTimers.stop.returns(stopDfd.promise);
      });

      afterEach(function() {
        timesheetTaskTimers.start.restore();
        timesheetTaskTimers.stop.restore();
      });

      describe('when the timer is not active', function() {
        it('starts the timer', function() {
          controller.timerToggled(testTaskTimers[2]);
          expect(timesheetTaskTimers.start.calledOnce).to.be.true;
          expect(timesheetTaskTimers.start.calledWith(testTaskTimers[2])).to.be.true;
        });

        it('refreshes the task timers for the current date', function() {
          controller.timerToggled(testTaskTimers[2]);
          expect(timesheetTaskTimers.get.called).to.be.false;
          startDfd.resolve();
          $scope.$digest();
          expect(timesheetTaskTimers.load.calledOnce).to.be.true;
          expect(timesheetTaskTimers.get.calledOnce).to.be.true;
          expect(timesheetTaskTimers.get.calledWith('2015-12-31')).to.be.true;
        });

        it('refreshes the total time for the current date', function() {
          controller.timerToggled(testTaskTimers[2]);
          expect(timesheetTaskTimers.totalTime.called).to.be.false;
          startDfd.resolve();
          $scope.$digest();
          expect(timesheetTaskTimers.load.calledOnce).to.be.true;
          expect(timesheetTaskTimers.totalTime.calledOnce).to.be.true;
          expect(timesheetTaskTimers.totalTime.calledWith('2015-12-31')).to.be.true;
        });
      });

      describe('when the timer is not active', function() {
        it('starts the timer', function() {
          controller.timerToggled(testTaskTimers[2]);
          expect(timesheetTaskTimers.stop.called).to.be.false;
          expect(timesheetTaskTimers.start.calledOnce).to.be.true;
          expect(timesheetTaskTimers.start.calledWith(testTaskTimers[2])).to.be.true;
        });

        it('refreshes the task timers for the current date', function() {
          controller.timerToggled(testTaskTimers[2]);
          expect(timesheetTaskTimers.get.called).to.be.false;
          startDfd.resolve();
          $scope.$digest();
          expect(timesheetTaskTimers.get.calledOnce).to.be.true;
          expect(timesheetTaskTimers.get.calledWith('2015-12-31')).to.be.true;
        });

        it('refreshes the total time for the current date', function() {
          controller.timerToggled(testTaskTimers[2]);
          expect(timesheetTaskTimers.totalTime.called).to.be.false;
          startDfd.resolve();
          $scope.$digest();
          expect(timesheetTaskTimers.totalTime.calledOnce).to.be.true;
          expect(timesheetTaskTimers.totalTime.calledWith('2015-12-31')).to.be.true;
        });
      });

      describe('when the timer is active', function() {
        beforeEach(function() {
          testTaskTimers[2].isActive = true;
        });

        it('stops the timer', function() {
          controller.timerToggled(testTaskTimers[2]);
          expect(timesheetTaskTimers.start.called).to.be.false;
          expect(timesheetTaskTimers.stop.calledOnce).to.be.true;
          expect(timesheetTaskTimers.stop.calledWith(testTaskTimers[2])).to.be.true;
        });

        it('refreshes the task timers for the current date', function() {
          controller.timerToggled(testTaskTimers[2]);
          expect(timesheetTaskTimers.get.called).to.be.false;
          stopDfd.resolve();
          $scope.$digest();
          expect(timesheetTaskTimers.get.calledOnce).to.be.true;
          expect(timesheetTaskTimers.get.calledWith('2015-12-31')).to.be.true;
        });

        it('refreshes the total time for the current date', function() {
          controller.timerToggled(testTaskTimers[2]);
          expect(timesheetTaskTimers.totalTime.called).to.be.false;
          stopDfd.resolve();
          $scope.$digest();
          expect(timesheetTaskTimers.totalTime.calledOnce).to.be.true;
          expect(timesheetTaskTimers.totalTime.calledWith('2015-12-31')).to.be.true;
        });
      });
    });

    describe('clicking a timer', function() {
      var controller;
      beforeEach(function() {
        var dt = new Date(2015, 11, 31);
        clock.tick(dt.getTime());
        controller = createController();
        getDfd.resolve(testTimesheet);
        $scope.$digest();
        timesheetTaskTimers.get.reset();
        timesheetTaskTimers.totalTime.reset();
      });

      it('sets the current task timer', function() {
        controller.timerClicked(testTaskTimers[2]);
        expect(controller.currentTaskTimer).to.equal(testTaskTimers[2]);
      });

      it('shows the editor', function() {
        controller.timerClicked(testTaskTimers[2]);
        expect(mockTaskTimerEditor.show.calledOnce).to.be.true;
      });
    });

    function initializeTestData() {
      testTimesheet = {
        _id: 314159,
        endDate: '2016-01-02'
      };

      testTaskTimers = [{
        _id: 2,
        name: 'Test Data #1'
      }, {
        _id: 3,
        name: 'Test Data #1'
      }, {
        _id: 5,
        name: 'Test Data #1'
      }, {
        _id: 7,
        name: 'Test Data #1'
      }, {
        _id: 11,
        name: 'Test Data #1'
      }];
    }
  });
}());
