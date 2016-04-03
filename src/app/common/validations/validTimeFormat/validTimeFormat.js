(function() {
  'use strict';

  angular.module('homeTrax.common.validations.validTimeFormat', [])
    .directive('validTimeFormat', validTimeFormat);

  function validTimeFormat() {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function(scope, elem, attrs, ngModelController) {
        var dec = /^[+-]?\d*(\.\d+)?$/;
        var hrsMin = /^[+-]?\d*:[0-5][0-9]$/ ;

        ngModelController.$validators.validTimeFormat = validate;

        function validate(modelValue, viewValue) {
          return ngModelController.$isEmpty(viewValue) || dec.test(viewValue) || hrsMin.test(viewValue);
        }
      }
    };
  }
}());
