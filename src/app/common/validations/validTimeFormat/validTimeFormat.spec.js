/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.validations.validTimeFormat', function() {
    var el;
    var $scope;

    beforeEach(module('homeTrax.common.validations.validTimeFormat'));

    beforeEach(inject(function($rootScope, $compile) {
      $scope = $rootScope.$new();
      el = angular.element('<form name="myForm"><input name="myElement" type="text" ng-model="value" valid-time-format/></form>');
      $compile(el)($scope);
      $scope.$digest();
    }));

    it('marks input valid if the value is undefined', function() {
      $scope.$digest();
      expect($scope.myForm.myElement.$invalid).to.be.false;
    });

    describe('marking invalid formats invalid', function() {
      [{
        i: 'text',
        d: 'text string'
      }, {
        i: '0,15',
        d: 'invalid separator'
      }, {
        i: ':0',
        d: 'single digit zero minutes'
      }, {
        i: ':1',
        d: 'single digit minute'
      }, {
        i: 'x:15',
        d: 'invalid hours'
      }, {
        i: '1:1x',
        d: 'invalid minutes value'
      }, {
        i: '1:60',
        d: 'minutes > 59'
      }].forEach(function(testCase) {
        it(testCase.d, function() {
          $scope.value = testCase.i;
          $scope.$digest();
          expect($scope.myForm.myElement.$invalid).to.be.true;
        });
      });
    });

    describe('marking valid formats valid', function() {
      [{
        i: '1',
        d: 'integer hour'
      }, {
        i: '.8375',
        d: 'decimal portion of hour'
      }, {
        i: ':59',
        d: 'minutes'
      }, {
        i: '1:15',
        d: 'hours and minutes'
      }, {
        i: '-1:15',
        d: 'negative hours and minutes'
      }, {
        i: '-.75',
        d: 'negative fractional hour'
      }, {
        i: '-:15',
        d: 'negative minutes'
      }].forEach(function(testCase) {
        it(testCase.d, function() {
          $scope.value = testCase.i;
          $scope.$digest();
          expect($scope.myForm.myElement.$invalid).to.be.false;
        });
      });
    });
  });
}());
