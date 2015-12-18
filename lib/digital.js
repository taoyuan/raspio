"use strict";

var _ = require('lodash');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var GPIO = require('pigpio').Gpio;

module.exports = Digital;

function Digital(pins, options) {
  if (!pins) throw new Error('`pins` is required');

  pins = Array.isArray(pins) ? pins : [pins];

  this.options = _.defaults(options || {}, {
    invert: false
  });

  var that = this;
  var gpio;
  this._gpios = _.transform(pins, function (result, pin) {
    gpio = new GPIO(pin, {
      mode: GPIO.INPUT,
      edge: GPIO.EITHER_EDGE
    });
    gpio.on('interrupt', function () {
      that._update();
    });
    result.push(gpio);
  });

  process.nextTick(function () {
    that._update(true);
  });
}

util.inherits(Digital, EventEmitter);

Digital.prototype._update = function (force) {
  var data = this.read();
  if (!this.data || this.data.value !== data.value || force) {
    this.data = data;
    this.emit('data', data);
  }
};

Digital.prototype.read = function () {
  var that = this;
  var bit = 0, value = 0, bits = [];
  _.forEach(this._gpios, function (gpio, i) {
    bit = gpio.digitalRead();
    if (that.options.invert) {
      bit = bit ? 0 : 1;
    }
    bits[i] = bit;
    value |= bit << i;
  });
  return {value: value, bits: bits}
};
