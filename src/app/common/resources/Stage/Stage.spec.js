/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.resources.Stage', function() {
    var httpBackend;
    var stage;
    var scope;
    var testData;

    var config;

    beforeEach(module('homeTrax.common.resources.Stage'));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(inject(function($rootScope, $httpBackend, _Stage_, _config_) {
      scope = $rootScope;
      httpBackend = $httpBackend;
      stage = _Stage_;
      config = _config_;
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    it('Should exist', function() {
      expect(stage).to.exist;
    });

    describe('query', function() {
      var res;
      beforeEach(function() {
        httpBackend.expectGET(config.dataService + '/stages')
          .respond(testData);
        res = stage.query({});
        httpBackend.flush();
      });

      it('gets the data', function() {
        expect(res.length).to.equal(3);
        expect(res[0].stageNumber).to.equal(1);
        expect(res[1].stageNumber).to.equal(2);
        expect(res[2].stageNumber).to.equal(4);
      });
    });

    function initializeTestData() {
      testData = [{
        _id: 42,
        name: 'Requirements',
        stageNumber: 1
      }, {
        _id: 73,
        name: 'Design',
        stageNumber: 2
      }, {
        _id: 314159,
        name: 'Develop',
        stageNumber: 4
      }];
    }
  });
}());
