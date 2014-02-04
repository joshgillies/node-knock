var http = require('http');

module.exports = Knock;

function Knock(opts) {
  if (!(this instanceof Knock)) return new Knock(opts);
  if (!opts) opts = {};
  this.opts = opts;
  this.lastModified = null;
  this.options = {
    method: 'GET',
    host: this.opts.host,
    path: this.opts.path
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
      console.log(headers);
      return callback('resource not updated');
    }).on('error', function(err) {
      return callback(err);
    }).end();
  };
}

Knock.prototype.response= function(callback) {
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

