"use strict";

var wpi = require('./wpi');

module.exports = PWM;

function PWM(pin) {
  if (!(this instanceof PWM)) {
    return new PWM(pin);
  }

  // check pin
  this.pin = pin || 1;

  wpi.pinMode(pin, wpi.PWM_OUTPUT);
}

PWM.setMode = function setMode(mode) {
  if (mode != PWM.PWM_MODE_MS && mode != PWM.PWM_MODE_BAL) {
    throw new Error('Invalid PWM mode "' + mode + '". Mode must be raspi.constants.PWM_MODE_MS or raspi.constants.PWM_MODE_BAL');
  }
  wpi.pwmSetMode(mode);
};

PWM.setRange = function setRange(range) {
  if (typeof range != 'number' || range <= 0) {
    throw new Error('Invalid PWM range "' + range + '". Range must be a number greater than 0');
  }
  wpi.pwmSetRange(range);
};

PWM.setClockDivisor = function setClockDivisor(divisor) {
  if (typeof divisor != 'number' || divisor < 0) {
    throw new Error('Invalid PWM divisor "' + divisor + '". Divisor must a non-negative number');
  }
  wpi.pwmSetClock(divisor);
};

PWM.PWM_MODE_MS = wpi.PWM_MODE_MS;
PWM.PWM_MODE_BAL = wpi.PWM_MODE_BAL;

PWM.prototype.write = function write(value) {
  if (typeof value != 'number') {
    throw new Error('Invalid PWM write value "' + value + '". Value must be a number');
  }
  wpi.pwmWrite(this.pin, value);
};
