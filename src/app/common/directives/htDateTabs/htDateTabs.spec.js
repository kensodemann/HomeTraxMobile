/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.directives.htDateTabs', function() {
    var $scope;
    var $compile;

    beforeEach(module('homeTrax.common.directives.htDateTabs'));
    beforeEach(module('app/common/directives/htDateTabs/htDateTabs.html'));

    beforeEach(inject(function($rootScope, _$compile_) {
      $scope = $rootScope.$new();
      $compile = _$compile_;
    }));

    it('compiles', function() {
      $scope.timesheet = {
        endDate: '2016-01-02',
        userRid: '55aad676e710ff00008a17c6',
        _id: '5681439d2721630000ebd4c1'
      };
      var el = compile('<ht-date-tabs ht-timesheet="timesheet"></ht-date-tabs>');
      expect(el[0].innerHTML).to.contain('<div class="row">');
    });

    describe('days array', function() {
      it('is instantiated using the timesheet end date once the data is fetched', function() {
        var el = compile('<ht-date-tabs ht-timesheet="timesheet"></ht-date-tabs>');
        var controller = el.isolateScope().controller;
        expect(controller.days.length).to.equal(0);
        $scope.timesheet = {
          endDate: '2016-01-02'
        };
        $scope.$digest();
        expect(controller.days.length).to.equal(7);
        expect(controller.days[0].dateString).to.equal('2015-12-27');
        expect(controller.days[3].dateString).to.equal('2015-12-30');
        expect(controller.days[6].dateString).to.equal('2016-01-02');
      });

      it('marks the specified date selected if it is in range', function() {
        $scope.timesheet = {
          endDate: '2016-01-02'
        };
        $scope.selectedDate = '2015-12-29';
        var el = compile('<ht-date-tabs ht-timesheet="timesheet" ng-model="selectedDate"></ht-date-tabs>');
        var controller = el.isolateScope().controller;
        expect(controller.days[0].selected).to.be.false;
        expect(controller.days[1].selected).to.be.false;
        expect(controller.days[2].selected).to.be.true;
        expect(controller.days[3].selected).to.be.false;
        expect(controller.days[4].selected).to.be.false;
        expect(controller.days[5].selected).to.be.false;
        expect(controller.days[6].selected).to.be.false;
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
