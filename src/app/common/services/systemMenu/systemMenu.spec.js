/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.services.systemMenu', function() {
    var mockIonicHistory;
    var systemMenu;

    beforeEach(module('homeTrax.common.services.systemMenu'));

    beforeEach(function() {
      mockIonicHistory = sinon.stub({
        nextViewOptions: function() {
        }
      });
    });

    beforeEach(function() {
      module(function($provide) {
        $provide.value('$ionicHistory', mockIonicHistory);
      });
    });

    beforeEach(inject(function(_systemMenu_) {
      systemMenu = _systemMenu_;
    }));

    it('exists', function() {
      expect(systemMenu).to.exist;
    });
  });
}());
