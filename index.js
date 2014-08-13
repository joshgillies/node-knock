var http = require('http');
var url = require('url');

module.exports = Knoq;

function Knoq(opts) {
  if (!(this instanceof Knoq)) return new Knoq(opts);
  if (typeof opts === 'string') opts = url.parse(opts);
  if (!opts) opts = {};
  this.opts = opts;
  this.lastModified = null;
  this.options = {
    method: 'GET',
    host: this.opts.host,
    path: this.opts.path,
    port: this.opts.port || 80
  };

  this.update = function(callback) {
    var self = this;
    var options = self.options;
    options.method = 'HEAD';

    http.request(options, function(res) {
      var headers = JSON.stringify(res.headers);
      var modified = new Date(headers['last-modified']);
      if (self.lastModified < modified) {
        self.lastModified = modified;
        return callback(null);
      }
      return callback('resource not updated');
    }).on('error', function(err) {
      return callback(err);
    }).end();
  };
}

Knoq.prototype.response = function(callback) {
  var self = this;
  var options = self.options;

  self.update(function(err) {
    if (err) return callback(err, null);
    options.method = 'GET';
    http.request(options, function(res) {
      return callback(null, res);
    }).on('error', function(err) {
      return callback(err, null);
    }).end();
  });
};

