"use strict";

var Digital = require('../').Digital;

//var digital = new Digital([4, 24, 23, 25], {invert: true});
var digital = new Digital([6, 4, 5, 7], {invert: true});

digital.on('data', function (data) {
  console.log(data);
});
