(function() {
  'use strict';

  // @ifdef RELEASE
  angular.module('homeTrax.common.core.config', []).constant('config', {
    dataService: 'https://hometraxdata-kensodemann.rhcloud.com'
  });
  // @endif

  // @ifdef DEVELOPMENT
  angular.module('homeTrax.common.core.config', []).constant('config', {
    dataService: 'http://localhost:8080'
  });
  // @endif
}());
