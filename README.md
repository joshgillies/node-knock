# Knoq

A interval based Node module for continuous retrieval of web resources.

[![build status](https://secure.travis-ci.org/joshgillies/node-knoq.svg)](http://travis-ci.org/joshgillies/node-knoq)

[![NPM](https://nodei.co/npm/knoq.png?downloads=true&stars=true)](https://nodei.co/npm/knoq/)

# Example

```javascript
var Knoq = require('knoq');
var req = Knoq('http://www.google.com/');

req.on('response', function(res) {
  console.log(res.statusCode);
  req.end();
});

req.on('end', function() {
  console.log('ended!');
});
```

# Methods

```javascript
var Knoq = require('knoq');
```

## var req = Knoq(uri, opts, cb)

Create an ongoing http request to `uri`.

The optional `opts` object is used to pass configuration to `Knoq`.

 * opts.delay - Used to configure the interval timer. Defaults to `6000`.

Alternatively you can pass a number as the `opts` argument:

```javascript
var req = Knoq('http://google.com', 12000);
```

Which is shorthand for:

```javascript
var req = Knoq('http://google.com', { delay: 12000 });
```

The optional callback `cb(err, res)` is called when either the `error` or `response` event is fired.

## req.start()

Internally this is called with every new instance of `Knoq`.
Can be used to restart an ended `Knoq` instance.

## req.end()

Calling `req.end()` clears all timeouts, and stops `Knoq` from making any further requests.

# Events

`Knoq` returns an instance of `EventEmitter`, and exposes the following events:

## req.on('request', function (req) {})

The `request` event bubbles up from `http.request()`.

## req.on('response', function (res) {})

The `response` event bubbles up from `http.request()`.

## req.on('error', function (err) {})

The `error` event bubbles up from `http.request()`.
By default `req.end()` will be called in the case of an error.

## req.on('end', function () {})

The `end` event is fired when `req.end()` is called.

# Install

`npm install knoq`

# License

MIT
