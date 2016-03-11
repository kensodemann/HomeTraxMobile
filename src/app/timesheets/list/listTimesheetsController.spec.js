/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.timesheets.list.listTimesheetsController', function() {
    var mockIdentity;
    var mockMessageDialog;

    var config;
    var $controllerConstructor;
    var $httpBackend;

    var testData;


    beforeEach(module('homeTrax.timesheets.list.listTimesheetsController'));

    beforeEach(function() {
      mockIdentity = {
        currentUser: {
          _id: 73,
          name: 'Sheldon Cooper'
        }
      };
    });

    beforeEach(function() {
      module(function($provide) {
        $provide.value('identity', mockIdentity);
      });
    });

    beforeEach(inject(function($controller, _$httpBackend_, _config_) {
      $controllerConstructor = $controller;
      $httpBackend = _$httpBackend_;
      config = _config_;
    }));

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(function() {
      mockMessageDialog = sinon.stub({
        error: function() {
        }
      });
    });

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    function createController() {
      return $controllerConstructor('listTimesheetsController', {
        messageDialog: mockMessageDialog
      });
    }

    function setupHttpQuery(status, res) {
      $httpBackend.expectGET(config.dataService + '/timesheets')
        .respond(status || 200, res);
    }

    it('exists', function() {
      setupHttpQuery();
      var controller = createController();
      expect(controller).to.exist;
      $httpBackend.flush();
    });

    it('exposes the queried timesheets for binding', function() {
      setupHttpQuery(200, testData);
      var controller = createController();
      expect(controller.timesheets.length).to.equal(0);
      $httpBackend.flush();
      expect(controller.timesheets.length).to.equal(6);
    });

    it('displays an error if the query fails', function() {
      setupHttpQuery(400, {
        reason: 'Because you suck eggs'
      });
      createController();
      $httpBackend.flush();
      expect(mockMessageDialog.error.calledOnce).to.be.true;
      expect(mockMessageDialog.error.calledWith('Error Getting Timesheets', 'Because you suck eggs')).to.be.true;
    });

    function initializeTestData() {
      testData = [{
        _id: 1,
        endDate: '2015-10-01'
      }, {
        _id: 2,
        endDate: '2015-10-08'
      }, {
        _id: 3,
        endDate: '2015-10-15'
      }, {
        _id: 6,
        endDate: '2015-09-05'
      }, {
        _id: 4,
        endDate: '2015-09-12'
      }, {
        _id: 5,
        endDate: '2015-10-31'
      }];
    }
  });
}());
