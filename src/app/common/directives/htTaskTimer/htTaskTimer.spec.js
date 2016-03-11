/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.directives.htTaskTimer', function() {
    var $compile;
    var $scope;

    beforeEach(module('app/common/directives/htTaskTimer/htTaskTimer.html'));
    beforeEach(module('homeTrax.common.directives.htTaskTimer'));

    beforeEach(inject(function($rootScope, _$compile_) {
      $scope = $rootScope;
      $compile = _$compile_;
    }));

    it('compiles', function() {
      var el = compile('<ht-task-timer></ht-task-timer>');
      expect(el[0].innerHTML).to.contain('<div');
    });

    function compile(html) {
      var el = angular.element(html);
      $compile(el)($scope);
      $scope.$digest();

      return el;
    }
  });
}());
