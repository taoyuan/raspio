const EventEmitter = require('events').EventEmitter;
const PromiseA = require('bluebird');
const Gpio = require('onoff').Gpio;
const pinout = require('./pinout');

/**
 * @class GPIO
 * @extends EventEmitter
 */
class GPIO extends EventEmitter {
  constructor(pin, options) {
    super();

    this._pin = pinout.map(pin);
    options = options || {};

    const direction = options.mode || options.direction;
    const edge = options.edge;

    this._gpio = new Gpio(this._pin, direction, edge);

    this._applyInterrupt(edge);
  }

  _applyInterrupt(edge) {
    if (edge === 'none') {
      this._gpio.unwatchAll();
    } else if (edge) {
      this._gpio.watch((err, data) => {
        if (err) {
          return this.emit('error', err);
        }
        this.emit('interrupt', data);
      });
    }
  }

  close() {
    this._gpio.unexport();
  }

  direction(direction) {
    if (!direction) {
      return this._gpio.direction();
    }
    this._gpio.setDirection(direction);
  }

  mode(mode) {
    return this.direction(...arguments);
  }

  edge(edge) {
    if (!edge) {
      return this._gpio.edge();
    }
    this._gpio.setEdge(edge);
    this._applyInterrupt(edge);
  }

  async digitalRead() {
    return await PromiseA.fromCallback(cb => this._gpio.read(cb));
  }

  async digitalWrite(value) {
    return await PromiseA.fromCallback(cb => this._gpio.write(value ? GPIO.HIGH : GPIO.LOW, cb));
  }

  async read() {
    return await this.digitalRead();
  }

  async write(value) {
    return await this.digitalWrite(value);
  }

  digitalReadSync() {
    return this._gpio.readSync();
  }

  digitalWriteSync(value) {
    return this._gpio.writeSync(value ? GPIO.HIGH : GPIO.LOW);
  }

  readSync() {
    return this.digitalReadSync();
  }

  writeSync(value) {
    return this.digitalWriteSync(value ? GPIO.HIGH : GPIO.LOW);
  }

}

/* levels */
GPIO.OFF = 0;
GPIO.LOW = 0;
GPIO.CLEAR = 0;

GPIO.ON = 1;
GPIO.HIGH = 1;
GPIO.SET = 1;

/* mode */
GPIO.INPUT = 'in'; // PI_INPUT
GPIO.OUTPUT = 'out'; //PI_OUTPUT;

/* isr */
GPIO.EDGE_NONE = 'none';
GPIO.EDGE_RISING = 'rising';
GPIO.EDGE_FALLING = 'falling';
GPIO.EDGE_EITHER = 'both';

module.exports = GPIO;
