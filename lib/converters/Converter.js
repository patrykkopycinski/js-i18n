'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Converter = function () {
  function Converter() {
    _classCallCheck(this, Converter);
  }

  _createClass(Converter, [{
    key: 'valueToString',
    value: function valueToString() {
      throw new Error('not implemented yet');
    }
  }, {
    key: 'stringToValue',
    value: function stringToValue() {
      throw new Error('not implemented yet');
    }
  }]);

  return Converter;
}();

exports.default = Converter;