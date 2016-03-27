(function() {
  'use strict';

  angular.module('homeTrax.common.services.stages', [
    'homeTrax.common.resources.Stage'
  ]).factory('stages', stages);

  function stages(Stage) {
    var cachedStages;

    return {
      load: load,
      get all() {
        if (!cachedStages) {
          load();
        }

        return cachedStages;
      }
    };

    function load() {
      cachedStages = Stage.query();
    }
  }
}());
