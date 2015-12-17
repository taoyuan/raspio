"use strict";

var _ = require('lodash');

var wpi = require('./wpi');

var blink = require('./leds/blink');

module.exports = LED;

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
  this._current = [];
  this._hinterval = null;
  this._step = 0;

  this._resolution = 100;
}

LED.prototype.isOpen = function () {
  return this._opened;
};

LED.prototype.open = function () {
  if (this._opened) return;

  _.forEach(this._pins, function (pin) {
    wpi.softPwmCreate(pin, 0, 255);
  });

  this._opened = true;
};

LED.prototype.close = function () {
  if (!this._opened) return;

  this.reset();

  _.forEach(this._pins, function (pin) {
    wpi.softPwmStop(pin);
  });

  this._opened = false;
};

LED.prototype._update = function () {
  if (!this._opened) return;

  var step = this._fn(this._step);

  step = this._step = step > this._resolution ? this._resolution : step;

  var resolution = this._resolution;
  var values = this._values;
  _.forEach(this._pins, function (pin, i) {
    wpi.softPwmWrite(pin, Math.floor(values[i] * step / (resolution - 1)));
  });
};

LED.prototype.reset = function (interval, fn) {
  if (this._hinterval) {
    clearInterval(this._hinterval);
    this._hinterval = null;
  }

  if (interval && this.isOpen()) {
    var that = this;
    this._fn = fn;
    this._hinterval = setInterval(function () {
      that._update();
    }, interval);
  }
};

LED.prototype.setColor = function (c) {
  for (var i = 0; i < this._dims; i++) {
    this._values[i] = (c >> ((this._dims - i - 1) * 8)) & 0xFF;
  }
};

LED.prototype.blink = function (color, interval) {
  if (!this.isOpen()) this.open();
  this.setColor(color);
  this.reset(blink(this._resolution), interval);
};
