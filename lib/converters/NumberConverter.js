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

var _AccuracyError = require('./AccuracyError');

var _AccuracyError2 = _interopRequireDefault(_AccuracyError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ERROR_CODE = exports.ERROR_CODE = 'error.parse.number';

var floatNumberReg = /^-?\d+\.?\d*$/;
var intNumberReg = /^-?\d+$/;
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;

var NumberConverter = function (_Converter) {
  _inherits(NumberConverter, _Converter);

  function NumberConverter(format, groupSep, decSep, decSepUseAlways) {
    _classCallCheck(this, NumberConverter);

    var _this = _possibleConstructorReturn(this, (NumberConverter.__proto__ || Object.getPrototypeOf(NumberConverter)).call(this));

    _this._format = format;
    _this._groupSep = groupSep;
    _this._decSep = decSep;
    _this._decSepUseAlways = decSepUseAlways || false;

    if (format.lastIndexOf('.') !== -1) {
      _this._integerFormat = format.substring(0, format.indexOf('.'));
      _this._decimalFormat = format.substring(format.indexOf('.') + 1);
    } else {
      _this._integerFormat = format;
      _this._decimalFormat = '';
    }
    return _this;
  }

  _createClass(NumberConverter, [{
    key: '_validateStringIfItIsANumber',
    value: function _validateStringIfItIsANumber(value) {
      var stringValue = value;
      if (this._groupSep) {
        stringValue = stringValue.replace(new RegExp('\\' + this._groupSep, 'g'), '');
      }

      if (this._decSep !== undefined) {
        stringValue = stringValue.replace(this._decSep, '.');
      }

      if (this._format.indexOf('.') !== -1) {
        if (!floatNumberReg.test(stringValue)) {
          throw new _ParseError2.default(ERROR_CODE, { value: value });
        }
      } else {
        if (!intNumberReg.test(stringValue)) {
          throw new _ParseError2.default(ERROR_CODE, { value: value });
        }
      }
    }
  }, {
    key: '_parseFractionalPart',
    value: function _parseFractionalPart(number) {
      // nothing to format
      if (this._decimalFormat === '') {
        return '';
      }

      var fractionalPartString = number.toString().split('.')[1] || '';

      var result = '';
      for (var i = 0; i < this._decimalFormat.length; i++) {
        var currentDigit = fractionalPartString.charAt(i);
        if (this._decimalFormat.charAt(i) === '0') {
          // char does not exist
          if (currentDigit === '') {
            // add 0 anyway
            result = result + '0';
          } else {
            result = '' + result + currentDigit;
          }
        } else {
          // # is found in the pattern
          var leftOptionalDigitsAmount = this._decimalFormat.length - i;
          // take all left digits statring from i index but not more that amount of characters left in format
          result = '' + result + fractionalPartString.substr(i, leftOptionalDigitsAmount);
          break;
        }
      }

      return result;
    }
  }, {
    key: '_parseIntegerPart',
    value: function _parseIntegerPart(number) {
      var integerNumber = number;
      // if there is not decimal separator in the format, then we round the value
      // like if it done in DecimalFormat, see https://docs.oracle.com/javase/7/docs/api/java/text/DecimalFormat.html
      if (this._format.indexOf('.') === -1) {
        integerNumber = Math.round(integerNumber);
      }

      // cut fractional part
      integerNumber = integerNumber > 0 ? Math.floor(integerNumber) : Math.ceil(integerNumber);

      if (this._integerFormat.charAt(this._integerFormat.length - 1) === '#' && integerNumber === 0) {
        return 0;
      }

      var result = '';

      // convert number ot a string and cut - sign if any
      var integerPartWithoutSign = Math.abs(integerNumber).toString();

      // find how many digits are in the group
      var groupLength = 9999;
      var groupSeparatorIndexInFormat = this._integerFormat.lastIndexOf(',');
      if (groupSeparatorIndexInFormat !== -1) {
        groupLength = this._integerFormat.length - groupSeparatorIndexInFormat - 1;
      }

      var groupCount = 0;
      for (var k = integerPartWithoutSign.length - 1; k >= 0; k--) {
        result = integerPartWithoutSign.charAt(k) + result;
        groupCount++;
        if (groupCount === groupLength && k !== 0) {
          result = (this._groupSep || '') + result;
          groupCount = 0;
        }
      }

      // account for any pre-data 0's
      if (this._integerFormat.length > result.length) {
        var padStart = this._integerFormat.indexOf('0');
        if (padStart !== -1) {
          var padLen = this._integerFormat.length - padStart;

          // pad to left with 0's
          while (result.length < padLen) {
            result = '0' + result;
          }
        }
      }

      return result;
    }
  }, {
    key: 'valueToString',
    value: function valueToString(number) {
      // null -> null is returned
      if (number === null) {
        return null;
      }

      // throw TypeError if value is not a number
      if (typeof number !== 'number') {
        throw TypeError('\'' + number + '\' is not a Number!');
      }

      // validate integer number
      var isInteger = number.toString().indexOf('.') === -1;
      if (isInteger) {
        if (Math.abs(number) > MAX_SAFE_INTEGER) {
          throw new _AccuracyError2.default(ERROR_CODE, { value: number });
        }
      }

      // parse integrer and fractional part separately
      var integerPartString = this._parseIntegerPart(number);
      var fractionalPartString = this._parseFractionalPart(number);

      // setup decimal separator if it is needed
      var decimalSeparator = '';
      if (fractionalPartString !== '' || this._decSepUseAlways) {
        decimalSeparator = this._decSep;
      }
      // setup negative sign
      var minusSign = '';
      if (number < 0) {
        minusSign = '-';
      }

      return minusSign + integerPartString + decimalSeparator + fractionalPartString;
    }
  }, {
    key: 'stringToValue',
    value: function stringToValue(string) {
      if (string === null) {
        return null;
      }

      if (typeof string !== 'string') {
        throw TypeError('\'' + string + '\' is not a String!');
      }

      this._validateStringIfItIsANumber(string);

      // removing decimal and grouping separator
      var stringValue = string;
      if (this._groupSep) {
        while (stringValue.indexOf(this._groupSep) > -1) {
          stringValue = stringValue.replace(this._groupSep, '');
        }
      }
      stringValue = stringValue.replace(this._decSep, '.');
      // converting to number
      return parseFloat(stringValue);
    }
  }]);

  return NumberConverter;
}(_Converter3.default);

exports.default = NumberConverter;