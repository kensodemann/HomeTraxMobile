/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.resources.TaskTimerStop', function() {
    var config;
    var httpBackend;
    var scope;
    var TaskTimerStop;

    beforeEach(module('homeTrax.common.resources.TaskTimerStop'));

    beforeEach(inject(function($rootScope, $httpBackend, _TaskTimerStop_, _config_) {
      config = _config_;
      scope = $rootScope;
      httpBackend = $httpBackend;
      TaskTimerStop = _TaskTimerStop_;
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('Should exist', function() {
      expect(TaskTimerStop).to.exist;
    });

    describe('POST', function() {
      it('posts properly', function() {
        httpBackend.expectPOST(config.dataService + '/timesheets/73/taskTimers/42/stop')
          .respond({});
        TaskTimerStop.save({
          _id: 42,
          timesheetRid: 73
        });
        httpBackend.flush();
      });
    });
  });
}());
