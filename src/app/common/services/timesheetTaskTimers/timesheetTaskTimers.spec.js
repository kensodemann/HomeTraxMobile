/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.services.timesheetTaskTimers: timesheetTaskTimers', function() {
    var mockFoo;
    var timesheetTaskTimers;

    var testTimesheet;
    var testTaskTimers;

    var clock;
    var config;
    var $httpBackend;
    var scope;

    beforeEach(module('homeTrax.common.services.timesheetTaskTimers'));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(function() {
      mockFoo = sinon.stub({
        bar: function() {
        }
      });

      module(function($provide) {
        $provide.value('foo', mockFoo);
      });
    });

    beforeEach(inject(function($rootScope, _$httpBackend_, _timesheetTaskTimers_, _config_) {
      $httpBackend = _$httpBackend_;
      scope = $rootScope;
      timesheetTaskTimers = _timesheetTaskTimers_;
      config = _config_;
    }));

    beforeEach(function() {
      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    afterEach(function() {
      clock.restore();
    });

    it('exists', function() {
      expect(timesheetTaskTimers).to.exist;
    });

    describe('load', function() {
      beforeEach(function() {
        $httpBackend.expectGET(config.dataService + '/timesheets/4273314159/taskTimers')
          .respond(testTaskTimers);
      });

      it('loads the data for the specified timesheet', function() {
        timesheetTaskTimers.load(testTimesheet);
        $httpBackend.flush();
      });

      it('sets all to the results of the load', function(done) {
        timesheetTaskTimers.load(testTimesheet).then(function() {
          expect(timesheetTaskTimers.all.length).to.equal(7);
          done();
        });

        $httpBackend.flush();
      });
    });

    describe('get task timers', function() {
      beforeEach(function() {
        $httpBackend.expectGET(config.dataService + '/timesheets/4273314159/taskTimers')
          .respond(testTaskTimers);
        timesheetTaskTimers.load(testTimesheet);
        $httpBackend.flush();
      });

      it('returns task timers for the day specified', function() {
        var tt = timesheetTaskTimers.get('2015-10-13');
        expect(tt.length).to.equal(3);
        expect(tt[0]._id).to.equal(12342);
        expect(tt[1]._id).to.equal(12344);
        expect(tt[2]._id).to.equal(12346);
      });
    });

    describe('get total time', function() {
      beforeEach(function() {
        testTaskTimers[1].isActive = true;
        testTaskTimers[1].startTime = 1000;
        clock.tick(3000);
        $httpBackend.expectGET(config.dataService + '/timesheets/4273314159/taskTimers')
          .respond(testTaskTimers);
        timesheetTaskTimers.load(testTimesheet);
        $httpBackend.flush();
      });

      it('gets the total time for the specified day using elapsed time', function() {
        expect(timesheetTaskTimers.totalTime('2015-10-13')).to.equal(1236000 + 948000 + 672000);
      });

      it('calculates zero if there are no timers for the specified date', function() {
        expect(timesheetTaskTimers.totalTime('2013-01-01')).to.equal(0);
      });

      it('gets the total time for the whole timesheet if no day is specified', function() {
        expect(timesheetTaskTimers.totalTime()).to.equal(
          3884000 + 1236000 + 4885000 + 948000 + 3746000 + 672000 + 123000);
      });
    });

    describe('create new task timer', function() {
      beforeEach(function() {
        $httpBackend.expectGET(config.dataService + '/timesheets/4273314159/taskTimers')
          .respond(testTaskTimers);
        timesheetTaskTimers.load(testTimesheet);
        $httpBackend.flush();
      });

      it('references the current timesheet', function() {
        var tt = timesheetTaskTimers.create('2015-10-16');
        expect(tt.timesheetRid).to.equal(testTimesheet._id);
      });

      it('is for the specified work date', function() {
        var tt = timesheetTaskTimers.create('2015-10-16');
        expect(tt.workDate).to.equal('2015-10-16');
      });
    });

    describe('adding a task timer', function() {
      beforeEach(function() {
        $httpBackend.expectGET(config.dataService + '/timesheets/4273314159/taskTimers')
          .respond(testTaskTimers);
        timesheetTaskTimers.load(testTimesheet);
        $httpBackend.flush();
      });

      it('adds the specified task timer to the end of the list', function() {
        timesheetTaskTimers.add({
          _id: 320,
          workDate: '2015-10-16'
        });
        expect(timesheetTaskTimers.all.length).to.equal(8);
        expect(timesheetTaskTimers.all[7]).to.deep.equal({
          _id: 320,
          workDate: '2015-10-16'
        });
      });
    });

    describe('deleting a tak timer', function() {
      beforeEach(function() {
        $httpBackend.expectGET(config.dataService + '/timesheets/4273314159/taskTimers')
          .respond(testTaskTimers);
        timesheetTaskTimers.load(testTimesheet);
        $httpBackend.flush();
      });

      it('deletes the task timer', function() {
        $httpBackend.expectDELETE(config.dataService + '/timesheets/4273314159/taskTimers/12344').respond();
        timesheetTaskTimers.delete(timesheetTaskTimers.all[3]);
        $httpBackend.flush();
      });

      it('returns the promise of the delete', function() {
        $httpBackend.expectDELETE(config.dataService + '/timesheets/4273314159/taskTimers/12344').respond(400, {
          reason: 'I just do not like you much'
        });
        var result = 0;
        timesheetTaskTimers.delete(timesheetTaskTimers.all[3]).catch(function(res) {
          result = res;
        });

        $httpBackend.flush();
        expect(result.status).to.equal(400);

        $httpBackend.expectDELETE(config.dataService + '/timesheets/4273314159/taskTimers/12344').respond();
        timesheetTaskTimers.delete(timesheetTaskTimers.all[3]).then(function() {
          result = 'Deleted';
        });

        $httpBackend.flush();
        expect(result).to.equal('Deleted');
      });

      it('removes the task timer from the list if the delete succeeds', function() {
        $httpBackend.expectDELETE(config.dataService + '/timesheets/4273314159/taskTimers/12344').respond();
        timesheetTaskTimers.delete(timesheetTaskTimers.all[3]);
        $httpBackend.flush();
        expect(timesheetTaskTimers.all.length).to.equal(6);
        expect(_.find(timesheetTaskTimers.all, function(item) {
          return item._id === 12344;
        })).to.be.undefined;
      });

      it('does not remove the task timer from the list if the delete fails', function() {
        $httpBackend.expectDELETE(config.dataService + '/timesheets/4273314159/taskTimers/12344').respond(400, {
          reason: 'I just do not like you much'
        });
        timesheetTaskTimers.delete(timesheetTaskTimers.all[3]);
        $httpBackend.flush();
        expect(angular.equals(timesheetTaskTimers.all, testTaskTimers)).to.be.true;
      });
    });

    describe('starting a task timer', function() {
      beforeEach(function() {
        $httpBackend.expectGET(config.dataService + '/timesheets/4273314159/taskTimers')
          .respond(testTaskTimers);
        timesheetTaskTimers.load(testTimesheet);
        $httpBackend.flush();
      });

      it('throws an error if the task timer is not in the current cache', function() {
        expect(function() {
          timesheetTaskTimers.start({
            _id: 12343,
            timesheetRid: 4273314159,
            workDate: '2015-10-14',
            milliseconds: 4885000
          });
        }).to.throw('Invalid Task Timer');
      });

      it('stops any timer in the cache that is currently running', function() {
        timesheetTaskTimers.all[2].isActive = true;
        timesheetTaskTimers.all[4].isActive = true;
        $httpBackend.expectPOST(config.dataService + '/timesheets/4273314159/taskTimers/12343/stop')
          .respond({
            _id: 12343,
            timesheetRid: 4273314159,
            workDate: '2015-10-14',
            isActive: false,
            milliseconds: 4887000
          });
        $httpBackend.expectPOST(config.dataService + '/timesheets/4273314159/taskTimers/12345/stop')
          .respond({
            _id: 12345,
            timesheetRid: 4273314159,
            workDate: '2015-10-12',
            isActive: false,
            milliseconds: 3746000
          });
        $httpBackend.expectPOST(config.dataService + '/timesheets/4273314159/taskTimers/12344/start')
          .respond();

        timesheetTaskTimers.start(timesheetTaskTimers.all[3]);
        $httpBackend.flush();

        expect(timesheetTaskTimers.all[2].isActive).to.be.false;
        expect(timesheetTaskTimers.all[4].isActive).to.be.false;
      });

      it('copies the new running time for any stopped timer', function() {
        timesheetTaskTimers.all[2].isActive = true;
        timesheetTaskTimers.all[4].isActive = true;
        $httpBackend.expectPOST(config.dataService + '/timesheets/4273314159/taskTimers/12343/stop')
          .respond({
            _id: 12343,
            timesheetRid: 4273314159,
            workDate: '2015-10-14',
            isActive: false,
            milliseconds: 4887000
          });
        $httpBackend.expectPOST(config.dataService + '/timesheets/4273314159/taskTimers/12345/stop')
          .respond({
            _id: 12345,
            timesheetRid: 4273314159,
            workDate: '2015-10-12',
            isActive: false,
            milliseconds: 3746000
          });
        $httpBackend.expectPOST(config.dataService + '/timesheets/4273314159/taskTimers/12344/start')
          .respond();

        timesheetTaskTimers.start(timesheetTaskTimers.all[3]);
        $httpBackend.flush();

        expect(timesheetTaskTimers.all[2].milliseconds).to.equal(4887000);
        expect(timesheetTaskTimers.all[4].milliseconds).to.equal(3746000);
      });

      it('starts the requested timer', function() {
        $httpBackend.expectPOST(config.dataService + '/timesheets/4273314159/taskTimers/12343/start')
          .respond({
            _id: 12343,
            workDate: '2015-10-14',
            milliseconds: 4885000,
            isActive: true
          });
        timesheetTaskTimers.start(timesheetTaskTimers.all[2]);
        $httpBackend.flush();

        expect(timesheetTaskTimers.all[2].isActive).to.be.true;
      });

      it('copies the start time', function() {
        $httpBackend.expectPOST(config.dataService + '/timesheets/4273314159/taskTimers/12343/start')
          .respond({
            _id: 12343,
            workDate: '2015-10-14',
            milliseconds: 4885000,
            startTime: 1448894563156,
            isActive: true
          });
        timesheetTaskTimers.start(timesheetTaskTimers.all[2]);
        $httpBackend.flush();

        expect(timesheetTaskTimers.all[2].startTime).to.equal(1448894563156);
      });
    });

    describe('stoping a task timer', function() {
      beforeEach(function() {
        $httpBackend.expectGET(config.dataService + '/timesheets/4273314159/taskTimers')
          .respond(testTaskTimers);
        timesheetTaskTimers.load(testTimesheet);
        $httpBackend.flush();
      });

      it('throws an error if the task timer is not in the current cache', function() {
        expect(function() {
          timesheetTaskTimers.start({
            _id: 12343,
            timesheetRid: 4273314159,
            workDate: '2015-10-14',
            milliseconds: 4885000
          });
        }).to.throw('Invalid Task Timer');
      });

      it('stops the requested timer', function() {
        timesheetTaskTimers.all[2].isActive = true;
        $httpBackend.expectPOST(config.dataService + '/timesheets/4273314159/taskTimers/12343/stop')
          .respond({
            _id: 12343,
            workDate: '2015-10-14',
            milliseconds: 4887000,
            isActive: false
          });
        timesheetTaskTimers.stop(timesheetTaskTimers.all[2]);
        $httpBackend.flush();

        expect(timesheetTaskTimers.all[2].isActive).to.be.false;
      });

      it('copies the new running time for any stopped timer', function() {
        timesheetTaskTimers.all[2].isActive = true;
        $httpBackend.expectPOST(config.dataService + '/timesheets/4273314159/taskTimers/12343/stop')
          .respond({
            _id: 12343,
            workDate: '2015-10-14',
            milliseconds: 4887000,
            isActive: false
          });
        timesheetTaskTimers.stop(timesheetTaskTimers.all[2]);
        $httpBackend.flush();

        expect(timesheetTaskTimers.all[2].milliseconds).to.equal(4887000);
      });
    });

    function initializeTestData() {
      testTimesheet = {
        _id: 4273314159,
        endDate: '2015-10-17'
      };

      testTaskTimers = [{
        _id: 12341,
        timesheetRid: 4273314159,
        workDate: '2015-10-12',
        milliseconds: 3884000
      }, {
        _id: 12342,
        timesheetRid: 4273314159,
        workDate: '2015-10-13',
        milliseconds: 1234000
      }, {
        _id: 12343,
        timesheetRid: 4273314159,
        workDate: '2015-10-14',
        milliseconds: 4885000
      }, {
        _id: 12344,
        timesheetRid: 4273314159,
        workDate: '2015-10-13',
        milliseconds: 948000
      }, {
        _id: 12345,
        timesheetRid: 4273314159,
        workDate: '2015-10-12',
        milliseconds: 3746000
      }, {
        _id: 12346,
        timesheetRid: 4273314159,
        workDate: '2015-10-13',
        milliseconds: 672000
      }, {
        _id: 12347,
        timesheetRid: 4273314159,
        workDate: '2015-10-15',
        milliseconds: 123000
      }];
    }
  });
}());
