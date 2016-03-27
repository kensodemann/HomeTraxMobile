/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.services.stages', function() {
    var mockStage;
    var stages;
    var testData;

    beforeEach(module('homeTrax.common.services.stages'));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(function() {
      mockStage = sinon.stub({
        query: function() {}
      });
      mockStage.query.returns(testData);
    });

    beforeEach(function() {
      module(function($provide) {
        $provide.value('Stage', mockStage);
      });
    });

    beforeEach(inject(function(_stages_) {
      stages = _stages_;
    }));

    it('exists', function() {
      expect(stages).to.exist;
    });

    describe('all', function() {
      it('queries the stages', function() {
        stages.all;
        expect(mockStage.query.calledOnce).to.be.true;
      });

      it('returns the stages array that is queried', function() {
        var allStages = stages.all;
        expect(allStages).to.equal(testData);
      });

      it('caches the queried stages', function() {
        var allStages = stages.all;
        allStages = stages.all;
        expect(mockStage.query.calledOnce).to.be.true;
      });
    });

    describe('load', function() {
      it('queries the stages each time it is called', function() {
        stages.load();
        expect(mockStage.query.calledOnce).to.be.true;
        stages.load();
        expect(mockStage.query.calledTwice).to.be.true;
        stages.load();
        expect(mockStage.query.calledThrice).to.be.true;
      });
    });

    function initializeTestData() {
      testData = [{
        stageNumber: 1,
        name: 'Requirements Definition'
      }, {
        stageNumber: 2,
        name: 'Functional Specification'
      }, {
        stageNumber: 3,
        name: 'Detailed Design'
      }, {
        stageNumber: 4,
        name: 'Coding'
      }];
    }
  });
}());
