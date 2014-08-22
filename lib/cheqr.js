var curli = require('curli');

function cheqr(callback) {
  var self = this;

  curli(self.options, function(err, headers) {
    if (err) return callback(err);
    var modified = new Date(headers['last-modified']);
    if (self.lastmodified < modified) {
      self.lastmodified = modified;
      return callback(null);
    }

    return callback(new Error('resource not updated'));
  });
}

module.exports = cheqr;
