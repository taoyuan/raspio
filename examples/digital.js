"use strict";

const Digital = require('..').Digital;
const c = require('./constants');

//var digital = new Digital([4, 24, 23, 25], {invert: true});
const digital = new Digital([c.PIN_DIGITAL_1, c.PIN_DIGITAL_2, c.PIN_DIGITAL_4, c.PIN_DIGITAL_8], {invert: true});

digital.on('data', function (data) {
  console.log(data);
});
