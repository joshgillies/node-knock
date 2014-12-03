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

  EventEmitter.call(this);

  this.uri = opts.uri;
  this.pending = false;
  this.running = true;

  this.interval = setInterval(this.preRequest.bind(this), opts.delay);

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

Knoq.prototype.ready = function ready() {
  return !this.pending && this.running;
};

Knoq.prototype.preRequest = function preRequest() {
  if (this.ready()) this.request();
};

Knoq.prototype.request = function request() {
  var onResponse = function onResponse(res) {
    this.pending = false;
    this.emit('response', res);
  };
  var onError = function onError(err) {
    this.emit('error', err);
    this.end();
  };

  this.pending = true;

  var req = hyperquest(this.uri);
  req.on('response', onResponse.bind(this));
  req.on('error', onError.bind(this));

};

Knoq.prototype.end = function end() {
  if (this.interval) clearInterval(this.interval);
  this.pending = false;
  this.running = false;
  this.emit('end');
};

module.exports = Knoq;
