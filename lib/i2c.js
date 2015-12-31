"use strict";

var wpi = require('./wpi');

module.exports = I2C;

function I2C(address) {
  if (!(this instanceof I2C)) {
    return new I2C(address);
  }

  if (typeof address != 'number') {
    throw new Error('Invalid I2C address "' + address + '". Addresses must be a number');
  }
  var fd = wpi.wiringPiI2CSetup(address);
  if (fd < 0) {
    throw new Error('Could not initialize I2C: Internal error ' + ffi.errno());
  }
  Object.defineProperty(this, 'fd', {
    value: fd
  });
}

I2C.prototype.read = function read() {
  var result = wpi.wiringPiI2CRead(this.fd);
  if (result < 0) {
    throw new Error('Could not read from I2C: Internal error ' + ffi.errno());
  }
  return result;
};

I2C.prototype.write = function write(data) {
  if (typeof data != 'number') {
    throw new Error('Invalid write data "' + data + '". Data must be a number');
  }
  if (wpi.wiringPiI2CWrite(this.fd, data) < 0) {
    throw new Error('Could not write to I2C: Internal error ' + ffi.errno());
  }
};

I2C.prototype.writeReg8 = function writeReg8(register, data) {
  if (typeof register != 'number' || register < 0) {
    throw new Error('Invalid write register "' + data + '". Register must be a non-negative number');
  }
  if (typeof data != 'number') {
    throw new Error('Invalid write data "' + data + '". Data must be a number');
  }
  if (wpi.wiringPiI2CWriteReg8(this.fd, register, data) < 0) {
    throw new Error('Could not write to I2C: Internal error ' + ffi.errno());
  }
};

I2C.prototype.writeReg16 = function writeReg16(register, data) {
  if (typeof register != 'number' || register < 0) {
    throw new Error('Invalid write register "' + data + '". Register must be a non-negative number');
  }
  if (typeof data != 'number') {
    throw new Error('Invalid write data "' + data + '". Data must be a number');
  }
  if (wpi.wiringPiI2CWriteReg16(this.fd, register, data) < 0) {
    throw new Error('Could not write to I2C: Internal error ' + ffi.errno());
  }
};

I2C.prototype.readReg8 = function readReg8(register) {
  if (typeof register != 'number' || register < 0) {
    throw new Error('Invalid read register "' + register + '". Register must be a non-negative number');
  }
  var result = wpi.wiringPiI2CReadReg8(this.fd, register);
  if (result < 0) {
    throw new Error('Could not read from I2C: Internal error ' + ffi.errno());
  }
  return result;
};

I2C.prototype.readReg16 = function readReg8(register) {
  if (typeof register != 'number' || register < 0) {
    throw new Error('Invalid read register "' + register + '". Register must be a non-negative number');
  }
  var result = wpi.wiringPiI2CReadReg16(this.fd, register);
  if (result < 0) {
    throw new Error('Could not read from I2C: Internal error ' + ffi.errno());
  }
  return result;
};
