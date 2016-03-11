/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.directives.htSearch', function() {
    var $compile;
    var $scope;

    beforeEach(module('app/common/directives/htSearch/htSearch.html'));
    beforeEach(module('homeTrax.common.directives.htSearch'));

    beforeEach(inject(function($rootScope, _$compile_) {
      $scope = $rootScope;
      $compile = _$compile_;
    }));

    it('compiles', function() {
      var el = compile('<ht-search></ht-search>');
      expect(el[0].innerHTML).to.contain('<ion-input class="item item-input ht-search-input">');
    });

    function compile(html) {
      var el = angular.element(html);
      $compile(el)($scope);
      $scope.$digest();

      return el;
    }
  });
}());
