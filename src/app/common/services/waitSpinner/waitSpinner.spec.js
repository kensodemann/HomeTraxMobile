/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.services.waitSpinner', function() {
    var mockIonicLoading;
    var waitSpinner;
    var scope;

    beforeEach(module('homeTrax.common.services.waitSpinner'));

    beforeEach(function() {
      mockIonicLoading = sinon.stub({
        show: function() {
        },

        hide: function() {
        }
      });

      module(function($provide) {
        $provide.value('$ionicLoading', mockIonicLoading);
      });
    });

    beforeEach(inject(function($rootScope, _waitSpinner_) {
      scope = $rootScope;
      waitSpinner = _waitSpinner_;
    }));

    it('exists', function() {
      expect(waitSpinner).to.exist;
    });

    describe('show', function() {
      it('shows the spinner', function() {
        waitSpinner.show();
        expect(mockIonicLoading.show.calledOnce).to.be.true;
      });

      it('uses the passed options for the show', function() {
        waitSpinner.show({
          noBackdrop: true,
          hideOnStateChange: true,
          template: '<ion-spinner></ion-spinner>'
        });
        expect(mockIonicLoading.show.calledWith({
          noBackdrop: true,
          hideOnStateChange: true,
          template: '<ion-spinner></ion-spinner>'
        })).to.be.true;
      });

      it('uses default options they are not supplied', function() {
        waitSpinner.show();
        expect(mockIonicLoading.show.calledWith({template: '<ion-spinner></ion-spinner>'})).to.be.true;
      });
    });

    describe('hide', function() {
      it('hides the spinner', function() {
        waitSpinner.hide();
        expect(mockIonicLoading.hide.calledOnce).to.be.true;
      });
    });
  });
}());
