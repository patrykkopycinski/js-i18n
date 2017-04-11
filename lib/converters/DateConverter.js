'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ERROR_CODE = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Converter2 = require('./Converter');

var _Converter3 = _interopRequireDefault(_Converter2);

var _ParseError = require('./ParseError');

var _ParseError2 = _interopRequireDefault(_ParseError);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ERROR_CODE = exports.ERROR_CODE = 'error.parse.date';

var DateConverter = function (_Converter) {
  _inherits(DateConverter, _Converter);

  function DateConverter() {
    var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var locale = arguments[1];

    _classCallCheck(this, DateConverter);

    var _this = _possibleConstructorReturn(this, (DateConverter.__proto__ || Object.getPrototypeOf(DateConverter)).call(this));

    _this.momentFormat = (0, _moment2.default)().format(format);
    _this.locale = locale;
    return _this;
  }

  _createClass(DateConverter, [{
    key: 'valueToString',
    value: function valueToString(value) {
      if (value) {
        var m = (0, _moment2.default)(value);
        if (this.locale) {
          m = m.locale(this.locale);
        }

        return m.format(this.momentFormat);
      }

      return '';
    }
  }, {
    key: 'stringToValue',
    value: function stringToValue(val) {
      var stringValue = val || null;
      if (stringValue === null) {
        return null;
      }

      var result = (0, _moment2.default)(stringValue, this.momentFormat, true);
      if (!result.isValid()) {
        throw new _ParseError2.default(ERROR_CODE, { value: stringValue });
      }

      return result.toDate();
    }
  }]);

  return DateConverter;
}(_Converter3.default);

exports.default = DateConverter;