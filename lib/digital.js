"use strict";

const _ = require('lodash');
const util = require('util');
const EventEmitter = require('events').EventEmitter;
const GPIO = require('./gpio');

class Digital extends EventEmitter {

  constructor(pins, options) {
    super();
    if (!pins) throw new Error('`pins` is required');

    pins = Array.isArray(pins) ? pins : [pins];

    this.options = _.defaults(options || {}, {
      invert: false
    });

    this._gpios = _.map(pins, pin => {
      const gpio = new GPIO(pin, {
        mode: GPIO.INPUT,
        edge: GPIO.EITHER_EDGE
      });
      gpio.on('interrupt', level => this._update(false));
      return gpio;
    });

    process.nextTick(() => this._update(true));
  }


  _update(force) {
    const data = this.read();
    if (!this.data || this.data.value !== data.value || force) {
      this.data = data;
      this.emit('data', data);
    }
  };

  read() {
    let bit = 0, value = 0, bits = [];
    _.forEach(this._gpios, (gpio, i) => {
      bit = gpio.digitalRead();
      if (this.options.invert) {
        bit = bit ? 0 : 1;
      }
      bits[i] = bit;
      value |= bit << i;
    });
    return {value: value, bits: bits}
  };
}

module.exports = Digital;
