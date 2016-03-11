(function() {
  'use strict';

  // @ifdef LOCAL
  angular.module('homeTrax.common.core.config', []).constant('config', {
    dataService: 'http://localhost:8080'
  });
  // @endif

  // @ifdef CLOUD9
  angular.module('homeTrax.common.core.config', []).constant('config', {
    dataService: 'https://hometraxdata-kensodemann.c9.io'
  });
  // @endif

  // @ifdef OPENSHIFT
  angular.module('homeTrax.common.core.config', []).constant('config', {
    dataService: 'https://hometraxdata-kensodemann.rhcloud.com'
  });
  // @endif
}());
