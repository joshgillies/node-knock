var test = require('tape')
var Knoq = require('..')
var createServer = require('./server').createServer

test('Basic functionality', function (t) {
  var server = createServer()

  server.listen(0, function () {
    var requests = 0
    var port = server.address().port
    var host = '//localhost:' + port
    var href = 'http:' + host + '/'

    var req = Knoq(href, 100, function (err, res) {
      t.ifError(err, 'no error')
      t.ok(res, 'got response')
      t.equal(res.statusCode, 200, 'got correct statusCode')
      t.notOk(req.pending, 'internal state, pending: ' + req.pending)
      if (requests++ === 1) {
        t.equal(requests, 2, 'two requests made')
        server.close()
        req.end()
        t.notOk(req.running, 'internal state, running: ' + req.running)
        t.end()
      }
    })

    req.once('request', function (req) {
      t.ok(req, 'request event fired')
    })
    req.once('response', function (res) {
      t.ok(res, 'response event fired')
    })
    req.once('error', function (err) {
      t.ifError(err, 'error event fired')
    })
    req.once('end', function () {
      t.ok(true, 'end event fired')
    })

    t.ok(req.running, 'internal state, running: ' + req.running)

    server.on('/', function (_, res) {
      if (requests === 0) {
        t.ok(req.pending, 'internal state, pending: ' + req.pending)
      }
      res.writeHead(200)
      res.end()
    })

  })
})
