"use strict";

var _ = require('lodash');
var GPIO = require('pigpio').Gpio;

module.exports = LED;

LED.colors = {
  red: 0xFF0000,
  green: 0x00FF00,
  blue: 0x0000FF,
  yellow: 0xFFFF00,
  cyan: 0x00FFFF,
  magenta: 0xFF00FF,
  white: 0xFFFFFF,
  orange: 0xFF6000
};

_.assign(LED, LED.colors);

/**
 *
 * @param {Array|Number} pins
 * @param {Boolean} [invert]
 * @constructor
 */
function LED(pins, invert) {
  if (!(this instanceof LED)) {
    return new LED(pins, invert);
  }
  if (!pins && !_.isNumber(pins)) throw new Error('`pins` is required');

  this._pins = Array.isArray(pins) ? pins : [pins];
  this._invert = !!invert;


  this._ios = [];
  var that = this;
  _.forEach(this._pins, function (pin, i) {
    that._ios[i] = new GPIO(pin);
  });

  this._dims = this._pins.length;
  this._values = [];
  this._hinterval = null;
  this._step = 0;
  // 0 ~ 100
  this._brightness = 100;
  this._resolution = 100;

  var value = this._invert ? 255 : 0;
  _.forEach(this._ios, function (gpio) {
    gpio.mode(GPIO.OUTPUT);
    gpio.pwmRange(255);
    gpio.pwmWrite(value);
  });
}

LED.prototype.close = function () {
  this.color(0);
  this._reset();
};

LED.prototype._update = function () {
  if (!this._fn) return;

  var step = this._fn(this._step);

  step = this._step = step >= this._resolution ? this._resolution - 1 : step;

  var value;
  var that = this;
  _.forEach(this._ios, function (gpio, i) {
    value = that._values[i] * step / (that._resolution - 1);
    value = Math.floor(value * that._brightness / 100);
    if (that._invert) value = 255 - value;
    gpio.pwmWrite(value);
    //wpi.softPwmWrite(pin, value);
  });
};

LED.prototype._reset = function (interval, fn) {
  if (this._hinterval) {
    clearInterval(this._hinterval);
    this._hinterval = null;
  }

  this._fn = fn;
  this._update();

  if (interval) {
    var that = this;
    this._hinterval = setInterval(function () {
      that._update();
    }, interval);
  }
};

/**
 *
 * @param brightness 0 ~ 100
 */
LED.prototype.brightness = function (brightness) {
  if (arguments.length > 0) {
    this._brightness = brightness || 0;
  }
  this._update();
  return this._brightness;
};

LED.prototype.color = function (c) {
  for (var i = 0; i < this._dims; i++) {
    this._values[i] = (c >> ((this._dims - i - 1) * 8)) & 0xFF;
  }
};

LED.prototype.set = function (effect, color, interval) {
  if (this[effect]) {
    return this[effect](color, interval);
  }
  throw new Error('Unknown effect: ' + effect);
};


LED.prototype.light = effectify('./leds/light');
LED.prototype.blink = effectify('./leds/blink');
LED.prototype.fadeup = effectify('./leds/fadeup');
LED.prototype.fadedown = effectify('./leds/fadedown');
LED.prototype.breath = effectify('./leds/breath');

/**
 *
 * @param fn
 * @returns {Function}
 */
function effectify(fn) {
  if (typeof fn === 'string') {
    fn = require(fn);
  }

  return function (color, interval) {
    color = color || 0;

    this.color(color);
    this._reset(interval, fn(this._resolution));
  }
}
