(function() {
  'use strict';

  angular.module('homeTrax.projects', [
    'homeTrax.projects.list.listProjectsController',
    'ui.router'
  ]).config(function($stateProvider) {
    $stateProvider.state('app.projects', {
      url: '/projects',
      abstract: true,
      views: {
        'menuContent': {
          template: '<ion-nav-view name="projects"></ion-nav-view>'
        }
      }
    });
  });
}());
