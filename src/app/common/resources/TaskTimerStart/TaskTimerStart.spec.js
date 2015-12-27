/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.resources.TaskTimerStart', function() {
    var config;
    var httpBackend;
    var scope;
    var TaskTimerStart;

    beforeEach(module('homeTrax.common.resources.TaskTimerStart'));

    beforeEach(inject(function($rootScope, $httpBackend, _TaskTimerStart_, _config_) {
      scope = $rootScope;
      httpBackend = $httpBackend;
      TaskTimerStart = _TaskTimerStart_;
      config = _config_;
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('exists', function() {
      expect(TaskTimerStart).to.exist;
    });

    describe('POST', function() {
      it('posts properly', function() {
        httpBackend.expectPOST(config.dataService + '/timesheets/73/taskTimers/42/start')
          .respond({});
        TaskTimerStart.save({
          _id: 42,
          timesheetRid: 73
        });
        httpBackend.flush();
      });
    });
  });
}());
