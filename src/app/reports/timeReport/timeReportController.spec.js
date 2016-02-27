/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.reports.timeReport.timeReportController', function() {
    var mockMessageDialog;
    var mockStateParams;
    var mockTimeReportData;
    var mockTimesheets;
    var mockTimesheetTaskTimers;

    var $controllerConstructor;

    var getCurrentDfd;
    var getDfd;
    var loadDfd;
    var $scope;

    beforeEach(module('homeTrax.reports.timeReport.timeReportController'));

    beforeEach(inject(function($q, $rootScope, $controller) {
      $controllerConstructor = $controller;
      $scope = $rootScope.$new();
      getCurrentDfd = $q.defer();
      getDfd = $q.defer();
      loadDfd = $q.defer();
    }));

    beforeEach(function() {
      mockMessageDialog = sinon.stub({
        error: function() {
        }
      });
    });

    beforeEach(function() {
      mockStateParams = {};
    });

    beforeEach(function() {
      mockTimeReportData = sinon.stub({
        getSummaryData: function() {
        },

        getDailySummaryData: function() {
        }
      });
      mockTimeReportData.getSummaryData.returns('Summary Data');
      mockTimeReportData.getDailySummaryData.returns('Daily Summary Data');
    });

    beforeEach(function() {
      mockTimesheets = sinon.stub({
        get: function() {
        },

        getCurrent: function() {
        }
      });
      mockTimesheets.get.returns(getDfd.promise);
      mockTimesheets.getCurrent.returns(getCurrentDfd.promise);
    });

    beforeEach(function() {
      mockTimesheetTaskTimers = sinon.stub({
        load: function() {
        }
      });
      mockTimesheetTaskTimers.load.returns(loadDfd.promise);
    });

    beforeEach(inject(function($controller) {
      $controllerConstructor = $controller;
    }));

    function createController() {
      return $controllerConstructor('timeReportController', {
        timeReportData: mockTimeReportData,
        timesheets: mockTimesheets,
        timesheetTaskTimers: mockTimesheetTaskTimers,
        messageDialog: mockMessageDialog,
        $stateParams: mockStateParams
      });
    }

    it('exists', function() {
      var controller = createController();
      expect(controller).to.exist;
    });

    describe('loading the data', function() {
      describe('with an ID', function() {
        it('loads the specified timesheet', function() {
          mockStateParams.id = 7342314159;
          createController();
          expect(mockTimesheets.getCurrent.called).to.be.false;
          expect(mockTimesheets.get.calledOnce).to.be.true;
          expect(mockTimesheets.get.calledWith(7342314159)).to.be.true;
        });
      });

      describe('without an ID', function() {
        it('loads the current timesheet', function() {
          createController();
          expect(mockTimesheets.getCurrent.calledOnce).to.be.true;
          expect(mockTimesheets.get.called).to.be.false;
        });
      });
    });

    describe('activation', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
      });

      it('assigns the resolved timesheet', function() {
        var timesheet = {
          _id: 42
        };
        getCurrentDfd.resolve(timesheet);
        $scope.$digest();
        expect(controller.timesheet).to.equal(timesheet);
      });

      it('displays an error message if timesheet load fails', function() {
        getCurrentDfd.reject({
          data: {
            reason: 'Because you suck eggs'
          }
        });
        $scope.$digest();
        expect(mockMessageDialog.error.calledOnce).to.be.true;
        expect(mockMessageDialog.error.calledWith('Error', 'Because you suck eggs')).to.be.true;
      });

      it('loads the task timers after it gets the timesheet', function() {
        var timesheet = {
          _id: 42
        };
        expect(mockTimesheetTaskTimers.load.called).to.be.false;
        getCurrentDfd.resolve(timesheet);
        $scope.$digest();
        expect(mockTimesheetTaskTimers.load.calledOnce).to.be.true;
        expect(mockTimesheetTaskTimers.load.calledWith(timesheet)).to.be.true;
      });

      it('assigns the summary data after load', function() {
        expect(mockTimeReportData.getSummaryData.called).to.be.false;
        expect(controller.summaryData).to.not.exist;
        getCurrentDfd.resolve();
        loadDfd.resolve();
        mockTimesheetTaskTimers.all = [1, 2, 3, 4];
        $scope.$digest();
        expect(mockTimeReportData.getSummaryData.calledOnce).to.be.true;
        expect(mockTimeReportData.getSummaryData.calledWith([1, 2, 3, 4])).to.be.true;
        expect(controller.summaryData).to.equal('Summary Data');
      });

      it('displays an error message if task timer load fails', function() {
        getCurrentDfd.resolve();
        loadDfd.reject({
          data: {
            reason: 'Because you suck eggs'
          }
        });
        $scope.$digest();
        expect(mockMessageDialog.error.calledOnce).to.be.true;
        expect(mockMessageDialog.error.calledWith('Error', 'Because you suck eggs')).to.be.true;
      });

      it('assigns the daily summary data after load', function() {
        expect(mockTimeReportData.getDailySummaryData.called).to.be.false;
        expect(controller.dailySummaryData).to.not.exist;
        getCurrentDfd.resolve();
        loadDfd.resolve();
        mockTimesheetTaskTimers.all = [1, 2, 3, 4];
        $scope.$digest();
        expect(mockTimeReportData.getDailySummaryData.calledOnce).to.be.true;
        expect(mockTimeReportData.getDailySummaryData.calledWith([1, 2, 3, 4])).to.be.true;
        expect(controller.dailySummaryData).to.equal('Daily Summary Data');
      });
    });
  });
}());
