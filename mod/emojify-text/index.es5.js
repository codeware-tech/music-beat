'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ramda = require('ramda');

var _neatContract = require('neat-contract');

var _neatContract2 = _interopRequireDefault(_neatContract);

var _characters = require('./characters');

var _characters2 = _interopRequireDefault(_characters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert boring text to wonderful emojis.
 *
 * @param  {String}  background              Character to print as background
 * @param  {String}  foreground              Character to print as foreground
 * @param  {String}  bg                      Alias for background
 * @param  {String}  fg                      Alias for foreground
 * @param  {JSON}    [dictionary=characters] Custom dictionary for rendering
 * @param  {Boolean} [row=false]             Print in single row or not
 * @param  {String}  text                    Text to process through transformer
 * @return {String}                          The result of processing
 */
function emojifyText(_ref, input) {
  var bg = _ref.bg;
  var fg = _ref.fg;
  var background = _ref.background;
  var foreground = _ref.foreground;
  var _ref$dictionary = _ref.dictionary;
  var dictionary = _ref$dictionary === undefined ? _characters2.default : _ref$dictionary;
  var _ref$row = _ref.row;
  var row = _ref$row === undefined ? false : _ref$row;

  return (0, _ramda.pipe)((0, _neatContract2.default)('input', String), _ramda.toUpper, (0, _ramda.split)(''), (0, _ramda.map)((0, _ramda.ifElse)((0, _ramda.has)(_ramda.__, dictionary), (0, _ramda.prop)(_ramda.__, dictionary), (0, _ramda.always)((0, _ramda.defaultTo)([], dictionary.nochar)))), (0, _ramda.map)((0, _ramda.map)((0, _ramda.join)(''))), (0, _ramda.ifElse)((0, _ramda.always)(row), (0, _ramda.pipe)((0, _ramda.transpose)(), (0, _ramda.map)((0, _ramda.join)(''))), (0, _ramda.map)((0, _ramda.join)('\n'))), (0, _ramda.join)('\n'), (0, _ramda.replace)(/0/g, (0, _ramda.defaultTo)((0, _ramda.defaultTo)('0', bg), background)), (0, _ramda.replace)(/1/g, (0, _ramda.defaultTo)((0, _ramda.defaultTo)('1', fg), foreground)))(input);
}

exports.default = (0, _ramda.curry)(emojifyText);
module.exports = exports['default'];
