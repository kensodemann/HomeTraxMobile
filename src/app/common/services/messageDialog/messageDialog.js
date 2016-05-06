(function() {
  'use strict';

  angular.module('homeTrax.common.services.messageDialog', []).factory('messageDialog', messageDialog);

  function messageDialog($rootScope, $ionicPopup) {
    return {
      ask: ask,
      error: error
    };

    function ask(title, message) {
      var scope = $rootScope.$new(true);
      scope.message = message;

      return $ionicPopup.show({
        title: title,
        scope: scope,
        templateUrl: 'app/common/services/messageDialog/templates/ask.html',
        buttons: [{
          text: 'Yes',
          type: 'button-energized',
          onTap: function() {
            return true;
          }
        }, {
          text: 'No',
          type: 'button-default',
          onTap: function() {
            return false;
          }
        }]
      }).then(function(result) {
        scope.$destroy();
        return result;
      });
    }

    function error(title, message) {
      var scope = $rootScope.$new(true);
      scope.message = message;

      return $ionicPopup.show({
        title: title,
        scope: scope,
        templateUrl: 'app/common/services/messageDialog/templates/error.html',
        buttons: [{
          text: 'OK',
          type: 'button-energized'
        }]
      }).then(function() {
        scope.$destroy();
      });
    }
  }
}());
