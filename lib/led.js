"use strict";

const _ = require('lodash');
const PWM = require('./pwm');

class Led {

  /**
   *
   * @param {Array|Number} pins
   * @param {Boolean|Object} [options]
   * @param {String} [options.uri]
   * @param {Boolean} [options.invert]
   * @param {Boolean} [options.pwm]
   * @constructor
   */
  constructor(pins, options) {
    if (!(this instanceof Led)) {
      return new Led(pins, options);
    }

    if (!pins && !_.isNumber(pins)) {
      throw new Error('`pins` is required');
    }
    if (typeof options === 'boolean') {
      options = {invert: options};
    }
    this.options = options = options || {};

    this._pins = Array.isArray(pins) ? pins : [pins];
    this._invert = !!options.invert;

    this._gpios = _.map(this._pins, pin => new PWM(pin, {range: 255}));

    this._dims = this._pins.length;
    this._values = [];
    this._hinterval = null;
    this._step = 0;
    // 0 ~ 100
    this._brightness = 100;
    this._resolution = 100;

    this.light = effectify('./effects/light');
    this.blink = effectify('./effects/blink');
    this.fadeup = effectify('./effects/fadeup');
    this.fadedown = effectify('./effects/fadedown');
    this.breath = effectify('./effects/breath');
  }

  close() {
    this._reset();
    _.forEach(this._gpios, gpio => gpio.closeSync());
  };

  _update() {
    if (!this._fn) return;

    let step = this._fn(this._step);

    step = this._step = step >= this._resolution ? this._resolution - 1 : step;

    let value;
    for (let i = 0; i < this._gpios.length; i++) {
      const gpio = this._gpios[i];
      value = this._values[i] * step / (this._resolution - 1);
      value = Math.floor(value * this._brightness / 100);
      if (this._invert) value = 255 - value;
      gpio.writeSync(value);
    }
  };

  _reset(interval, fn) {
    if (this._hinterval) {
      clearInterval(this._hinterval);
      this._hinterval = null;
    }

    this._fn = fn;
    this._update();

    if (interval) {
      this._hinterval = setInterval(async () => await this._update(), interval);
    }
  };

  /**
   *
   * @param brightness 0 ~ 100
   */
  brightness(brightness) {
    if (arguments.length > 0) {
      this._brightness = brightness || 0;
    }
    this._update();
    return this._brightness;
  };

  color(c) {
    for (let i = 0; i < this._dims; i++) {
      this._values[i] = c ? (c >> ((this._dims - i - 1) * 8)) & 0xFF : 0;
    }
  };

  set(effect, color, interval) {
    if (this[effect]) {
      return this[effect](color, interval);
    }
    throw new Error('Unknown effect: ' + effect);
  };
}

module.exports = Led;

Led.colors = {
  black: 0x000000,
  red: 0xFF0000,
  green: 0x00FF00,
  blue: 0x0000FF,
  yellow: 0xFFFF00,
  cyan: 0x00FFFF,
  magenta: 0xFF00FF,
  orange: 0xFF6000,
  white: 0xFFFFFF
};

Led.black = Led.colors.black;
Led.red = Led.colors.red;
Led.green = Led.colors.green;
Led.blue = Led.colors.blue;
Led.yellow = Led.colors.yellow;
Led.cyan = Led.colors.cyan;
Led.magenta = Led.colors.magenta;
Led.orange = Led.colors.orange;
Led.white = Led.colors.white;

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
