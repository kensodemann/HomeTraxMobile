/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.directives.htItemFinder', function() {
    var $compile;
    var $scope;

    beforeEach(module('app/common/directives/htItemFinder/htItemFinder.html'));
    beforeEach(module('homeTrax.common.directives.htItemFinder'));

    beforeEach(inject(function($rootScope, _$compile_) {
      $scope = $rootScope;
      $compile = _$compile_;
    }));

    it('compiles', function() {
      var el = compile('<ht-item-finder></ht-item-finder>');
      expect(el[0].innerHTML).to.contain('<ion-list>');
    });

    describe('select', function() {
      it('sets the selected item', function() {
        $scope.model = {};
        var el = compile('<ht-item-finder ht-selected-item="model"></ht-item-finder>');
        var controller = el.isolateScope().controller;
        controller.select({
          _id: 12,
          name: 'stuff'
        });
        $scope.$digest();
        expect($scope.model).to.deep.equal({
          _id: 12,
          name: 'stuff'
        });
      });
    });

    function compile(html) {
      var el = angular.element(html);
      $compile(el)($scope);
      $scope.$digest();

      return el;
    }
  });
}());
