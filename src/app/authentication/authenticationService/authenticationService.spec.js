/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.authentication.authenticationService', function() {
    var mockAuthenticationToken;
    var mockHttp;
    var mockIdentity;
    var mockUser;

    var config;
    var dfd;
    var authenticationService;
    var scope;

    beforeEach(module('homeTrax.authentication.authenticationService'));

    beforeEach(function() {
      mockAuthenticationToken = sinon.stub({
        clear: function() {},

        set: function() {}
      });

      mockHttp = sinon.stub({
        post: function() {
        }
      });

      mockIdentity = sinon.stub({
        set:function(){},

        clear:function(){
        },

        isAuthenticated: function() {
        },

        isAuthorized: function() {
        }
      });

      mockUser = sinon.stub().returns({});

      module(function($provide) {
        $provide.value('$http', mockHttp);
        $provide.value('identity', mockIdentity);
        $provide.value('User', mockUser);
        $provide.value('authenticationToken', mockAuthenticationToken);
      });
    });

    beforeEach(inject(function($rootScope, $q,_config_, _authenticationService_) {
      scope = $rootScope;
      dfd = $q.defer();
      mockHttp.post.returns(dfd.promise);
      config = _config_;
      authenticationService = _authenticationService_;
    }));

    describe('authenticateUser', function() {
      it('Returns a promise', function() {
        var p = authenticationService.authenticateUser('jimmy', 'CrackCornz');
        expect(p.then).to.be.a('function');
      });

      it('Calls post, passing username and password', function() {
        authenticationService.authenticateUser('jimmy', 'CrakzKorn');
        expect(mockHttp.post.calledWith(config.dataService + '/login', {
          username: 'jimmy',
          password: 'CrakzKorn'
        })).to.be.true;
      });

      it('Resolves True and sets the identity if login succeeds', function(done) {
        authenticationService.authenticateUser('jimmy', 'CrakzKorn').then(function(result) {
          expect(result).to.be.true;
          expect(mockIdentity.set.calledOnce).to.be.true;
          expect(mockIdentity.set.calledWith({
            firstName: 'James',
            lastName: 'Jones'
          })).to.be.true;
          done();
        });

        dfd.resolve({
          data: {
            success: true,
            user: {
              firstName: 'James',
              lastName: 'Jones'
            },
            token: 'IAmToken'
          }
        });
        scope.$apply();
      });

      it('saves the login token on success', function() {
        authenticationService.authenticateUser('jimmy', 'CrakzKorn');
        dfd.resolve({
          data: {
            success: true,
            user: {
              firstName: 'James',
              lastName: 'Jones'
            },
            token: 'IAmToken'
          }
        });
        scope.$apply();
        expect(mockAuthenticationToken.set.calledOnce).to.be.true;
        expect(mockAuthenticationToken.set.calledWith('IAmToken')).to.be.true;
      });

      it('Resolves False and does not set the identity if login fails', function(done) {
        authenticationService.authenticateUser('jimmy', 'CrakzKorn').then(function(result) {
          expect(result).to.be.false;
          expect(mockIdentity.set.called).to.be.false;
          done();
        });

        dfd.resolve({
          data: {
            success: false,
            user: {
              firstName: 'James',
              lastName: 'Jones'
            }
          }
        });
        scope.$apply();
      });

      it('clears any existing login token if the login fails', function() {
        authenticationService.authenticateUser('jimmy', 'CrakzKorn');
        dfd.resolve({
          data: {
            success: false,
            user: {
              firstName: 'James',
              lastName: 'Jones'
            }
          }
        });
        scope.$apply();
        expect(mockAuthenticationToken.clear.calledOnce).to.be.true;
      });
    });

    describe('logoutUser', function() {
      it('clears the auth token', function() {
        authenticationService.logoutUser();
        expect(mockAuthenticationToken.clear.calledOnce).to.be.true;
      });

      it('Returns a promise', function() {
        var p = authenticationService.logoutUser();
        expect(p.then).to.be.a('function');
      });

      it('posts to the logout endpoint', function() {
        authenticationService.logoutUser();
        expect(mockHttp.post.calledWith(config.dataService + '/logout', {
          logout: true
        })).to.be.true;
      });

      it('Clears the current user when logout complete', function(done) {
        authenticationService.logoutUser().then(function() {
          expect(mockIdentity.clear.calledOnce).to.be.true;
          done();
        });

        dfd.resolve();
        scope.$apply();
      });
    });
  });
}());
