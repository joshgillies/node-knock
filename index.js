var url = require('url');
var path = require('path');
var cheqr = require(path.join(__dirname, 'lib', 'cheqr.js'));
var hyperquest = require('hyperquest');

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
    hyperquest(this.options, function(res) {
      return callback(null, res);
    }).on('error', function(err) {
      return callback(err, null);
    }).end();
  });
};

module.exports = Knoq;
