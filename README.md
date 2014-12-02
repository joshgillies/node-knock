# Knoq

A general purpose continuous web resource checker.

With Knoq in the same way you'd knock on a door
to see who's home you can Knoq a web resource to
see what's shaking.

# Example

```javascript
var Knoq = require('knoq');
var resource = Knoq('http://www.google.com/');

resource.on('response', function(res) {
  console.log('EventEmitter');
  console.log(res.statusCode);
  mountain.end();
});

resource.on('end', function() {
  console.log('ended!');
});
```

# Install

`npm install knoq`

# License

MIT
