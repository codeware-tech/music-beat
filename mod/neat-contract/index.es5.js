'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// throwTypeError :: String -> fn throw new TypeError
var throwTypeError = function throwTypeError(msg) {
  throw new TypeError(msg);
};

// expected :: Constructor|[Constructor] -> String
var expected = _ramda2.default.pipe(_ramda2.default.unless(_ramda2.default.is(Array), _ramda2.default.of), _ramda2.default.map(_ramda2.default.pipe(_ramda2.default.call, _ramda2.default.type)), _ramda2.default.join('|'));

// isAnyOfCtors :: Constructor|[Constructor] -> (fn -> a -> Boolean)
var isAnyOfCtors = _ramda2.default.pipe(_ramda2.default.unless(_ramda2.default.is(Array), _ramda2.default.of), _ramda2.default.map(_ramda2.default.is), _ramda2.default.anyPass);

// text :: String -> Constructor|[Constructor] -> a -> String
var text = function text(name, ctors, param) {
  return '`' + name + '` should be an `' + expected(ctors) + '`, but got `' + _ramda2.default.type(param) + '`: ' + param;
};

// contract :: String -> Constructor|[Constructor] -> a -> a|throw new TypeError
var contract = _ramda2.default.curry(function (name, ctors, param) {
  return _ramda2.default.unless(isAnyOfCtors(ctors), function () {
    return throwTypeError(text(name, ctors, param));
  })(param);
});

exports.default = contract;
module.exports = exports['default'];
