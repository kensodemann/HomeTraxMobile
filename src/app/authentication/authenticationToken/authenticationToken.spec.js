/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.authentication.authenticationToken', function() {
    var mockLocalStorageService;
    var authenticationToken;

    beforeEach(module('homeTrax.authentication.authenticationToken'));

    beforeEach(function() {
      mockLocalStorageService = sinon.stub({
        get: function() {
        },

        set: function() {
        },

        remove: function() {
        }
      });

      module(function($provide) {
        $provide.value('localStorageService', mockLocalStorageService);
      });
    });

    beforeEach(inject(function(_authenticationToken_) {
      authenticationToken = _authenticationToken_;
    }));

    it('exists', function() {
      expect(authenticationToken).to.exist;
    });

    describe('setting the token', function() {
      it('sets the token in local storage', function() {
        authenticationToken.set('IAmToken');
        expect(mockLocalStorageService.set.calledOnce).to.be.true;
        expect(mockLocalStorageService.set.calledWith('authenticationToken', 'IAmToken')).to.be.true;
      });
    });

    describe('getting the token', function() {
      it('gets the token from local storage if it is not cached', function() {
        mockLocalStorageService.get.withArgs('authenticationToken').returns('CheeseFilledButterFinger');
        expect(authenticationToken.get()).to.equal('CheeseFilledButterFinger');
        expect(mockLocalStorageService.get.calledOnce).to.be.true;
        expect(mockLocalStorageService.get.calledWith('authenticationToken')).to.be.true;
      });

      it('caches the value so it does not need to access local storage for subsequent calls', function() {
        mockLocalStorageService.get.withArgs('authenticationToken').returns('CheeseFilledButterFinger');
        expect(authenticationToken.get()).to.equal('CheeseFilledButterFinger');
        mockLocalStorageService.get.withArgs('authenticationToken').returns('IAmDifferent');
        expect(authenticationToken.get()).to.equal('CheeseFilledButterFinger');
        expect(mockLocalStorageService.get.calledOnce).to.be.true;
        expect(mockLocalStorageService.get.calledWith('authenticationToken')).to.be.true;
      });

      it('returns the cached value if the value has been set in the current instance', function() {
        mockLocalStorageService.get.withArgs('authenticationToken').returns('CheeseFilledButterFinger');
        authenticationToken.set('IAmYetAnotherToken');
        expect(authenticationToken.get()).to.equal('IAmYetAnotherToken');
        expect(mockLocalStorageService.get.called).to.be.false;
      });
    });

    describe('clearing the token', function() {
      it('removes the token from local storage', function() {
        authenticationToken.clear();
        expect(mockLocalStorageService.remove.calledOnce).to.be.true;
        expect(mockLocalStorageService.remove.calledWith('authenticationToken')).to.be.true;
      });

      it('clears the cache of the previously set token', function() {
        authenticationToken.set('I Am Token');
        authenticationToken.clear();
        var token = authenticationToken.get();
        expect(token).to.not.exist;
      });
    });
  });
}());
