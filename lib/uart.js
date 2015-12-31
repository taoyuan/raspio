"use strict";

var wpi = require('./wpi');

module.exports = UART;

function UART(device, baud) {
  if (!(this instanceof UART)) {
    return new UART(device, baud);
  }

  if (typeof device != 'string') {
    throw new Error('Invalid UART device "' + device + '". Device must be a string');
  }

  if (typeof baud != 'number' || baud <= 0) {
    throw new Error('Invalid SPI speed "' + baud + '". Speed must be a positive integer');
  }

  this.device = device;
  this.baud = baud;

  var fd = wpi.serialOpen(device, baud);
  if (fd < 0) {
    throw new Error('Could not initialize UART: Internal error ' + ffi.errno());
  }

  Object.defineProperty(this, 'fd', {
    value: fd
  });
}

UART.prototype.write = function write(data) {
  if (typeof data != 'string') {
    throw new Error('Invalid write data "' + data + '". Data must be a string');
  }
  wpi.serialPuts(this.fd, data);
};

UART.prototype.dataAvailable = function dataAvailable() {
  var result = wpi.serialDataAvail(this.fd);
  if (result < 0) {
    throw new Error('Could not get the amount of data available from UART: Internal error ' + ffi.errno());
  }
  return result;
};

UART.prototype.getCharacter = function getCharacter() {
  var result = wpi.serialGetchar(this.fd);
  if (result < 0) {
    throw new Error('Could not read from UART: Internal error ' + ffi.errno());
  }
  return result;
};

UART.prototype.flush = function flush() {
  wpi.serialFlush();
};
