"use strict";

var wpi = require('./wpi');

module.exports = SoftPWM;

function SoftPWM(pin, initial, range) {
  if (!(this instanceof SoftPWM)) {
    return new SoftPWM(pin, initial, range);
  }

  if (typeof range != 'number' || range <= 0) {
    throw new Error('Invalid SoftPWM range "' + range + '". Range must be a number greater than 0');
  }

  this.pin = pin;
  this.initial = initial;
  this.range = range;

  wpi.softPwmCreate(pin, initial, range);
}

SoftPWM.prototype.write = function (value) {
  if (typeof value != 'number' || value < 0 || value > this.range) {
    throw new Error('Invalid value "' + value + '". Vale must be a number greater than 0 and less than ' + this.range);
  }
  wpi.softPwmWrite(this.pin, value);
};

SoftPWM.prototype.stop = function () {
  wpi.softPwmStop(this.pin);
};
