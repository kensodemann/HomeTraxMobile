/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.services.messageDialog', function() {
    var messageDialog;
    var mockIonicPopup;
    var showDfd;

    beforeEach(module('homeTrax.common.services.messageDialog'));

    beforeEach(function() {
      mockIonicPopup = sinon.stub({
        show: function() {
        }
      });
    });

    beforeEach(function() {
      module(function($provide) {
        $provide.value('$ionicPopup', mockIonicPopup);
      });
    });

    beforeEach(inject(function($q, _messageDialog_) {
      messageDialog = _messageDialog_;
      showDfd = $q.defer();
      mockIonicPopup.show.returns(showDfd.promise);
    }));

    it('exists', function() {
      expect(messageDialog).to.exist;
    });

    describe('error', function() {
      it('shows a popup', function() {
        messageDialog.error('I am Title', 'This is some information');
        expect(mockIonicPopup.show.calledOnce).to.be.true;
      });

      it('Passes the title', function() {
        messageDialog.error('I am Title', 'This is some information');
        var config = mockIonicPopup.show.firstCall.args[0];
        expect(config.title).to.equal('I am Title');
      });

      it('Passes the message on the scope', function() {
        messageDialog.error('I am Title', 'This is some information');
        var config = mockIonicPopup.show.firstCall.args[0];
        expect(config.scope.message).to.equal('This is some information');
      });
    });

    describe('ask', function() {
      it('shows a popup', function() {
        messageDialog.ask('I am Title', 'This is some information');
        expect(mockIonicPopup.show.calledOnce).to.be.true;
      });

      it('sets the title', function() {
        messageDialog.ask('I am Title', 'This is some information');
        var config = mockIonicPopup.show.firstCall.args[0];
        expect(config.title).to.equal('I am Title');
      });

      it('passes the message on the scope', function() {
        messageDialog.ask('I am Title', 'This is some information');
        var config = mockIonicPopup.show.firstCall.args[0];
        expect(config.scope.message).to.equal('This is some information');
      });
    });
  });
}());
