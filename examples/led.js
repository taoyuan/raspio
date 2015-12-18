"use strict";

var async = require('async');
//var wpi = require('../').wpi;
var LED = require('../').LED;

//wpi.setup('gpio');

var led = new LED([17, 18, 27], true);

led.brightness(10);

async.series([
  function (cb) {
    led.light(LED.red);
    setTimeout(cb, 2000);
  },
  function (cb) {
    led.light(LED.green);
    setTimeout(cb, 2000);
  },
  function (cb) {
    led.light(LED.blue);
    setTimeout(cb, 2000);
  },
  function (cb) {
    led.blink(LED.cyan, 500);
    setTimeout(cb, 5000);
  },
  function (cb) {
    led.fadeup(LED.white, 10);
    setTimeout(cb, 5000);
  },
  function (cb) {
    led.fadedown(LED.white, 10);
    setTimeout(cb, 5000);
  },
  function (cb) {
    led.breath(LED.green, 10);
    setTimeout(cb, 5000);
  }
], function () {
});


