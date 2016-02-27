/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.reports.services.timeReportData', function() {
    var timeReportData;

    var testTimesheet;
    var testTaskTimers;

    beforeEach(module('homeTrax.reports.services.timeReportData'));

    beforeEach(inject(function(_timeReportData_) {
      timeReportData = _timeReportData_;
    }));

    beforeEach(function() {
      initializeTestData();
    });

    it('exists', function() {
      expect(timeReportData).to.exist;
    });

    describe('summary data', function() {
      var summaryData;
      beforeEach(function() {
        summaryData = timeReportData.getSummaryData(testTaskTimers);
      });

      it('sums the total time', function() {
        expect(summaryData.totalTime).to.equal(224539559);
      });

      it('has one entry per JIRA task + one for unclassified, sorted', function() {
        expect(summaryData.jiraTasks.length).to.equal(4);
        expect(summaryData.jiraTasks[0].project.jiraTaskId).to.equal('HT-123');
        expect(summaryData.jiraTasks[1].project.jiraTaskId).to.equal('HT-124');
        expect(summaryData.jiraTasks[2].project.jiraTaskId).to.equal('ZNS-123');
        expect(summaryData.jiraTasks[3].project.jiraTaskId).to.not.exist;
      });

      it('sums each JIRA task + unclassified', function() {
        expect(summaryData.jiraTasks[0].totalTime).to.equal(74789732);
        expect(summaryData.jiraTasks[1].totalTime).to.equal(10837463);
        expect(summaryData.jiraTasks[2].totalTime).to.equal(1800000);
        expect(summaryData.jiraTasks[3].totalTime).to.equal(137112364);
      });

      it('has one entry per SBVB task, including unclassified, and stage', function() {
        expect(summaryData.sbvbTasks.length).to.equal(9);
        expect(summaryData.sbvbTasks[0].project.sbvbTaskId).to.equal('RFP14141');
        expect(summaryData.sbvbTasks[0].stage.stageNumber).to.equal(4);
        expect(summaryData.sbvbTasks[1].project.sbvbTaskId).to.equal('RFP14141');
        expect(summaryData.sbvbTasks[1].stage.stageNumber).to.equal(3);
        expect(summaryData.sbvbTasks[2].project.sbvbTaskId).to.equal('RFP14141');
        expect(summaryData.sbvbTasks[2].stage.stageNumber).to.equal(6);
        expect(summaryData.sbvbTasks[3].project.sbvbTaskId).to.equal('RFP14168');
        expect(summaryData.sbvbTasks[3].stage.stageNumber).to.equal(4);
        expect(summaryData.sbvbTasks[4].project.sbvbTaskId).to.equal('RFP14168');
        expect(summaryData.sbvbTasks[4].stage.stageNumber).to.equal(3);
        expect(summaryData.sbvbTasks[5].project.sbvbTaskId).to.equal('RFP14177');
        expect(summaryData.sbvbTasks[5].stage.stageNumber).to.equal(4);
        expect(summaryData.sbvbTasks[6].project.sbvbTaskId).to.equal('XYZ14167');
        expect(summaryData.sbvbTasks[6].stage.stageNumber).to.equal(2);
        expect(summaryData.sbvbTasks[7].project.sbvbTaskId).to.not.exist;
        expect(summaryData.sbvbTasks[7].stage.stageNumber).to.equal(0);
        expect(summaryData.sbvbTasks[8].project.sbvbTaskId).to.not.exist;
        expect(summaryData.sbvbTasks[8].stage.stageNumber).to.equal(4);
      });

      it('sums each SBVB task, including unclassified, and stage', function() {
        expect(summaryData.sbvbTasks[0].totalTime).to.equal(14437463);
        expect(summaryData.sbvbTasks[1].totalTime).to.equal(67589732);
        expect(summaryData.sbvbTasks[2].totalTime).to.equal(3600000);
        expect(summaryData.sbvbTasks[3].totalTime).to.equal(3600000);
        expect(summaryData.sbvbTasks[4].totalTime).to.equal(7200000);
        expect(summaryData.sbvbTasks[5].totalTime).to.equal(35412364);
        expect(summaryData.sbvbTasks[6].totalTime).to.equal(90000000);
        expect(summaryData.sbvbTasks[7].totalTime).to.equal(900000);
        expect(summaryData.sbvbTasks[8].totalTime).to.equal(1800000);
      });
    });

    describe('daily hours data ', function() {
      var dailyData;
      beforeEach(function() {
        dailyData = timeReportData.getDailySummaryData(testTaskTimers);
      });

      it('contains one row for each day with hours, sorted by date', function() {
        expect(dailyData.length).to.equal(5);
        expect(dailyData[0].date).to.equal('2015-11-30');
        expect(dailyData[1].date).to.equal('2015-12-01');
        expect(dailyData[2].date).to.equal('2015-12-02');
        expect(dailyData[3].date).to.equal('2015-12-03');
        expect(dailyData[4].date).to.equal('2015-12-04');
      });

      it('contains a list of summarized JIRA tasks for each day', function() {
        expect(dailyData[0].jiraTasks.length).to.equal(3);
        expect(dailyData[1].jiraTasks.length).to.equal(1);
        expect(dailyData[2].jiraTasks.length).to.equal(3);
        expect(dailyData[3].jiraTasks.length).to.equal(2);
        expect(dailyData[4].jiraTasks.length).to.equal(1);
      });

      it('contains a list of summarized SBVB tasks for each day', function() {
        expect(dailyData[0].sbvbTasks.length).to.equal(2);
        expect(dailyData[1].sbvbTasks.length).to.equal(1);
        expect(dailyData[2].sbvbTasks.length).to.equal(3);
        expect(dailyData[3].sbvbTasks.length).to.equal(2);
        expect(dailyData[4].sbvbTasks.length).to.equal(2);
      });
    });

    function initializeTestData() {
      initializeTestTimesheet();
      initializeTestTaskTimers();
    }

    function initializeTestTimesheet() {
      testTimesheet = {
        _id: '42',
        endDate: '2015-11-21'
      };
    }

    function initializeTestTaskTimers() {
      testTaskTimers = [{
        _id: '4211',
        timesheetRid: '42',
        workDate: '2015-11-30',
        stage: {
          stageNumber: 4,
          name: 'Coding'
        },
        project: {
          name: 'Project Editor',
          jiraTaskId: 'HT-123',
          sbvbTaskId: 'RFP14141',
          status: 'active'
        },
        milliseconds: 1800000
      }, {
        _id: '4212',
        timesheetRid: '42',
        workDate: '2015-11-30',
        stage: {
          stageNumber: 4,
          name: 'Coding'
        },
        project: {
          name: 'Project List',
          jiraTaskId: 'HT-124',
          sbvbTaskId: 'RFP14141',
          status: 'active'
        },
        milliseconds: 3637463
      }, {
        _id: '4212',
        timesheetRid: '42',
        workDate: '2015-11-30',
        stage: {
          stageNumber: 4,
          name: 'Coding'
        },
        project: {
          name: 'General Coding',
          sbvbTaskId: 'RFP14177',
          status: 'active'
        },
        milliseconds: 35412364
      }, {
        _id: '4221',
        timesheetRid: '42',
        workDate: '2015-12-01',
        stage: {
          stageNumber: 3,
          name: 'Design'
        },
        project: {
          name: 'Project Editor',
          jiraTaskId: 'HT-123',
          sbvbTaskId: 'RFP14141',
          status: 'active'
        },
        milliseconds: 67589732
      }, {
        _id: '4231',
        timesheetRid: '42',
        workDate: '2015-12-02',
        stage: {
          stageNumber: 4,
          name: 'Coding'
        },
        project: {
          name: 'Project Editor',
          jiraTaskId: 'HT-123',
          sbvbTaskId: 'RFP14141',
          status: 'active'
        },
        milliseconds: 1800000
      }, {
        _id: '4232',
        timesheetRid: '42',
        workDate: '2015-12-02',
        stage: {
          stageNumber: 6,
          name: 'Testing'
        },
        project: {
          name: 'Project Editor',
          jiraTaskId: 'HT-123',
          sbvbTaskId: 'RFP14141',
          status: 'active'
        },
        milliseconds: 3600000
      }, {
        _id: '4233',
        timesheetRid: '42',
        workDate: '2015-12-02',
        stage: {
          stageNumber: 0,
          name: 'Miscellaneous'
        },
        project: {
          name: 'Miscellaneous',
          status: 'active'
        },
        milliseconds: 900000
      }, {
        _id: '4234',
        timesheetRid: '42',
        workDate: '2015-12-02',
        stage: {
          stageNumber: 4,
          name: 'Coding'
        },
        project: {
          name: 'Project List',
          jiraTaskId: 'HT-124',
          sbvbTaskId: 'RFP14141',
          status: 'active'
        },
        milliseconds: 7200000
      }, {
        _id: '4241',
        timesheetRid: '42',
        workDate: '2015-12-03',
        stage: {
          stageNumber: 4,
          name: 'Coding'
        },
        project: {
          name: 'Brand New Stuff',
          jiraTaskId: 'ZNS-123',
          status: 'active'
        },
        milliseconds: 1800000
      }, {
        _id: '4242',
        timesheetRid: '42',
        workDate: '2015-12-03',
        stage: {
          stageNumber: 2,
          name: 'Requirements'
        },
        project: {
          name: 'Really Old Stuff',
          sbvbTaskId: 'XYZ14167',
          status: 'active'
        },
        milliseconds: 90000000
      }, {
        _id: '4251',
        timesheetRid: '42',
        workDate: '2015-12-04',
        stage: {
          stageNumber: 4,
          name: 'Coding'
        },
        project: {
          name: 'Really really Old Stuff',
          sbvbTaskId: 'RFP14168',
          status: 'active'
        },
        milliseconds: 3600000
      }, {
        _id: '4252',
        timesheetRid: '42',
        workDate: '2015-12-04',
        stage: {
          stageNumber: 3,
          name: 'Design'
        },
        project: {
          name: 'Really really Old Stuff',
          sbvbTaskId: 'RFP14168',
          status: 'active'
        },
        milliseconds: 7200000
      }];
    }
  });
}());
