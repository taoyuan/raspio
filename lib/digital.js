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

    this.options = options = Object.assign({
      invert: false
    }, options);

    const pullUpDown = (() => {
      if (options.pullUpDown === 'up') {
        return GPIO.PUD_UP;
      } else if (options.pullUpDown === 'down') {
        return GPIO.PUD_DOWN;
      } else {
        return GPIO.PUD_OFF;
      }
    })();

    this._gpios = _.map(pins, pin => {
      const gpio = new GPIO(pin, {
        uri: options.uri,
        mode: GPIO.INPUT,
        edge: GPIO.EITHER_EDGE,
        pullUpDown: pullUpDown
      });
      gpio.on('interrupt', async level => await this._update(false));
      return gpio;
    });

    process.nextTick(async () => await this._update(true));
  }


  async _update(force) {
    const data = await this.read();
    if (!this.data || this.data.value !== data.value || force) {
      this.data = data;
      this.emit('data', data);
    }
  };

  async read() {
    await PromiseA.all(_.map(this._gpios, gpio => gpio.$ready));
    let bit = 0, value = 0, bits = [];
    for (let i = 0; i < this._gpios.length; i++) {
      const gpio = this._gpios[i];
      bit = await gpio.digitalRead();
      if (this.options.invert) {
        bit = bit ? 0 : 1;
      }
      bits[i] = bit;
      value |= bit << i;
    }
    return {value: value, bits: bits}
  };
}

module.exports = Digital;
