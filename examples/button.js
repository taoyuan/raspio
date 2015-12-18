"use strict";

var Button = require('../').Button;

var button = new Button(5, {invert: true});

button.click(function (clicks) {
  console.log('clicks', clicks);
});

button.press(3000, function (time) {
  console.log('press [3000ms]', time);
});

button.press(5000, function (time) {
  console.log('press [5000ms]', time);
});

