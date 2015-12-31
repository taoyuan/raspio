"use strict";

var wpi = exports.wpi = require('./wpi');

// Low Level IOs
exports.gpio = exports.GPIO = require('./gpio');
exports.i2c = exports.I2C = require('./i2c');
exports.pwm = exports.PWM = require('./pwm');
exports.softpwm = exports.SoftPWM = require('./soft-pwm');
exports.spi = exports.SPI = require('./spi');
exports.uart = exports.UART = require('./uart');

exports.getBoardRev = function getBoardRev() {
  return wpi.piBoardRev();
};

// Advanced Level IOs
exports.led = exports.Led = require('./advanced/led');
exports.button = exports.Button = require('./advanced/button');
exports.digital = exports.Digital = require('./advanced/digital');
