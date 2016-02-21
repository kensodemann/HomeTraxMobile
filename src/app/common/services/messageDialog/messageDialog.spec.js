/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.services.messageDialog', function() {
    var messageDialog;
    var mockLog;

    beforeEach(module('homeTrax.common.services.messageDialog'));

    beforeEach(function() {
      mockLog = sinon.stub({
        error: function() {
        }
      });
    });

    beforeEach(function() {
      module(function($provide) {
        $provide.value('$log', mockLog);
      });
    });

    beforeEach(inject(function(_messageDialog_) {
      messageDialog = _messageDialog_;
    }));

    it('exists', function() {
      expect(messageDialog).to.exist;
    });

    describe('error', function() {
      it('just logs the error for now', function() {
        messageDialog.error('Title', 'Message');
        expect(mockLog.error.calledOnce).to.be.true;
        expect(mockLog.error.calledWith('Message')).to.be.true;
      });
    });
  });
}());
