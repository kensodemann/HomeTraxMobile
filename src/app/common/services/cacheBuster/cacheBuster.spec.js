/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.services.cacheBuster', function() {
    var clock;

    var cacheBuster;

    beforeEach(module('homeTrax.common.services.cacheBuster'));

    beforeEach(function() {
      clock = sinon.useFakeTimers();
    });

    afterEach(function() {
      clock.restore();
    });

    beforeEach(inject(function(_cacheBuster_) {
      cacheBuster = _cacheBuster_;
    }));

    it('returns the current time in milliseconds', function() {
      clock.tick(423995);
      expect(cacheBuster.value).to.equal(423995);
      clock.tick(399405);
      expect(cacheBuster.value).to.equal(423995 + 399405);
    });
  });
}());
