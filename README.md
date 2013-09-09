# node-knock

A general purpose resource checker.

Options:

```
{
  'door': String,
  'frequency': Number,
  'retries': Number
}
```

Example:

```
var Knock = require('knock')
var options = {
  'door': 'http://myresource.com/blah,
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
