var inherits = require('inherits');
var hyperquest = require('hyperquest');
var EventEmitter = require('events').EventEmitter;

var Knoq = function Knoq(uri, opts, callback) {
  if (!(this instanceof Knoq)) return new Knoq(uri, opts, callback);
  if (typeof uri === 'object') {
    callback = opts;
    opts = uri;
    uri = undefined;
  }
  if (typeof opts === 'number') {
    opts = {
      delay: opts
    };
  }
  if (typeof opts === 'function') {
    callback = opts;
    opts = undefined;
  }
  if (!opts) {
    opts = {
      delay: 60000
    };
  }
  if (uri !== undefined) opts.uri = uri;

  var self = this;

  EventEmitter.call(this);

  this.uri = opts.uri;
  this.pending = false;
  this.running = true;

  this.interval = setInterval(function() {
    self.preRequest();
  }, opts.delay);

  if (callback) {
    this.on('error', function(err) {
      callback(err);
    });
    this.on('response', function(res) {
      callback(null, res);
    });
  }
};

inherits(Knoq, EventEmitter);

Knoq.prototype.preRequest = function preRequest() {
  if (!this.pending && this.running)
    this.request();
};

Knoq.prototype.request = function request() {
  var self = this;

  self.pending = true;

  var req = hyperquest(self.uri);
  req.on('response', function(res) {
    self.pending = false;
    self.emit('response', res);
  });
  req.on('error', function(err) {
    self.emit('error', err);
    self.end();
  });

};

Knoq.prototype.end = function end() {
  if (this.interval) clearInterval(this.interval);
  this.pending = false;
  this.running = false;
  this.emit('end');
};

module.exports = Knoq;
