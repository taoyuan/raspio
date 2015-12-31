"use strict";

var wpi = require('./wpi');

module.exports = SPI;

function SPI(channel, speed) {
  if (!(this instanceof SPI)) {
    return new SPI(channel, speed);
  }

  if (channel !== 0 && channel !== 1) {
    throw new Error('Invalid SPI channel "' + channel + '". Channel must be either 0 or 1');
  }

  if (typeof speed != 'number' || speed < 500000 || speed > 32000000) {
    throw new Error('Invalid SPI speed "' + speed + '". Speed must be an integer between 50,000 and 32,000,000');
  }

  this.channel = channel;

  var fd = wpi.wiringPiSPISetup(channel, speed);
  if (fd < 0) {
    throw new Error('Could not initialize SPI: Internal error ' + ffi.errno());
  }
  Object.defineProperty(this, 'fd', {
    value: fd
  });
}

SPI.prototype.transfer = function (data) {
  return wpi.wiringPiSPIDataRW(this.channel, data);
};
