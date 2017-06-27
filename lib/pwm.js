const PromiseA = require('bluebird');
const pinout = require('./pinout');
const blaster = require('./blaster');

class PWM {

  constructor(pin, options) {
    this._pin = pinout.map(pin);
    options = options || {};
    this._range = options.range;
  }

  _calc(value) {
    const range = this._range || 1;
    if (value >= range) {
      return 1;
    } else if (value <= 0) {
      return 0;
    }
    return (value / range).toFixed(2);
  }

  async write(value) {
    return await PromiseA.fromCallback(cb => blaster.write(this._pin, this._calc(value), cb));
  }

  writeSync(value) {
    return blaster.writeSync(this._pin, this._calc(value));
  }

  async release() {
    return await PromiseA.fromCallback(cb => blaster.release(this._pin, cb));
  }

  releaseSync() {
    return blaster.releaseSync(this._pin);
  }

  async close() {
    return await this.release();
  }

  closeSync(value) {
    return this.releaseSync();
  }
}

module.exports = PWM;
