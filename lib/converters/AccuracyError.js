'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function AccuracyError(errorCode, errorArgs) {
  Error.call(this);
  this.name = 'AccuracyError';
  this.errorCode = errorCode;
  this.errorArgs = errorArgs;
  this.message = 'length of [' + errorArgs.value + '] number is too big. Accuracy not guaranted.';
}

exports.default = AccuracyError;


AccuracyError.prototype = Object.create(Error.prototype);