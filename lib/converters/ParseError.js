'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function ParseError(errorCode, errorArgs) {
  Error.call(this);
  this.name = 'ParseError';
  this.errorCode = errorCode;
  this.errorArgs = errorArgs;
  this.message = 'invalid parsed value [' + errorArgs.value + ']';
}

exports.default = ParseError;


ParseError.prototype = Object.create(Error.prototype);