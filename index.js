var http = require('http');
var https = require('https');
var url = require('url');
var curli = require('curli');

module.exports = Knoq;

function Knoq(opts) {
  if (!(this instanceof Knoq)) return new Knoq(opts);
  if (typeof opts === 'string') opts = url.parse(opts);
  if (!opts) opts = {};
  this.options = opts;
  this.lastModified = null;
}

Knoq.prototype.response = function(callback) {
  cheqr.call(this, function(err) {
    if (err) return callback(err, null);
    http.request(options, function(res) {
      return callback(null, res);
    }).on('error', function(err) {
      return callback(err, null);
    }).end();
  });
};

function cheqr(callback) {
  var self = this;

  curli(self.options, function(err, headers) {
    if (err) return callback(err);
    var modified = new Date(headers['last-modified']);
    if (self.lastModified < modified) {
      self.lastModified = modified;
      return callback(null);
    }
    return callback(new Error('resource not updated'));
  });
}
