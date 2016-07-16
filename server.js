/* jshint node: true */

// configurable global app settings
var port = process.env.port || process.env.PORT || 8082;

// init core node / express vars.
var express = require('express');
var app = express();

// load in custom or NPM modules.
var logger = require('./server/logger');
app.use(logger);

// default static content route, up a level so client is sibling to server
app.use(express.static('./www'));

// Fake developer routes
var apiRoutes = require('./server/apiRoutes');
app.use('/api', apiRoutes);

// because there's no default route handler at "/", express will try and serve
// whatever static content is defined in express.static above.

// start it up!!!
app.listen(port, function(){
  console.log('HomeTrax: Server listening on port: ' + port);
});
