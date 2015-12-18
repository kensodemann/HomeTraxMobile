/* jshint expr: true, undef: false */
(function() {
  'use strict';

  describe('homeTrax.common.resources.User', function() {
    var config;
    var $httpBackend;
    var User;
    var scope;
    var testData;

    beforeEach(function() {
      initializeTestData();
    });

    beforeEach(module('homeTrax.common.resources.User'));

    beforeEach(inject(function($rootScope, _$httpBackend_, _config_, _User_) {
      scope = $rootScope;
      $httpBackend = _$httpBackend_;
      config = _config_;
      User = _User_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('exists', function() {
      expect(User).to.not.be.undefined;
    });

    describe('query', function() {
      it('gets the data', function() {
        $httpBackend.expectGET(config.dataService + '/users')
          .respond(testData);
        var res = User.query({});
        $httpBackend.flush();

        expect(res.length).to.equal(5);
        expect(res[0].testTag).to.equal(1);
        expect(res[2].testTag).to.equal(4);
        expect(res[4].testTag).to.equal(7);
      });

      it('returns the color defined for the user if defined', function() {
        $httpBackend.expectGET(config.dataService + '/users')
          .respond(testData);
        var res = User.query({});
        $httpBackend.flush();

        expect(res[2].color).to.equal('#ff0000');
      });

      it('defaults the color if it is not defined', function() {
        $httpBackend.expectGET(config.dataService + '/users')
          .respond(testData);
        var res = User.query({});
        $httpBackend.flush();

        expect(res[0].color).to.equal('#3a87ad');
      });
    });

    describe('is administrator', function() {
      it('is false if the user has no roles', function() {
        var user = new User({
          userId: '42',
          firstName: 'Douglas',
          lastName: 'Adams'
        });
        expect(user.isAdministrator()).to.be.false;
      });

      it('is false if the user does not have the role', function() {
        var user = new User({
          userId: '42',
          firstName: 'Douglas',
          lastName: 'Adams',
          roles: ['butcher', 'baker', 'candlestickmaker']
        });
        expect(user.isAdministrator()).to.be.false;
      });

      it('is trie if the user has the role', function() {
        var user = new User({
          userId: '42',
          firstName: 'Douglas',
          lastName: 'Adams',
          roles: ['butcher', 'baker', 'admin', 'candlestickmaker']
        });
        expect(user.isAdministrator()).to.be.true;
      });
    });

    describe('addRole', function() {
      it('adds the role if the user does not already have it', function() {
        var user = new User({
          userId: 73,
          roles: ['wholeWheat', 'buttered', 'sweet']
        });
        user.addRole('dinner');
        expect(user.roles).to.deep.equal(['wholeWheat', 'buttered', 'sweet', 'dinner']);
      });

      it('does not add the role if the user already has it', function() {
        var user = new User({
          userId: 73,
          roles: ['wholeWheat', 'buttered', 'sweet']
        });
        user.addRole('sweet');
        expect(user.roles).to.deep.equal(['wholeWheat', 'buttered', 'sweet']);
      });
    });

    describe('removeRole', function() {
      it('removes the role if the user has it', function() {
        var user = new User({
          userId: 73,
          roles: ['wholeWheat', 'buttered', 'sweet']
        });
        user.removeRole('buttered');
        expect(user.roles).to.deep.equal(['wholeWheat', 'sweet']);
      });

      it('does nothing if the user does not already have that role', function() {
        var user = new User({
          userId: 73,
          roles: ['wholeWheat', 'buttered', 'sweet']
        });
        user.removeRole('dinner');
        expect(user.roles).to.deep.equal(['wholeWheat', 'buttered', 'sweet']);
      });
    });

    function initializeTestData() {
      testData = [{
        userId: '1',
        testTag: 1
      }, {
        userId: '2',
        testTag: 2
      }, {
        userId: '3',
        testTag: 4,
        color: '#ff0000'
      }, {
        userId: '4',
        testTag: 5
      }, {
        userId: '5',
        testTag: 7
      }];
    }
  });
}());
