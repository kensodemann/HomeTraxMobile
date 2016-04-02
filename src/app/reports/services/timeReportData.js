(function() {
  'use strict';

  angular.module('homeTrax.reports.services.timeReportData', []).factory('timeReportData', timeReportData);

  var forEach = angular.forEach;
  var unclassified = 'Unclassified';

  function timeReportData() {

    return {
      getSummaryData: getSummaryData,
      getDailySummaryData: getDailySummaryData
    };

    function getSummaryData(taskTimers) {
      return {
        totalTime: sum(taskTimers),
        jiraTasks: summarizedJiraTasks(taskTimers),
        sbvbTasks: summarizedSbvbTasks(taskTimers)
      };
    }

    function getDailySummaryData(taskTimers) {
      var tasksByDate = _.groupBy(taskTimers, function(timer) {
        return timer.workDate;
      });

      var dates = [];
      var keys = _.keys(tasksByDate).sort();
      forEach(keys, function(key) {
        dates.push({
          date: key,
          totalTime: sum(tasksByDate[key]),
          jiraTasks: summarizedJiraTasks(tasksByDate[key]),
          sbvbTasks: summarizedSbvbTasks(tasksByDate[key])
        });
      });

      return dates;
    }

    function summarizedJiraTasks(tasks) {
      var jiraTasks = _.groupBy(tasks, function(timer) {
        return timer.project.jiraTaskId || unclassified;
      });

      return summarize(jiraTasks);
    }

    function summarizedSbvbTasks(tasks) {
      var sbvbTasks = _.groupBy(tasks, function(timer) {
        return (timer.project.sbvbTaskId || unclassified) + ' ' + timer.stage.name;
      });

      return summarize(sbvbTasks);
    }

    function summarize(tasks) {
      var summarizedTasks = [];
      var keys = _.keys(tasks).sort(unclassifiedLast);
      forEach(keys, function(key) {
        summarizedTasks.push({
          project: tasks[key][0].project,
          stage: tasks[key][0].stage,
          totalTime: sum(tasks[key])
        });
      });

      return summarizedTasks;
    }

    function sum(items) {
      var x = 0;
      forEach(items, function(item) {
        x += (item.milliseconds || 0);
      });

      return x;
    }

    function unclassifiedLast(a, b) {
      var aIsUnclassified = a.substring(0, 12) === unclassified;
      var bIsUnclassified = b.substring(0, 12) === unclassified;

      if (aIsUnclassified && !bIsUnclassified) {
        return 1;
      }

      if (bIsUnclassified && !aIsUnclassified) {
        return -1;
      }

      if (a < b) {
        return -1;
      }

      if (a > b) {
        return 1;
      }

      return 0;
    }
  }
}());
