"use strict";

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var wpi = require('./wpi');

module.exports = GPIO;

function GPIO(pin, mode, pullUpDown) {
  if (!(this instanceof GPIO)) {
    return new GPIO(pin, mode, pullUpDown);
  }

  if (typeof pin != 'number') {
    throw new Error('Invalid GPIO pin "' + pin + '". Pin must be a number');
  }

  if (mode != GPIO.INPUT && mode != GPIO.OUTPUT) {
    throw new Error('Invalid GPIO mode "' + mode + '". Mode must be either raspi.GPIO.INPUT or raspi.GPIO.OUTPUT');
  }

  if (typeof pullUpDown !== 'undefined' && [
      GPIO.PUD_OFF,
      GPIO.PUD_DOWN,
      GPIO.PUD_UP
    ].indexOf(pullUpDown) === -1) {
    throw new Error('Invalid GPIO pull up/down setting "' + pullUpDown +
      '". Pull Up/Down must be a constant specified in raspi.constants');
  }

  EventEmitter.call(this);

  Object.defineProperty(this, 'pin', {
    value: pin
  });

  Object.defineProperty(this, 'mode', {
    value: mode
  });
  wpi.pinMode(pin, mode);

  if (typeof pullUpDown != 'undefined') {
    Object.defineProperty(this, 'pullUpDown', {
        value: pullUpDown
      }
    );
    wpi.pullUpDnControl(pin, pullUpDown);
  }
}

util.inherits(GPIO, EventEmitter);

GPIO.INPUT = wpi.INPUT;
GPIO.OUTPUT = wpi.OUTPUT;

GPIO.PUD_OFF = wpi.PUD_OFF;
GPIO.PUD_DOWN = wpi.PUD_DOWN;
GPIO.PUD_UP = wpi.PUD_UP;

GPIO.LOW = wpi.LOW;
GPIO.HIGH = wpi.HIGH;

GPIO.EDGE_FALLING = wpi.INT_EDGE_FALLING;
GPIO.EDGE_RISING = wpi.INT_EDGE_RISING;
GPIO.EDGE_BOTH = wpi.INT_EDGE_BOTH;
GPIO.EDGE_SETUP = wpi.INT_EDGE_SETUP;

GPIO.prototype.isInterruptEnabled = function (edge) {
  return this._interrupt;
};

GPIO.prototype.enableInterrupt = function (edge) {
  if (this._interrupt) return;

  var that = this;

  if (edge === undefined || edge === null) {
    edge = GPIO.EDGE_BOTH;
  }

  wpi.wiringPiISR(this.pin, edge, function () {
    that.emit('interrupt', that.read());
  });
  this._interrupt = true;
};

GPIO.prototype.disableInterrupt = function () {
  if (!this._interrupt) return;
  wpi.wiringPiISRCancel(this.pin);
  this._interrupt = false;
};

GPIO.prototype.read =
  GPIO.prototype.digitalRead = function digitalRead() {
    return wpi.digitalRead(this.pin);
  };

GPIO.prototype.digitalWrite = function digitalWrite(value) {
  if (value != GPIO.LOW && value != GPIO.HIGH) {
    throw new Error('Invalid write value "' + value + '". Value must be raspi.constants.LOW or raspi.constants.HIGH');
  }
  wpi.digitalWrite(this.pin, value);
};

GPIO.prototype.write = function write(value) {
  wpi.digitalWrite(this.pin, value ? GPIO.HIGH : GPIO.LOW);
};
