/* jshint node: true */
module.exports = function(request, response, next) {
  var start = +new Date();
  var stream = process.stdout;

  var url = request.url;
  var method = request.method;

  response.on('finish', function(){
    // we want to just log everything we can remove or use a temp if statement.
    if (true) {
      // if (url.indexOf("/api/") == 0) {
      var duration = +new Date() - start;
      var message = method + ' (' + duration + ' ms) to ' + url + '\n';
      stream.write(message);
    }
  });

  next();
};
