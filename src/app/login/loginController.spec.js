/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.login.loginController', function() {
    beforeEach(module('homeTrax.login.loginController'));

    var scope;
    var $controllerConstructor;
    var dfd;
    var mockAuthenticationService;
    var mockState;

    beforeEach(inject(function($controller, $rootScope, $q) {
      scope = $rootScope.$new();
      $controllerConstructor = $controller;
      dfd = $q.defer();
    }));

    beforeEach(function() {
      mockAuthenticationService = sinon.stub({
        authenticateUser: function() {
        }
      });
      mockAuthenticationService.authenticateUser.returns(dfd.promise);
    });

    beforeEach(function() {
      mockState = sinon.stub({
        go: function() {
        }
      });
    });

    function createController() {
      return $controllerConstructor('loginController', {
        $state: mockState,
        authenticationService: mockAuthenticationService
      });
    }

    describe('login', function() {
      var controller;
      beforeEach(function() {
        controller = createController();
      });

      it('Should call authenticateUser', function() {
        controller.username = 'jeff';
        controller.password = 'FireW00d';
        controller.login();
        expect(mockAuthenticationService.authenticateUser.calledOnce).to.be.true;
        expect(mockAuthenticationService.authenticateUser.calledWith('jeff', 'FireW00d')).to.be.true;
      });

      it('Should redirect to the current timesheet on success', function() {
        callSigninWithSuccess();

        expect(mockState.go.calledOnce).to.be.true;
        expect(mockState.go.calledWith('app.timesheets.view')).to.be.true;
      });

      it('Should show an error on failure', function() {
        callSigninWithFailure();
        expect(controller.errorMessage).to.equal('Invalid Username or Password');
      });

      it('clears the password after a successful login', function() {
        callSigninWithSuccess();
        expect(controller.password).to.equal('');
      });

      it('clears the password after an unsuccessful login', function() {
        callSigninWithFailure();
        expect(controller.password).to.equal('');
      });

      function callSigninWithSuccess() {
        controller.username = 'jeff';
        controller.password = 'FireW00d';
        controller.login();
        dfd.resolve(true);
        scope.$apply();
      }

      function callSigninWithFailure() {
        controller.username = 'jeff';
        controller.password = 'FireW00d';
        controller.login();
        dfd.resolve(false);
        scope.$apply();
      }
    });

    describe('clearErrorMessage', function() {
      it('clears the error message', function() {
        var controller = createController();
        controller.errorMessage = 'Invalid Username or Password';
        controller.clearErrorMessage();
        expect(controller.errorMessage).to.equal('');
      });
    });
  });
}());
