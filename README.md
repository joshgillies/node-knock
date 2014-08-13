# node-knoq

A general purpose resource checker.

With Knoq in the same way you'd knock on a door
to see who's home you can Knoq a web resource to
see what's shaking.

If you can curl it you can Knoq it.

Example:

```javascript
var Knoq = require('knoq');
var resource = Knoq('www.google.com/somepath');

setInterval(function() {
  resource.response(function(err, res) {
    // err is returned if resource hasn't been updated since we last checked.
    if (err) return console.log(err);

    // res is returned when the resource has been updated.
    // res is the same Readable Stream you'd recieve from http.request
    var modified = new Date(res.headers['last-modified']);
    console.log('Resource updated! See: ', modified);
  });
}, 60 * 1000);
```
