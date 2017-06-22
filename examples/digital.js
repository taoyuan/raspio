"use strict";

const Digital = require('..').Digital;
const pins = require('./pins').pins;

//var digital = new Digital([4, 24, 23, 25], {invert: true});
const digital = new Digital([pins.PIN_DIGITAL_1, pins.PIN_DIGITAL_2, pins.PIN_DIGITAL_4, pins.PIN_DIGITAL_8],
  {invert: true, uri: 'raspberrypi.local'});

digital.on('data', function (data) {
  console.log(data);
});
