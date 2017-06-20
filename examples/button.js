"use strict";

const Button = require('..').Button;
const c = require('./constants');

const button = new Button(c.PIN_BTN, {invert: true});

button.on('down', function () {
  console.log('down');
});

button.on('up', function () {
  console.log('up');
});

button.click(function (clicks) {
  console.log('clicks', clicks);
});

button.press(3000, function (time) {
  console.log('press [3000ms]', time);
});

button.press(5000, function (time) {
  console.log('press [5000ms]', time);
});

