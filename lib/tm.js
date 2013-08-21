// Textmate theme parser

var plist = require('plist');
var _ = require('lodash');

// Map for scopes
var scopeMap = {
  color: '0.settings.color',
  background: '0.settings.background',
  cursor: '0.settings.caret',
  comment: {
    scope: 'comment'
  },
  string: {
    scope: 'string'
  },
  number: {
    scope: 'constant.numeric'
  }
};

// Get path from an object
function getPath(obj, path) {
  var parts = path.split('.');
  return _.reduce(parts, function (result, part) {
    return result[part];
  }, obj);
}


exports.parse = function (raw) {

  // Replace `foreground` with `color`.
  raw = raw.replace(/foreground/g, 'color');

  var parsedPlist = plist.parseStringSync(raw);
  var settings = parsedPlist.settings;

  var result = {};

  result.name = parsedPlist.name;
  result.scopes = {};

  _.forEach(scopeMap, function (path, scope) {
    if (_.isObject(path)) {
      var val = _(settings).find({scope: path.scope});
      if (val) {
        return result.scopes[scope] = val.settings;
      }

    }
    result.scopes[scope] = getPath(settings, path);
  });


  return result;

};