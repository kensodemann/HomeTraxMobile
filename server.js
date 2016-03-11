/* jshint node: true */

// configurable global app settings
var port = process.env.port || 8082;

// load in command line option, really this only supports a single value
// that can be used to change deafult port.
var args = process.argv.slice(2);
if (args.length > 0) {
  port = parseInt(args[0]);
}

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
  console.log('PENTA: Server listening on port: ' + port);
});
