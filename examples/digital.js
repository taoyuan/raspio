"use strict";

var Digital = require('../').Digital;

//var digital = new Digital([4, 24, 23, 25], {invert: true});
var digital = new Digital([23, 25, 4, 24], {invert: true});

digital.on('data', function (data) {
  console.log(data);
});
