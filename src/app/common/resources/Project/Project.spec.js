/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.resources.Project', function() {
    var $httpBackend;
    var config;
    var Project;
    var testData;

    beforeEach(module('homeTrax.common.resources.Project'));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(inject(function(_$httpBackend_, _Project_, _config_) {
      $httpBackend = _$httpBackend_;
      Project = _Project_;
      config = _config_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('Should exist', function() {
      expect(Project).to.exist;
    });

    describe('query', function() {
      var res;
      beforeEach(function() {
        $httpBackend.expectGET(config.dataService + '/projects')
          .respond(testData);
        res = Project.query({});
        $httpBackend.flush();
      });

      it('gets the data', function() {
        expect(res.length).to.equal(3);
        expect(res[0].testTag).to.equal(42);
        expect(res[1].testTag).to.equal(73);
        expect(res[2].testTag).to.equal(314159);
      });
    });

    function initializeTestData() {
      testData = [{
        _id: 1,
        name: 'Fred',
        testTag: 42
      }, {
        _id: 2,
        name: 'Bob',
        testTag: 73
      }, {
        _id: 3,
        name: 'Jack',
        testTag: 314159
      }];
    }
  });
}());
