/* jshint node: true */
var express = require('express');
var router = express.Router();
var fs = require('fs');


// Simple GET route. Endpoint name and name of JSON file that has the data must match
// example: employee -> employee.json
function createSimpleRoute(name) {
  router.route('/' + name).get(function(request, response) {
    fs.readFile('./server/json/' + name + '.json', 'utf8', function(err, data) {
      if (err) {
        console.log(err);
      }
      else {
        var output = JSON.parse(data);
        setTimeout(function(){
          response.status(200).json(output);
        }, 2500);
      }
    });
  });

  router.route('/' + name + '/:id').get(function(request, response) {
    fs.readFile('./server/json/' + name + '.json', 'utf8', function(err, data) {
      if (err) {
        console.log(err);
      }
      else {
        var output = JSON.parse(data);
        setTimeout(function(){
          response.status(200).json(output);
        }, 2500);
      }
    });
  });
}

createSimpleRoute('approval');
createSimpleRoute('timesheetSummary');

module.exports = router;
