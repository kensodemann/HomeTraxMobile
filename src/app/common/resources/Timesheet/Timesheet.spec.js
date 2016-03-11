/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.resources.Timesheet', function() {
    var config;
    var httpBackend;
    var scope;
    var testData;
    var Timesheet;

    beforeEach(module('homeTrax.common.resources.Timesheet'));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(inject(function($rootScope, $httpBackend, _Timesheet_, _config_) {
      scope = $rootScope;
      httpBackend = $httpBackend;
      Timesheet = _Timesheet_;
      config = _config_;
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('exists', function() {
      expect(Timesheet).to.exist;
    });

    describe('query', function() {
      var res;
      beforeEach(function() {
        httpBackend.expectGET(config.dataService + '/timesheets')
          .respond(testData);
        res = Timesheet.query({});
        httpBackend.flush();
      });

      it('gets the data', function() {
        expect(res.length).to.equal(6);
        expect(res[0]._id).to.equal(1);
        expect(res[2]._id).to.equal(3);
        expect(res[4]._id).to.equal(4);
      });
    });

    describe('get', function() {
      var res;
      beforeEach(function() {
        httpBackend.expectGET(config.dataService + '/timesheets/2')
          .respond(testData[1]);
        res = Timesheet.get({
          id: 2
        });
        httpBackend.flush();
      });

      it('gets the data', function() {
        expect(res.endDate).to.equal('2015-10-08');
      });
    });

    describe('POST', function() {
      it('saves new data properly', function() {
        httpBackend.expectPOST(config.dataService + '/timesheets')
          .respond({});
        Timesheet.save({
          endDate: '2015-12-25'
        });
        httpBackend.flush();
      });

      it('saves existing data properly', function() {
        httpBackend.expectPOST(config.dataService + '/timesheets/2')
          .respond({});
        Timesheet.save(testData[1]);
        httpBackend.flush();
      });
    });

    function initializeTestData() {
      testData = [{
        _id: 1,
        endDate: '2015-10-01'
      }, {
        _id: 2,
        endDate: '2015-10-08'
      }, {
        _id: 3,
        endDate: '2015-10-15'
      }, {
        _id: 6,
        endDate: '2015-09-05'
      }, {
        _id: 4,
        endDate: '2015-09-12'
      }, {
        _id: 5,
        endDate: '2015-10-31'
      }];
    }
  });
}());
