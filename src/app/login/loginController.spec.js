/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.login.loginController', function() {
    var mockAuthenticationService;
    var mockIonicHistory;
    var mockState;
    var mockWaitSpinner;

    var $scope;
    var $controllerConstructor;
    var authDfd;
    var clearDfd;

    beforeEach(module('homeTrax.login.loginController'));

    beforeEach(inject(function($controller, $rootScope, $q) {
      $scope = $rootScope.$new();
      $controllerConstructor = $controller;
      authDfd = $q.defer();
      clearDfd = $q.defer();
    }));

    beforeEach(function() {
      mockAuthenticationService = sinon.stub({
        authenticateUser: function() {
        }
      });
      mockAuthenticationService.authenticateUser.returns(authDfd.promise);
    });

    beforeEach(function() {
      mockIonicHistory = sinon.stub({
        clearCache: function() {
        },

        clearHistory: function() {
        }
      });
      mockIonicHistory.clearCache.returns(clearDfd.promise);
    });

    beforeEach(function() {
      mockState = sinon.stub({
        go: function() {
        }
      });
    });

    beforeEach(function() {
      mockWaitSpinner = sinon.stub({
        show: function() {
        },

        hide: function() {
        }
      });
    });

    function createController() {
      return $controllerConstructor('loginController', {
        $state: mockState,
        authenticationService: mockAuthenticationService,
        $ionicHistory: mockIonicHistory,
        waitSpinner: mockWaitSpinner
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

      it('clears the view cache on success', function() {
        callLoginWithSuccess();
        expect(mockIonicHistory.clearCache.calledOnce).to.be.true;
      });

      it('does not clear the view cache on failure', function() {
        callLoginWithFailure();
        expect(mockIonicHistory.clearCache.called).to.be.false;
      });

      it('it redirects to the current timesheet once the cache clears', function() {
        callLoginWithSuccess();

        expect(mockState.go.called).to.be.false;
        clearDfd.resolve();
        $scope.$digest();
        expect(mockState.go.calledOnce).to.be.true;
        expect(mockState.go.calledWith('app.timesheets.view')).to.be.true;
      });

      it('Should show an error on failure', function() {
        callLoginWithFailure();
        expect(controller.errorMessage).to.equal('Invalid Username or Password');
      });

      it('clears the password after a successful login', function() {
        callLoginWithSuccess();
        expect(controller.password).to.equal('');
      });

      it('clears the password after an unsuccessful login', function() {
        callLoginWithFailure();
        expect(controller.password).to.equal('');
      });

      it('shows a wait spinner', function() {
        controller.username = 'jeff';
        controller.password = 'FireW00d';
        controller.login();
        expect(mockWaitSpinner.show.calledOnce).to.be.true;
      });

      it('hides the wait spinner', function() {
        controller.username = 'jeff';
        controller.password = 'FireW00d';
        controller.login();
        expect(mockWaitSpinner.hide.called).to.be.false;
        authDfd.resolve(true);
        $scope.$digest();
        expect(mockWaitSpinner.hide.calledOnce).to.be.true;
      });

      function callLoginWithSuccess() {
        controller.username = 'jeff';
        controller.password = 'FireW00d';
        controller.login();
        authDfd.resolve(true);
        $scope.$digest();
      }

      function callLoginWithFailure() {
        controller.username = 'jeff';
        controller.password = 'FireW00d';
        controller.login();
        authDfd.resolve(false);
        $scope.$digest();
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
