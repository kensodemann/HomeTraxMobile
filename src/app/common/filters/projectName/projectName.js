(function() {
  angular.module('homeTrax.common.filters.projectName', [])
    .filter('projectName', function() {
      return function(prj) {
        if (angular.isUndefined(prj) || prj === null || !prj.name) {
          return '';
        }

        return prj.name +
          (prj.jiraTaskId ? ' [' + prj.jiraTaskId + ']' : '')+
          (prj.sbvbTaskId ? ' (' + prj.sbvbTaskId + ')' : '');
      };
    });
})();
