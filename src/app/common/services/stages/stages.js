(function() {
  'use strict';

  angular.module('homeTrax.common.services.stages', [
    'homeTrax.common.resources.Stage'
  ]).factory('stages', stages);

  function stages(Stage) {
    var cachedStages;

    return {
      get all() {
        if (!cachedStages) {
          cachedStages = Stage.query();
        }

        return cachedStages;
      }
    };
  }
}());
