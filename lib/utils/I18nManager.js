'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isString2 = require('lodash/isString');

var _isString3 = _interopRequireDefault(_isString2);

var _indexOf2 = require('lodash/indexOf');

var _indexOf3 = _interopRequireDefault(_indexOf2);

var _find2 = require('lodash/find');

var _find3 = _interopRequireDefault(_find2);

var _union2 = require('lodash/union');

var _union3 = _interopRequireDefault(_union2);

var _extend2 = require('lodash/extend');

var _extend3 = _interopRequireDefault(_extend2);

var _findIndex2 = require('lodash/findIndex');

var _findIndex3 = _interopRequireDefault(_findIndex2);

var _isObject2 = require('lodash/isObject');

var _isObject3 = _interopRequireDefault(_isObject2);

var _mergeWith2 = require('lodash/mergeWith');

var _mergeWith3 = _interopRequireDefault(_mergeWith2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _converters = require('../converters');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var deepMerge = function deepMerge(object, source) {
  return (0, _mergeWith3.default)(object, source, function (objValue, srcValue) {
    if ((0, _isObject3.default)(objValue) && srcValue) {
      return deepMerge(objValue, srcValue);
    }
    return undefined;
  });
};

/**
 * Performs initialization and handling of intl data.
 * It supports intl data in React Intl format.
 *
 * @author Alexander Frolov
 */

var I18nManager = function () {
  /**
   * Creates and initialize new manager instance.
   * Where:
   *- locale is current locale
   *- intDatas is an list with messages for different locales.
   *- formatInfos is format pattern data
   *- defaultLocale - fallback locale, 'en' by default
   * (see React Intl Data format)
   */
  function I18nManager(locale, intlDatas) {
    var formatInfos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var defaultLocale = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'en';

    _classCallCheck(this, I18nManager);

    _initialiseProps.call(this);

    this._intlData = { locales: [locale], messages: {} };

    this._intlDatas = [this._intlData];
    this._components = [];

    // current locale
    this.locale = locale;
    this.defaultLocale = defaultLocale;
    if (intlDatas) {
      this.register('default', intlDatas);
    }

    this._formatInfos = formatInfos;
    if (formatInfos && formatInfos[locale]) {
      this._formatInfo = formatInfos[locale];
    } else {
      this._formatInfo = _constants.DEFAULT_FORMAT_INFO;
    }

    var numberGroupingSeparator = null;
    if (this._formatInfo.numberGroupingSeparatorUse) {
      numberGroupingSeparator = this._formatInfo.numberGroupingSeparator;
    }

    this._dateConverter = new _converters.DateConverter(this._formatInfo.datePattern);
    this._dateTimeConverter = new _converters.DateConverter(this._formatInfo.dateTimePattern);
    this._decimalNumberConverter = new _converters.NumberConverter(this._formatInfo.numberPattern, numberGroupingSeparator, this._formatInfo.numberDecimalSeparator, this._formatInfo.numberDecimalSeparatorUseAlways);
    this._numberConverter = new _converters.NumberConverter(this._formatInfo.integerPattern, numberGroupingSeparator, this._formatInfo.numberDecimalSeparator, this._formatInfo.numberDecimalSeparatorUseAlways);
  }

  _createClass(I18nManager, [{
    key: '_getMessageBundleForLocale',


    /**
    * Searches for a budle that locales collection containes argument-locale
    */
    value: function _getMessageBundleForLocale(locale) {
      return (0, _find3.default)(this._intlDatas, function (storedIntlData) {
        return (0, _indexOf3.default)(storedIntlData.locales, locale) !== -1;
      });
    }

    /**
    * Returns fallback locale with the next logic: fr-FR->fr->en
    */

  }, {
    key: '_getFallbackLocale',
    value: function _getFallbackLocale() {
      if (this.locale.indexOf('-') !== -1) {
        return this.locale.substring(0, this.locale.indexOf('-'));
      }

      return this.defaultLocale;
    }
  }, {
    key: 'dateFormat',
    get: function get() {
      return this._formatInfo.datePattern;
    }
  }]);

  return I18nManager;
}();

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  this.register = function (component, intlDatas) {
    if (_this._components.indexOf(component) < 0) {
      // function to check if locales have common elements
      var intersects = function intersects(l1, l2) {
        for (var i = 0; i < l1.length; i++) {
          if (l2.indexOf(l1[i]) >= 0) {
            return true;
          }
        }
        return false;
      };

      var that = _this;

      // processing collection of bundle arguments:
      // in the next commnts 'bundle' means js object with the next notation:
      // {locales: [], messages: {}}
      intlDatas.forEach(function (intlData) {
        // searching for already existing bundle with 'similliar' locale collection
        var indexToExtend = (0, _findIndex3.default)(that._intlDatas, function (storedIntlData) {
          return intersects(storedIntlData.locales, intlData.locales);
        });

        // if we find bundle with locales that intersect with the exteernal one
        // we merge merge map of their messages and unite locales-collections
        if (indexToExtend !== -1) {
          that._intlDatas[indexToExtend] = (0, _extend3.default)({}, { locales: (0, _union3.default)(that._intlDatas[indexToExtend].locales, intlData.locales) }, {
            messages: deepMerge(that._intlDatas[indexToExtend].messages, intlData.messages)
          });
        } else {
          // otherwise we save this bundle to the internal collection of bundles
          that._intlDatas.push(intlData);
        }
      });
      _this._intlData = _this._getMessageBundleForLocale(_this.locale);
      _this._components.push(component);
    }

    return _this;
  };

  this.getMessage = function (path) {
    var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var messages = _this._intlData.messages;
    var pathParts = path.split('.');

    var message = undefined;
    try {
      message = pathParts.reduce(function (obj, pathPart) {
        return obj[pathPart];
      }, messages);
    } catch (e) {
      // ignore and go next
    }
    if (message === undefined) {
      try {
        message = pathParts.reduce(function (obj, pathPart) {
          return obj[pathPart];
        }, _this._getMessageBundleForLocale(_this._getFallbackLocale()).messages);
      } catch (e) {
        // ignore and go next
      }
    }
    if (message === undefined) {
      try {
        message = pathParts.reduce(function (obj, pathPart) {
          return obj[pathPart];
        }, _this._getMessageBundleForLocale(_this.defaultLocale).messages);
      } catch (eee) {
        // ignore and go next
      }
    }
    if (message === undefined) {
      message = path;
    }

    // this check covers use case of object message,
    // f.e. message === { test: 'test component', format: 'min={min}, max={max}' }
    if (!(0, _isString3.default)(message)) {
      return path;
    }

    Object.keys(args).forEach(function (param) {
      var paramValue = args[param];

      if (paramValue !== null && paramValue !== undefined) {
        message = message.replace(new RegExp('{' + param + '}', 'g'), paramValue.toString());
      }
    });
    return message;
  };

  this.formatDate = function (date) {
    return _this._dateConverter.valueToString(date);
  };

  this.formatDateTime = function (date) {
    return _this._dateTimeConverter.valueToString(date);
  };

  this.formatDecimalNumber = function (number) {
    return _this._decimalNumberConverter.valueToString(number);
  };

  this.formatNumber = function (number) {
    return _this._numberConverter.valueToString(number);
  };

  this.parseDate = function (string) {
    return _this._dateConverter.stringToValue(string);
  };

  this.parseDecimalNumber = function (string) {
    return _this._decimalNumberConverter.stringToValue(string);
  };

  this.parseNumber = function (string) {
    return _this._numberConverter.stringToValue(string);
  };
};

exports.default = I18nManager;