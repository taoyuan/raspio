"use strict";

var async = require('async');
var Led = require('../').Led;

var led = new Led([0, 1, 2], true);

led.brightness(100);

async.series([
  function (cb) {
    led.light(Led.red);
    setTimeout(cb, 2000);
  },
  function (cb) {
    led.light(Led.green);
    setTimeout(cb, 2000);
  },
  function (cb) {
    led.light(Led.blue);
    setTimeout(cb, 2000);
  },
  function (cb) {
    led.blink(Led.cyan, 500);
    setTimeout(cb, 5000);
  },
  function (cb) {
    led.fadeup(Led.white, 10);
    setTimeout(cb, 5000);
  },
  function (cb) {
    led.fadedown(Led.white, 10);
    setTimeout(cb, 5000);
  },
  function (cb) {
    led.breath(Led.green, 10);
    setTimeout(cb, 5000);
  },
  function (cb) {
    led.light(Led.black);
    setTimeout(cb, 5000);
  }
], function () {
});


