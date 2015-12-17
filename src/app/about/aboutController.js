(function() {
  'use strict';

  angular.module('homeTrax.about.aboutController', [
    'ui.router'
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

  function AboutController() {
  }
}());
