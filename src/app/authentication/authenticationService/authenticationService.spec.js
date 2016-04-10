/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.authentication.authenticationService', function() {
    var $httpBackend;
    var identity;

    var config;
    var authenticationService;
    var authenticationToken;
    var scope;

    beforeEach(module('homeTrax.authentication.authenticationService'));

    beforeEach(inject(function($rootScope, _$httpBackend_, _config_, _authenticationService_, _authenticationToken_, _identity_) {
      scope = $rootScope;
      config = _config_;
      $httpBackend = _$httpBackend_;
      authenticationService = _authenticationService_;
      authenticationToken = _authenticationToken_;
      identity = _identity_;
    }));

    beforeEach(function() {
      sinon.stub(authenticationToken, 'clear');
      sinon.stub(authenticationToken, 'set');
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    afterEach(function() {
      authenticationToken.clear.restore();
      authenticationToken.set.restore();
    });

    describe('authenticateUser', function() {
      beforeEach(function() {
        sinon.stub(identity, 'set');
      });

      afterEach(function() {
        identity.set.restore();
      });

      it('POSTs username and password to login endpoint', function() {
        $httpBackend.expectPOST(config.dataService + '/login', {
          username: 'jimmy',
          password: 'CrakzKorn'
        }).respond({});
        authenticationService.authenticateUser('jimmy', 'CrakzKorn');
        $httpBackend.flush();
      });

      it('Returns a promise', function() {
        $httpBackend.expectPOST(config.dataService + '/login', {
          username: 'jimmy',
          password: 'CrackCornz'
        }).respond({});
        var p = authenticationService.authenticateUser('jimmy', 'CrackCornz');
        expect(p.then).to.be.a('function');
        $httpBackend.flush();
      });

      it('Resolves True and sets the identity if login succeeds', function() {
        $httpBackend.expectPOST(config.dataService + '/login', {
          username: 'jimmy',
          password: 'CrakzKorn'
        }).respond({
          success: true,
          user: {
            firstName: 'James',
            lastName: 'Jones'
          },
          token: 'IAmToken'
        });

        var success = false;
        authenticationService.authenticateUser('jimmy', 'CrakzKorn').then(function(result) {
          success = result;
        });

        $httpBackend.flush();
        expect(success).to.be.true;
        expect(identity.set.calledOnce).to.be.true;
        expect(identity.set.calledWith({
          firstName: 'James',
          lastName: 'Jones'
        })).to.be.true;
      });

      it('saves the login token on success', function() {
        $httpBackend.expectPOST(config.dataService + '/login', {
          username: 'jimmy',
          password: 'CrakzKorn'
        }).respond({
          success: true,
          user: {
            firstName: 'James',
            lastName: 'Jones'
          },
          token: 'IAmToken'
        });

        authenticationService.authenticateUser('jimmy', 'CrakzKorn');
        $httpBackend.flush();
        expect(authenticationToken.set.calledOnce).to.be.true;
        expect(authenticationToken.set.calledWith('IAmToken')).to.be.true;
      });

      it('Resolves False and does not set the identity if login fails', function() {
        $httpBackend.expectPOST(config.dataService + '/login', {
          username: 'jimmy',
          password: 'CrakzKorn'
        }).respond({
          success: false
        });

        var success = true;
        authenticationService.authenticateUser('jimmy', 'CrakzKorn').then(function(result) {
          success = result;
        });

        $httpBackend.flush();
        expect(success).to.be.false;
        expect(identity.set.called).to.be.false;
      });

      it('clears any existing login token if the login fails', function() {
        $httpBackend.expectPOST(config.dataService + '/login', {
          username: 'jimmy',
          password: 'CrakzKorn'
        }).respond({
          success: false
        });
        authenticationService.authenticateUser('jimmy', 'CrakzKorn');
        $httpBackend.flush();
        expect(authenticationToken.clear.calledOnce).to.be.true;
      });
    });

    describe('logoutUser', function() {
      beforeEach(function() {
        sinon.stub(identity, 'clear');
        $httpBackend.expectPOST(config.dataService + '/logout').respond();
      });

      afterEach(function() {
        identity.clear.restore();
      });

      it('posts to the logout endpoint', function() {
        authenticationService.logoutUser();
        $httpBackend.flush();
      });

      it('Returns a promise', function() {
        var p = authenticationService.logoutUser();
        expect(p.then).to.be.a('function');
        $httpBackend.flush();
      });

      it('clears the auth token', function() {
        authenticationService.logoutUser();
        $httpBackend.flush();
        expect(authenticationToken.clear.calledOnce).to.be.true;
      });

      it('Clears the current user', function() {
        authenticationService.logoutUser();
        $httpBackend.flush();
        expect(identity.clear.calledOnce).to.be.true;
      });
    });

    describe('refreshing', function() {
      it('refreshes the token', function() {
        $httpBackend.expectGET(config.dataService + '/freshLoginToken').respond({
          success: true,
          token: 'IAmNewToken'
        });
        authenticationService.refreshLogin();
        $httpBackend.flush();
        expect(authenticationToken.set.calledOnce).to.be.true;
        expect(authenticationToken.set.calledWith('IAmNewToken')).to.be.true;
      });
    });
  });
}());
