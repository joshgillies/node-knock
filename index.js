var inherits = require('inherits')
var hyperquest = require('hyperquest')
var EventEmitter = require('events').EventEmitter

var Knoq = function Knoq (uri, opts, callback) {
  if (!(this instanceof Knoq)) return new Knoq(uri, opts, callback)

  if (typeof uri === 'object') {
    callback = opts
    opts = uri
    uri = undefined
  }

  if (typeof opts === 'number') {
    opts = {
      delay: opts
    }
  }

  if (typeof opts === 'function') {
    callback = opts
    opts = undefined
  }

  if (!opts) {
    opts = {
      delay: 60000
    }
  }

  if (uri !== undefined) opts.uri = uri

  EventEmitter.call(this)

  this.uri = opts.uri
  this.pending = false
  this.running = false
  this.delay = opts.delay

  this.start()

  if (callback) {
    this.on('error', function onError (err) {
      callback(err)
    })
    this.on('response', function onResponse (res) {
      callback(null, res)
    })
  }
}

inherits(Knoq, EventEmitter)

Knoq.prototype.ready = function ready () {
  return !this.pending && this.running
}

Knoq.prototype.start = function start () {
  if (!this.running) {
    process.nextTick(this.preRequest.bind(this))
  }

  this.running = true
  this.setInterval = setInterval(this.preRequest.bind(this), this.delay)
}

Knoq.prototype.preRequest = function preRequest () {
  if (this.ready()) {
    this.request()
  }
}

Knoq.prototype.request = function request () {
  var req = hyperquest(this.uri)

  function onResponse (res) {
    this.pending = false
    this.emit('response', res)
  }

  function onError (err) {
    this.emit('error', err)
    this.end()
  }

  req.on('response', onResponse.bind(this))
  req.on('error', onError.bind(this))
}

Knoq.prototype.end = function end () {
  if (this.setInterval) {
    clearInterval(this.setInterval)
  }
  this.pending = false
  this.running = false
  this.emit('end')
}

module.exports = Knoq
