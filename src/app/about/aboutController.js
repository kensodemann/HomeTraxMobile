(function() {
  'use strict';

  angular.module('homeTrax.about.aboutController', [
    'ui.router',
    'homeTrax.common.core.ClientVersion',
    'homeTrax.common.resources.ServerVersion'
  ]).controller('aboutController', AboutController)
    .config(function($stateProvider) {
      $stateProvider.state('app.about', {
        url: '/about',
        views: {
          'menuContent': {
            templateUrl: 'app/about/about.html',
            controller: 'aboutController as controller'
          }
        }
      });
    });

  function AboutController(ServerVersion, ClientVersion) {
    var controller = this;

    controller.clientVersion = ClientVersion;

    activate();

    function activate() {
      ServerVersion.query(function(v) {
        controller.serverVersion = v[0];
      });
    }
  }
}());
