"use strict";

const _ = require('lodash');
const {EventEmitter} = require('events');
const GPIO = require('./gpio');

class Button extends EventEmitter {

  constructor(pin, options) {
    super();

    this.options = Object.assign({
      invert: false,
      pullUpDown: null,
      clickTime: 250,
      pressTime: 1000
    }, options);

    this._lastState = 0;
    this._lastTime = 0;

    this._clicks = 0;

    const gpio = this._gpio = new GPIO(pin, {
      mode: GPIO.INPUT,
      edge: GPIO.EDGE_EITHER
    });

    gpio.on('interrupt', level => this._update(level));
  }

  close() {
    this._cancelTimer();
    this._gpio.close();
  };

  _cancelTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  };

  _update(level) {
    const options = this.options;

    if (options.invert) {
      level = level ? 0 : 1;
    }

    this._cancelTimer();

    const time = Date.now();


    if (this._lastState !== level) {
      if (!level && (time - this._lastTime < options.pressTime)) {
        this._clicks++;
      }

      if (level) { // down
        this._resetPressHandlers();
        this._timer = setTimeout(() => this._pressing(), options.pressTime);
        this.emit('down');
      } else { // up
        this._timer = setTimeout(() => this._up(), options.clickTime);
        this.emit('up');
      }
    }

    this._lastTime = time;
    this._lastState = level;

  };

  _up() {
    if (this._clicks > 0) {
      this.emit('click', this._clicks);
    }
    this._clicks = 0;
  };

  _pressing() {
    this._clicks = 0;
    this._emitPress(Date.now() - this._lastTime);
    this._timer = setTimeout(() => this._pressing(), 500);
  };

  _emitPress(time) {
    _.forEach(this._pressHandlers, item => {
      if (!item.handled) {
        if (!time || (item.time && time > item.time)) {
          item.handler.call(this, time);
          item.handled = true;
        }
      }
    });
  };

  _resetPressHandlers() {
    _.forEach(this._pressHandlers, item => {
      item.handled = false;
    });
  };

  _findPressHandlerIndex(handler) {
    return _.findIndex(this._pressHandlers, item => {
      return item.handler === handler;
    });
  };

  press(time, handler) {
    if (typeof time === 'function') {
      handler = time;
      time = 0;
    }
    time = time || 1000;

    this._pressHandlers = this._pressHandlers || [];

    const i = this._findPressHandlerIndex(handler);
    let item = i >= 0 ? this._pressHandlers[i] : null;
    if (!item) {
      item = {
        time: time,
        handler: handler,
        handled: false
      };
      this._pressHandlers.push(item);
    }

    item.time = time;
  };

  unpress(handler) {
    const i = this._findPressHandlerIndex(handler);
    if (i >= 0) {
      this._pressHandlers.splice(i, 1);
    }
  };

  click(handler) {
    this.on('click', handler);
  };

}

module.exports = Button;
