var test = require('tape');
var Knoq = require('../');
var createServer = require('./server').createServer;

test('Basic functionality', function (t) {
  var server = createServer();

  server.listen(0, function() {
    var requests = 0;
    var port = server.address().port;
    var host = '//localhost:' + port;
    var href = 'http:' + host + '/';

    var req = Knoq(href, 100, function(err, res) {
      t.ifError(err, 'no error');
      t.ok(res, 'get response if last-modified changed');
      t.equal(res.statusCode, 200, 'get statusCode from request');
      if (requests++ === 1) {
        t.equal(requests, 2, 'shoud have made two requests');
        server.close();
        req.end();
        t.end();
      }
    });

    server.on('/', function(req, res) {
      res.writeHead(200);
      res.end();
    });
  });
});
