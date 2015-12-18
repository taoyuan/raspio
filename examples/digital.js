"use strict";

var Digital = require('../').Digital;

var digital = new Digital([4, 24, 23, 25]);

digital.on('data', function (value, data) {
  console.log(value, data);
});
