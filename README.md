# node-knock

A general purpose resource checker.

In the sane way you'd knock on a door to see who's home,
knocking on a web service to see what's shaking is equally
as desirable.

If you can ping it you can knock it.

Options:

```javascript
{
  'door': String,
  'frequency': Number,
  'retries': Number
}
```

Example:

```javascript
var Knock = require('knock')
var options = {
  'door': 'http://myresource.com/blah',
  'frequency': 1000, 60, 5,
  'retries': 5
}
var door = new Knock(options);

door.on('open', function() {
  // door has been opened
}

door.on('close', function() {
  // door has been closed
}

door.on('error', function() {
  // try again?
}

door.knock()
```
