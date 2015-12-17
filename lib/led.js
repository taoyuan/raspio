"use strict";

var _ = require('lodash');
var wpi = require('./wpi');

module.exports = LED;

LED.red = 0xFF0000;
LED.green = 0x00FF00;
LED.blue = 0x0000FF;
LED.yello = 0xFFFF00;
LED.cyan = 0x00FFFF;
LED.magenta = 0xFF00FF;
LED.white = 0xFFFFFF;
LED.orange = 0xFF6000;

/**
 *
 * @param {Array|Number} pins
 * @param {Boolean} [invert]
 * @constructor
 */
function LED(pins, invert) {
  if (!pins && !_.isNumber(pins)) throw new Error('`pins` is required');

  this._pins = Array.isArray(pins) ? pins : [pins];
  this._invert = !!invert;

  this._dims = this._pins.length;
  this._values = [];
  this._hinterval = null;
  this._step = 0;
  // 0 ~ 100
  this._brightness = 100;
  this._resolution = 100;
}

LED.prototype.isOpen = function () {
  return this._opened;
};

LED.prototype.open = function () {
  if (this._opened) return;

  var value = this._invert ? 255 : 0;
  _.forEach(this._pins, function (pin) {
    wpi.softPwmCreate(pin, value, 255);
  });

  this._opened = true;
};

LED.prototype.close = function () {
  if (!this._opened) return;

  this.light(0);

  this._reset();

  _.forEach(this._pins, function (pin) {
    wpi.softPwmStop(pin);
  });

  this._opened = false;
};

LED.prototype._update = function () {
  if (!this._opened) return;

  var step = this._fn(this._step);

  step = this._step = step >= this._resolution ? this._resolution - 1 : step;

  var value;
  var that = this;
  _.forEach(this._pins, function (pin, i) {
    value = that._values[i] * step / (that._resolution - 1);
    value = Math.floor(value * that._brightness / 100);
    if (that._invert) value = 255 - value;
    wpi.softPwmWrite(pin, value);
  });
};

LED.prototype._reset = function (interval, fn) {
  if (this._hinterval) {
    clearInterval(this._hinterval);
    this._hinterval = null;
  }

  if (interval && this.isOpen()) {
    var that = this;
    this._fn = fn;

    that._update();
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
  return this._brightness;
};

LED.prototype.color = function (c) {
  for (var i = 0; i < this._dims; i++) {
    this._values[i] = (c >> ((this._dims - i - 1) * 8)) & 0xFF;
  }
};

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
    if (!this.isOpen()) this.open();

    color = color || 0xFFFFFF;
    interval = interval || 1000;

    this.color(color);
    this._reset(interval, fn(this._resolution));
  }
}

LED.prototype.light = effectify('./leds/light');
LED.prototype.blink = effectify('./leds/blink');
LED.prototype.fadeup = effectify('./leds/fadeup');
LED.prototype.fadedown = effectify('./leds/fadedown');
LED.prototype.breath = effectify('./leds/breath');
