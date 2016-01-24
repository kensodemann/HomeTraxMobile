/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.timesheets.view.viewTimesheetController', function() {
    var mockIonicModal;
    var mockStateParams;
    var mockTaskTimerEditor;
    var mockTimesheets;
    var mockTimesheetTaskTimers;

    var $controllerConstructor;
    var $scope;

    var clock;
    var getDfd;
    var loadDfd;
    var testTaskTimers;
    var testTimesheet;

    beforeEach(module('homeTrax.timesheets.view.viewTimesheetController'));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(inject(function($controller, $q, $rootScope) {
      $controllerConstructor = $controller;
      getDfd = $q.defer();
      loadDfd = $q.defer();
      $scope = $rootScope.$new();
    }));

    beforeEach(function() {
      clock = sinon.useFakeTimers();
    });

    beforeEach(function() {
      mockTaskTimerEditor = sinon.stub({
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
      mockIonicModal.fromTemplate.returns(mockTaskTimerEditor);
    });

    beforeEach(function() {
      mockStateParams = {};
    });

    beforeEach(function() {
      mockTimesheets = sinon.stub({
        get: function() {
        },

        getCurrent: function() {
        }
      });

      mockTimesheets.get.returns(getDfd.promise);
      mockTimesheets.getCurrent.returns(getDfd.promise);
    });

    beforeEach(function() {
      mockTimesheetTaskTimers = sinon.stub({
        load: function() {
        },

        get: function() {
        },

        totalTime: function() {
        },

        create: function() {
        },

        start: function() {
        },

        stop: function() {
        }
      });
      mockTimesheetTaskTimers.load.returns(loadDfd.promise);
    });

    afterEach(function() {
      clock.restore();
    });

    function createController() {
      var controller = $controllerConstructor('viewTimesheetController', {
        $scope: $scope,
        $stateParams: mockStateParams,
        $ionicModal: mockIonicModal,
        timesheets: mockTimesheets,
        timesheetTaskTimers: mockTimesheetTaskTimers
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
          expect(mockTimesheets.get.called).to.be.false;
          expect(mockTimesheets.getCurrent.calledOnce).to.be.true;
        });
      });

      describe('with an id', function() {
        it('gets the timesheet with the specified ID', function() {
          mockStateParams.id = 73;
          createController();
          expect(mockTimesheets.get.calledOnce).to.be.true;
          expect(mockTimesheets.get.calledWith(73)).to.be.true;
          expect(mockTimesheets.getCurrent.called).to.be.false;
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
          var dt = new Date('2015-12-31');
          clock.tick(dt.getTime());
          var controller = createController();
          getDfd.resolve(testTimesheet);
          $scope.$digest();
          expect(controller.currentDate).to.equal('2015-12-31');
        });

        it('assigns the selected date to the first day of the timesheet if today is not in range', function() {
          var dt = new Date('2016-01-03');
          clock.tick(dt.getTime());
          var controller = createController();
          getDfd.resolve(testTimesheet);
          $scope.$digest();
          expect(controller.currentDate).to.equal('2015-12-27');
        });

        it('gets the task timers', function() {
          createController();
          expect(mockTimesheetTaskTimers.load.called).to.be.false;
          getDfd.resolve(testTimesheet);
          $scope.$digest();
          expect(mockTimesheetTaskTimers.load.calledOnce).to.be.true;
          expect(mockTimesheetTaskTimers.load.calledWith(testTimesheet)).to.be.true;
        });

        describe('after load of task timers', function() {
          var controller;
          beforeEach(function() {
            var dt = new Date('2015-12-31');
            clock.tick(dt.getTime());
            controller = createController();
            getDfd.resolve(testTimesheet);
            $scope.$digest();
          });

          it('gets the task timers for the current day', function() {
            mockTimesheetTaskTimers.get.returns(testTaskTimers);
            loadDfd.resolve();
            $scope.$digest();
            expect(mockTimesheetTaskTimers.get.calledOnce).to.be.true;
            expect(mockTimesheetTaskTimers.get.calledWith('2015-12-31')).to.be.true;
            expect(controller.taskTimers).to.equal(testTaskTimers);
          });

          it('recalculates the totals for the current day', function() {
            mockTimesheetTaskTimers.totalTime.returns(124159);
            loadDfd.resolve();
            $scope.$digest();
            expect(mockTimesheetTaskTimers.totalTime.calledOnce).to.be.true;
            expect(mockTimesheetTaskTimers.totalTime.calledWith('2015-12-31')).to.be.true;
            expect(controller.totalTime).to.equal(124159);
          });
        });
      });
    });

    describe('selecting a new date', function() {
      var controller;
      beforeEach(function() {
        var dt = new Date('2015-12-31');
        clock.tick(dt.getTime());
        controller = createController();
        getDfd.resolve(testTimesheet);
        $scope.$digest();
        mockTimesheetTaskTimers.get.reset();
        mockTimesheetTaskTimers.totalTime.reset();
      });

      it('gets the task timers for the new date', function() {
        controller.currentDate = '2015-12-30';
        $scope.$digest();
        expect(mockTimesheetTaskTimers.get.called).to.be.true;
        expect(mockTimesheetTaskTimers.get.calledWith('2015-12-30')).to.be.true;
      });

      it('recalculates the total time for the new date', function() {
        controller.currentDate = '2015-12-30';
        $scope.$digest();
        expect(mockTimesheetTaskTimers.totalTime.calledOnce).to.be.true;
        expect(mockTimesheetTaskTimers.totalTime.calledWith('2015-12-30')).to.be.true;
      });

      it('does nothing if the date does not change', function() {
        controller.currentDate = '2015-12-31';
        $scope.$digest();
        expect(mockTimesheetTaskTimers.get.called).to.be.false;
        expect(mockTimesheetTaskTimers.totalTime.called).to.be.false;
      });
    });

    describe('task timer editor', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
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
    });

    describe('creation of a new task time', function() {
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
