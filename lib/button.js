"use strict";

var _ = require('lodash');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var GPIO = require('pigpio').Gpio;

module.exports = Button;

function Button(pin, options) {
  if (!(this instanceof Button)) {
    return new Button(pin, options);
  }

  this.options = options = _.defaults(options || {}, {
    invert: false,
    pullup: false,
    clickTime: 250,
    pressTime: 1000
  });

  this._lastState = 0;
  this._lastTime = 0;

  this._clicks = 0;

  var btn = this._btn = new GPIO(pin, {
    mode: GPIO.INPUT,
    edge: GPIO.EITHER_EDGE
  });

  if (options.pullup) {
    btn.pullUpDown(GPIO.PUD_UP);
  }

  this._update_fn = this._update.bind(this);

  btn.on('interrupt', this._update_fn);
}

util.inherits(Button, EventEmitter);

Button.prototype._cancelTimer = function (level) {
  if (this._timer) {
    clearTimeout(this._timer);
    this._timer = null;
  }
};

Button.prototype._update = function (level) {
  var options = this.options;

  if (options.invert) {
    level = level ? 0 : 1;
  }

  this._cancelTimer();

  var time = Date.now();


  if (this._lastState !== level) {
    if (!level && (time - this._lastTime < options.pressTime)) {
      this._clicks++;
    }

    if (level) { // down
      this._resetPressHandlers();
      this._timer = setTimeout(this._pressing.bind(this), options.pressTime);
    } else { // up
      this._timer = setTimeout(this._up.bind(this), options.clickTime);
    }
  }

  this._lastTime = time;
  this._lastState = level;

};

Button.prototype._up = function () {
  if (this._clicks > 0) {
    this.emit('click', this._clicks);
  }
  this._clicks = 0;
};

Button.prototype._pressing = function () {
  this._clicks = 0;
  this._emitPress(Date.now() - this._lastTime);
  this._timer = setTimeout(this._pressing.bind(this), 500);
};

Button.prototype._emitPress = function (time) {
  var that = this;
  _.forEach(this._pressHandlers, function (item) {
    if (!item.handled) {
      if (!time || (item.time && time > item.time)) {
        item.handler.call(that, time);
        item.handled = true;
      }
    }
  });
};

Button.prototype._resetPressHandlers = function () {
  _.forEach(this._pressHandlers, function (item) {
    item.handled = false;
  });
};

Button.prototype._findPressHandlerIndex = function (handler) {
  return _.findIndex(this._pressHandlers, function (item) {
    return item.handler === handler;
  });
};

Button.prototype.press = function (time, handler) {
  if (typeof time === 'function') {
    handler = time;
    time = 0;
  }
  time = time || 1000;

  this._pressHandlers = this._pressHandlers || [];

  var i = this._findPressHandlerIndex(handler);
  var item = i >= 0 ? this._pressHandlers[i] : null;
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

Button.prototype.unpress = function (handler) {
  var i = this._findPressHandlerIndex(handler);
  if (i >= 0) {
    this._pressHandlers.splice(i, 1);
  }
};

Button.prototype.click = function (handler) {
  this.on('click', handler);
};
