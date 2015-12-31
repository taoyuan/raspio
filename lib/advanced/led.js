"use strict";

var _ = require('lodash');
var raspi = require('../raspi');

module.exports = Led;

Led.colors = {
  red: 0xFF0000,
  green: 0x00FF00,
  blue: 0x0000FF,
  yellow: 0xFFFF00,
  cyan: 0x00FFFF,
  magenta: 0xFF00FF,
  white: 0xFFFFFF,
  orange: 0xFF6000
};

_.assign(Led, Led.colors);

/**
 *
 * @param {Array|Number} pins
 * @param {Boolean|Object} [options]
 * @param {Boolean} [options.invert]
 * @param {Boolean} [options.pwm]
 * @constructor
 */
function Led(pins, options) {
  if (!(this instanceof Led)) {
    return new Led(pins, options);
  }

  if (!pins && !_.isNumber(pins)) throw new Error('`pins` is required');
  if (typeof options === 'boolean') {
    options = {invert: options};
  }
  this.options = options = options || {};

  this._pins = Array.isArray(pins) ? pins : [pins];
  this._invert = !!options.invert;

  this._ios = [];

  var that = this;
  _.forEach(this._pins, function (pin, i) {
    that._ios[i] = options.pwm ? raspi.softpwm(pin, 255, that._invert ? 255 : 0) : raspi.gpio(pin, raspi.gpio.OUTPUT);
  });

  this._dims = this._pins.length;
  this._values = [];
  this._hinterval = null;
  this._step = 0;
  // 0 ~ 100
  this._brightness = 100;
  this._resolution = 100;

}

Led.prototype.close = function () {
  this._reset();

  _.forEach(this._ios, function (io) {
    if (io.stop) io.stop();
  });
};

Led.prototype._update = function () {
  if (!this._fn) return;

  var step = this._fn(this._step);

  step = this._step = step >= this._resolution ? this._resolution - 1 : step;

  var value;
  var that = this;
  _.forEach(this._ios, function (gpio, i) {
    value = that._values[i] * step / (that._resolution - 1);
    value = Math.floor(value * that._brightness / 100);
    if (that._invert) value = 255 - value;
    gpio.write(value);
  });
};

Led.prototype._reset = function (interval, fn) {
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
Led.prototype.brightness = function (brightness) {
  if (arguments.length > 0) {
    this._brightness = brightness || 0;
  }
  this._update();
  return this._brightness;
};

Led.prototype.color = function (c) {
  for (var i = 0; i < this._dims; i++) {
    this._values[i] = (c >> ((this._dims - i - 1) * 8)) & 0xFF;
  }
};

Led.prototype.set = function (effect, color, interval) {
  if (this[effect]) {
    return this[effect](color, interval);
  }
  throw new Error('Unknown effect: ' + effect);
};


Led.prototype.light = effectify('./led/light');
Led.prototype.blink = effectify('./led/blink');
Led.prototype.fadeup = effectify('./led/fadeup');
Led.prototype.fadedown = effectify('./led/fadedown');
Led.prototype.breath = effectify('./led/breath');

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
