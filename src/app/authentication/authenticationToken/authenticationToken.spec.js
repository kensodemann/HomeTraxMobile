/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.authentication.authenticationToken', function() {
    var authenticationToken;

    var config;
    var localStorageService;

    beforeEach(module('homeTrax.authentication.authenticationToken'));

    beforeEach(inject(function(_authenticationToken_, _localStorageService_, _config_) {
      authenticationToken = _authenticationToken_;
      localStorageService = _localStorageService_;
      config = _config_;
    }));

    beforeEach(function() {
      sinon.stub(localStorageService, 'set');
    });

    afterEach(function() {
      localStorageService.set.restore();
    });

    it('exists', function() {
      expect(authenticationToken).to.exist;
    });

    describe('setting the token', function() {
      it('sets the token in local storage', function() {
        authenticationToken.set('IAmToken');
        expect(localStorageService.set.calledOnce).to.be.true;
        expect(localStorageService.set.calledWith('authenticationToken', 'IAmToken')).to.be.true;
      });
    });

    describe('getting the token', function() {
      beforeEach(function() {
        sinon.stub(localStorageService, 'get');
      });

      afterEach(function() {
        localStorageService.get.restore();
      });

      it('gets the token from local storage if it is not cached', function() {
        localStorageService.get.withArgs('authenticationToken').returns('CheeseFilledButterFinger');
        expect(authenticationToken.get()).to.equal('CheeseFilledButterFinger');
        expect(localStorageService.get.calledOnce).to.be.true;
        expect(localStorageService.get.calledWith('authenticationToken')).to.be.true;
      });

      it('caches the value so it does not need to access local storage for subsequent calls', function() {
        localStorageService.get.withArgs('authenticationToken').returns('CheeseFilledButterFinger');
        expect(authenticationToken.get()).to.equal('CheeseFilledButterFinger');
        localStorageService.get.withArgs('authenticationToken').returns('IAmDifferent');
        expect(authenticationToken.get()).to.equal('CheeseFilledButterFinger');
        expect(localStorageService.get.calledOnce).to.be.true;
        expect(localStorageService.get.calledWith('authenticationToken')).to.be.true;
      });

      it('returns the cached value if the value has been set in the current instance', function() {
        localStorageService.get.withArgs('authenticationToken').returns('CheeseFilledButterFinger');
        authenticationToken.set('IAmYetAnotherToken');
        expect(authenticationToken.get()).to.equal('IAmYetAnotherToken');
        expect(localStorageService.get.called).to.be.false;
      });
    });

    describe('clearing the token', function() {
      beforeEach(function() {
        sinon.stub(localStorageService, 'remove');
      });

      afterEach(function() {
        localStorageService.remove.restore();
      });

      it('removes the token from local storage', function() {
        authenticationToken.clear();
        expect(localStorageService.remove.calledOnce).to.be.true;
        expect(localStorageService.remove.calledWith('authenticationToken')).to.be.true;
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
