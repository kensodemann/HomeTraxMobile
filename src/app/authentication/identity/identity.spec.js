/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.authentication.identity', function() {
    var config;
    var identity;
    var httpBackend;
    var mockAuthenticationToken;
    var mockCacheBuster;
    var $rootScope;

    beforeEach(module('homeTrax.authentication.identity'));

    beforeEach(function() {
      mockCacheBuster = {
        value: 'SomeBusterOfCache'
      };
    });

    beforeEach(function() {
      mockAuthenticationToken = sinon.stub({
        get: function() {}
      });
    });

    beforeEach(function() {
      module(function($provide) {
        $provide.value('authenticationToken', mockAuthenticationToken);
        $provide.value('cacheBuster', mockCacheBuster);
      });
    });

    beforeEach(inject(function($httpBackend, _$rootScope_, _config_, _identity_) {
      config = _config_;
      identity = _identity_;
      httpBackend = $httpBackend;
      $rootScope = _$rootScope_;
    }));

    beforeEach(function() {
      httpBackend.expectGET(config.dataService + '/currentUser?_=SomeBusterOfCache').respond({
        _id: 0,
        name: 'The Initially Fetched User'
      });
      httpBackend.flush();
    });

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });

    describe('instantiation', function() {
      it('attempts to get the current user', function() {
        expect(identity.currentUser).to.deep.equal({
          _id: 0,
          name: 'The Initially Fetched User'
        });
      });
    });

    describe('get', function() {
      it('queries the API for the current user if it has not been set', function() {
        identity.currentUser = undefined;
        httpBackend.expectGET(config.dataService + '/currentUser?_=SomeBusterOfCache').respond({});
        identity.get();
        httpBackend.flush();
      });

      it('resolves to the returned user', function(done) {
        identity.currentUser = undefined;
        httpBackend.expectGET(config.dataService + '/currentUser?_=SomeBusterOfCache').respond({
          _id: 42,
          name: 'Ford Prefect'
        });
        identity.get().then(function(currentUser) {
          expect(currentUser).to.deep.equal({
            _id: 42,
            name: 'Ford Prefect'
          });
          expect(identity.currentUser).to.deep.equal({
            _id: 42,
            name: 'Ford Prefect'
          });
          done();
        });

        httpBackend.flush();
      });
    });

    describe('set', function() {
      it('sets the user so it is returned without querying the data service', function(done) {
        identity.set({
          _id: 73,
          name: 'Sheldon Cooper'
        });
        expect(identity.currentUser).to.deep.equal({
          _id: 73,
          name: 'Sheldon Cooper'
        });
        identity.get().then(function(currentUser) {
          expect(currentUser).to.deep.equal({
            _id: 73,
            name: 'Sheldon Cooper'
          });
          done();
        });

        $rootScope.$digest();
      });
    });

    describe('clear', function() {
      it('causes the user to have to be requeried', function(done) {
        identity.set({
          _id: 73,
          name: 'Sheldon Cooper'
        });
        identity.clear();
        httpBackend.expectGET(config.dataService + '/currentUser?_=SomeBusterOfCache').respond({
          _id: 42,
          name: 'Ford Prefect'
        });
        identity.get().then(function(currentUser) {
          expect(currentUser).to.deep.equal({
            _id: 42,
            name: 'Ford Prefect'
          });
          done();
        });

        httpBackend.flush();
      });
    });

    describe('isAuthenticated', function() {
      it('returns false if there is no token', function() {
        mockAuthenticationToken.get.returns(null);
        expect(identity.isAuthenticated()).to.be.false;
      });

      it('returns true if there is a token', function() {
        mockAuthenticationToken.get.returns('Something');
        expect(identity.isAuthenticated()).to.be.true;
      });
    });

    describe('isAuthorized', function() {
      it('returns false if there is no authenticated user', function() {
        mockAuthenticationToken.get.returns(null);
        expect(identity.isAuthorized('')).to.be.false;
      });

      it('returns false if there is an authenticated user, but it has not been fetched', function() {
        mockAuthenticationToken.get.returns('Something');
        expect(identity.isAuthorized('admin')).to.be.false;
      });

      it('returns false if there is an authorized user, but user does not have role', function() {
        mockAuthenticationToken.get.returns('Something');
        identity.set({
          _id: 'something',
          roles: ['user', 'cook']
        });
        expect(identity.isAuthorized('admin')).to.be.false;
      });

      it('returns true if there is an authorized user, and user does have role', function() {
        mockAuthenticationToken.get.returns('Something');
        identity.set({
          _id: 'something',
          roles: ['user', 'cook', 'admin']
        });
        expect(identity.isAuthorized('admin')).to.be.true;
      });

      it('returns true if there is an authorized user, and no role is required', function() {
        mockAuthenticationToken.get.returns('Something');
        identity.set({
          _id: 'something',
          roles: ['user', 'cook', 'admin']
        });
        expect(identity.isAuthorized('')).to.be.true;
        expect(identity.isAuthorized()).to.be.true;
      });

      it('returns false if a role is required but the user does not have any roles', function() {
        mockAuthenticationToken.get.returns('Something');
        identity.set({
          _id: 'something'
        });
        expect(identity.isAuthorized('admin')).to.be.false;
      });

      it('returns true if a role is not required and the user does not have any roles', function() {
        mockAuthenticationToken.get.returns('Something');
        identity.set({
          _id: 'something'
        });
        expect(identity.isAuthorized('')).to.be.true;
        expect(identity.isAuthorized()).to.be.true;
      });
    });
  });
}());
