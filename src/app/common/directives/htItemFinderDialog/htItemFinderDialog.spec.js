/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.directives.htItemFinderDialog', function() {
    var $compile;
    var $scope;

    beforeEach(module('app/common/directives/htItemFinder/htItemFinder.html'));
    beforeEach(module('app/common/directives/htItemFinderDialog/htItemFinderDialog.html'));
    beforeEach(module('homeTrax.common.directives.htItemFinderDialog'));

    beforeEach(inject(function($rootScope, _$compile_) {
      $scope = $rootScope;
      $compile = _$compile_;
    }));

    it('compiles', function() {
      var el = compile('<ht-item-finder-dialog></ht-item-finder-dialog>');
      expect(el[0].innerHTML).to.contain('<form name="itemFinderDialog"');
    });

    describe('closing the dialog', function() {
      beforeEach(function() {
        $scope.dialog = {
          hide: sinon.stub()
        };
      });

      it('occurs when the model goes from nothing to something', function() {
        compile('<ht-item-finder-dialog ng-model="model" ht-dialog="dialog"></ht-item-finder-dialog>');
        $scope.model = {};
        $scope.$digest();
        expect($scope.dialog.hide.calledOnce).to.be.true;
      });

      it('occurs when the model goes from one thing to another', function() {
        $scope.model = {name: 'Bill'};
        compile('<ht-item-finder-dialog ng-model="model" ht-dialog="dialog"></ht-item-finder-dialog>');
        $scope.model = {name: 'Ted'};
        $scope.$digest();
        expect($scope.dialog.hide.calledOnce).to.be.true;
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
