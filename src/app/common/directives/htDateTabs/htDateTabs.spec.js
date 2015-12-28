/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.directives.htDateTabs', function() {
    var scope;
    var $compile;

    beforeEach(module('penta.common.directives.htDateTabs'));
    beforeEach(module('app/common/directives/htDateTabs/htDateTabs.html'));

    beforeEach(inject(function(_$rootScope_, _$compile_) {
      scope = _$rootScope_;
      $compile = _$compile_;
    }));

    it('compiles', function() {
      var el = compile('<ht-date-tabs ng-model="something"></ht-date-tabs>');
      expect(el[0].innerHTML).to.contain('<div class="row">');
    });

    function compile(html) {
      var el = angular.element(html);
      $compile(el)(scope);
      scope.$digest();

      return el;
    }
  });
}());
